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

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
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
