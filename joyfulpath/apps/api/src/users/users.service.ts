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
    const {
      name,
      username,
      phone,
      school,
      address,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortDesc = 'true',
    } = query;
    const where: Prisma.UserWhereInput = {};

    // Advanced search filters
    if (name) {
      where.OR = [
        { firstName: { contains: name } },
        { lastName: { contains: name } },
        { displayName: { contains: name } },
      ];
    }
    if (username) where.username = { contains: username };
    if (phone) where.phone = { contains: phone };
    if (school) where.school = { contains: school };
    if (address) where.address = { contains: address };

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
    const { fatherName, fatherPhone, motherName, motherPhone, dateOfBirth, ...validData } = data;
    
    // Cast dateOfBirth to Date if present
    const processedData: any = {
      ...validData,
      isProfileComplete: true,
    };
    
    if (dateOfBirth) {
      processedData.dateOfBirth = new Date(dateOfBirth);
    }

    return this.prisma.user.update({
      where: { id },
      data: processedData,
    });
  }

  async getSiblings(id: string, currentUser?: any): Promise<User[]> {
    if (currentUser) {
      await this.verifyUserAccess(id, currentUser);
    }
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

  async findOne(id: string, currentUser?: any): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user || !currentUser) return user;

    await this.verifyUserAccess(id, currentUser, user);
    return user;
  }

  async findMe(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error('Not found');

    delete (user as any).passwordHash;
    delete (user as any).pinHash;
    return user;
  }

  private async verifyUserAccess(
    id: string,
    currentUser: any,
    userObj?: User | null,
  ) {
    if (['admin', 'priest'].includes(currentUser.role)) return;
    if (currentUser.userId === id) return;

    const user =
      userObj || (await this.prisma.user.findUnique({ where: { id } }));
    if (!user) throw new Error('Not found');

    if (currentUser.role === 'parent') {
      const parent = await this.prisma.user.findUnique({
        where: { id: currentUser.userId },
      });
      if (parent?.familyId === user.familyId) return;
      throw new Error("Forbidden: Cannot access another family's data");
    }

    if (currentUser.role === 'instructor') {
      const classes = await this.prisma.class.findMany({
        where: { createdBy: currentUser.userId },
      });
      const classIds = classes.map((c) => c.id);
      const isMember = await this.prisma.classMember.findFirst({
        where: { userId: id, classId: { in: classIds } },
      });
      if (isMember) return;
      throw new Error(
        'Forbidden: Cannot access a student outside your assigned classes',
      );
    }

    throw new Error('Forbidden');
  }

  async findByUsernameOrEmail(identifier: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier }],
      },
    });
  }

  async update(
    id: string,
    data: Prisma.UserUpdateInput,
    currentUser?: any,
  ): Promise<User> {
    if (currentUser) {
      if (currentUser.role === 'instructor') {
        throw new Error('Forbidden: Instructors cannot modify users');
      }
      if (currentUser.role === 'parent') {
        const parent = await this.prisma.user.findUnique({
          where: { id: currentUser.userId },
        });
        const target = await this.prisma.user.findUnique({ where: { id } });
        if (parent?.familyId !== target?.familyId) {
          throw new Error("Forbidden: Cannot modify another family's data");
        }
      }
      if (currentUser.role === 'student' && currentUser.userId !== id) {
        throw new Error(
          'Forbidden: Students can only modify their own profile',
        );
      }
      // Security: Students cannot modify restricted fields
      if (currentUser.role === 'student') {
        delete data.role;
        delete data.isActive;
        delete data.totalXp;
        delete data.totalPoints;
      }
    }
    return this.prisma.user.update({ where: { id }, data });
  }

  async resetPassword(id: string, newPass: string): Promise<User> {
    const passwordHash = await bcrypt.hash(newPass, 10);
    return this.prisma.user.update({
      where: { id },
      data: { passwordHash, forcePasswordChange: true },
    });
  }

  async changePassword(id: string, newPass: string): Promise<User> {
    const passwordHash = await bcrypt.hash(newPass, 10);
    return this.prisma.user.update({
      where: { id },
      data: { passwordHash, forcePasswordChange: false },
    });
  }

  async remove(id: string, currentUser?: any): Promise<User> {
    if (currentUser && !['admin', 'priest'].includes(currentUser.role)) {
      throw new Error('Forbidden: Only admin/priest can remove users');
    }
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
}
