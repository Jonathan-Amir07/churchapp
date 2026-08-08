import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@joyfulpath/database';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findAll(currentUser: any, query: any): Promise<User[]> {
    const { name, phone, school, address } = query;
    const where: Prisma.UserWhereInput = {};

    // Advanced search filters
    if (name) {
      where.OR = [
        { firstName: { contains: name, mode: 'insensitive' } },
        { lastName: { contains: name, mode: 'insensitive' } },
        { displayName: { contains: name, mode: 'insensitive' } }
      ];
    }
    if (phone) where.phone = { contains: phone };
    if (school) where.school = { contains: school, mode: 'insensitive' };
    if (address) where.address = { contains: address, mode: 'insensitive' };
    
    // Role-based visibility
    if (currentUser.role === 'student') {
      where.id = currentUser.userId;
    } else if (currentUser.role === 'parent') {
      const parentUser = await this.prisma.user.findUnique({ where: { id: currentUser.userId }});
      if (parentUser?.familyId) {
        where.familyId = parentUser.familyId;
      } else {
        where.id = currentUser.userId; // fallback if no family
      }
    } else if (currentUser.role === 'instructor') {
      // Find classes where instructor teaches
      const classes = await this.prisma.class.findMany({ where: { createdBy: currentUser.userId } }); // Simplified relation for now
      const classIds = classes.map(c => c.id);
      where.classMembers = {
        some: { classId: { in: classIds } }
      };
    }

    return this.prisma.user.findMany({ where });
  }

  async completeProfile(id: string, data: any): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        isProfileComplete: true,
      },
    });
  }

  async getSiblings(id: string): Promise<User[]> {
    const user = await this.prisma.user.findUnique({ where: { id }});
    if (!user || !user.familyId) return [];
    
    return this.prisma.user.findMany({
      where: {
        familyId: user.familyId,
        id: { not: id },
        role: 'student'
      }
    });
  }

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByUsernameOrEmail(identifier: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [
          { username: identifier },
          { email: identifier }
        ]
      }
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async resetPassword(id: string, newPass: string): Promise<User> {
    const passwordHash = await bcrypt.hash(newPass, 10);
    return this.prisma.user.update({
      where: { id },
      data: { passwordHash, forcePasswordChange: true },
    });
  }

  async remove(id: string): Promise<User> {
    // Soft delete
    return this.prisma.user.update({
      where: { id },
      data: { 
        isActive: false, 
        accountStatus: 'archived',
        deletedAt: new Date()
      }
    });
  }

  async importCsv(csvData: string): Promise<any> {
    const lines = csvData.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length < 2) throw new Error('CSV is empty or missing data');
    
    const headers = lines[0].split(',').map(h => h.trim());
    const results = { imported: 0, errors: [] as string[] };
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const cols = line.split(',').map(c => c.trim());
      
      try {
        const passwordHash = await bcrypt.hash(cols[5] || 'Welcome123!', 10);
        let username = cols[3];
        if (!username) {
          const baseUsername = `${cols[0]}.${cols[1]}`.toLowerCase().replace(/[^a-z0-9]/g, '');
          const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
          username = `${baseUsername}${randomSuffix}`;
        }
        await this.prisma.user.create({
          data: {
            firstName: cols[0],
            lastName: cols[1],
            displayName: cols[2] || `${cols[0]} ${cols[1]}`,
            username: username,
            email: cols[4] || null,
            passwordHash,
            role: cols[6] || 'student',
            churchId: cols[7] || null,
            branchId: cols[8] || null,
            // Assuming we'll save parent info in metadata or separate table later
            forcePasswordChange: true,
          }
        });
        results.imported++;
      } catch (err: any) {
        results.errors.push(`Row ${i + 1}: ${err.message}`);
      }
    }
    
    return results;
  }
}
