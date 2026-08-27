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

  async findAll(currentUser: any, query: any) {
    const { name, phone, school, address, page = 1, limit = 10, sortBy = 'createdAt', sortDesc = 'true' } = query;
    const where: Prisma.UserWhereInput = {};

    // Advanced search filters
    if (name) {
      where.OR = [
        { firstName: { contains: name, mode: 'insensitive' } },
        { lastName: { contains: name, mode: 'insensitive' } },
        { displayName: { contains: name, mode: 'insensitive' } },
      ];
    }
    if (phone) where.phone = { contains: phone };
    if (school) where.school = { contains: school, mode: 'insensitive' };
    if (address) where.address = { contains: address, mode: 'insensitive' };

    // Role-based visibility
    if (currentUser.role === 'student') {
      where.id = currentUser.userId;
    } else if (currentUser.role === 'parent') {
      const parentUser = await this.prisma.user.findUnique({
        where: { id: currentUser.userId },
      });
      if (parentUser?.familyId) {
        where.familyId = parentUser.familyId;
      } else {
        where.id = currentUser.userId; // fallback if no family
      }
    } else if (currentUser.role === 'instructor') {
      const classes = await this.prisma.class.findMany({
        where: { createdBy: currentUser.userId },
      });
      const classIds = classes.map((c) => c.id);
      where.classMembers = {
        some: { classId: { in: classIds } },
      };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    const orderBy = { [sortBy]: sortDesc === 'true' ? 'desc' : 'asc' };

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({ where, skip, take, orderBy }),
      this.prisma.user.count({ where }),
    ]);

    return { data, total, page: Number(page), limit: take };
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
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user || !user.familyId) return [];

    return this.prisma.user.findMany({
      where: {
        familyId: user.familyId,
        id: { not: id },
        role: 'student',
      },
    });
  }

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByUsernameOrEmail(identifier: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier }],
      },
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
        deletedAt: new Date(),
      },
    });
  }

  async importExcel(fileBuffer: Buffer): Promise<any> {
    const xlsx = await import('xlsx');
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json<any>(sheet);

    if (rows.length === 0) throw new Error('Excel file is empty or missing data');

    const results = { created: 0, duplicate: 0, invalid: 0, failed: 0, reasons: [] as string[] };

    await this.prisma.$transaction(async (tx) => {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        try {
          if (!row.firstName || !row.lastName) {
            results.invalid++;
            results.reasons.push(`Row ${i + 2}: Missing firstName or lastName`);
            continue;
          }

          let username = row.username;
          if (!username) {
            const baseUsername = `${row.firstName}.${row.lastName}`.toLowerCase().replace(/[^a-z0-9]/g, '');
            const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            username = `${baseUsername}${randomSuffix}`;
          }

          // Check duplicate
          const existing = await tx.user.findFirst({
            where: {
              OR: [
                { username: username },
                ...(row.email ? [{ email: row.email }] : []),
              ]
            }
          });

          if (existing) {
            results.duplicate++;
            results.reasons.push(`Row ${i + 2}: Duplicate username or email`);
            continue;
          }

          const passwordHash = await bcrypt.hash(row.password || 'Welcome123!', 10);

          await tx.user.create({
            data: {
              firstName: row.firstName,
              lastName: row.lastName,
              displayName: row.displayName || `${row.firstName} ${row.lastName}`,
              username: username,
              email: row.email || null,
              passwordHash,
              role: row.role || 'student',
              churchId: row.churchId || null,
              branchId: row.branchId || null,
              forcePasswordChange: true,
            },
          });
          results.created++;
        } catch (err: any) {
          results.failed++;
          results.reasons.push(`Row ${i + 2}: ${err.message}`);
          throw new Error('Transaction rolled back due to error'); // Will rollback transaction
        }
      }
    });

    return results;
  }
}
