/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as xlsx from 'xlsx';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllStudents(params?: {
    search?: string;
    classId?: string;
    skip?: number;
    take?: number;
    userId?: string;
    role?: string;
  }) {
    const where: any = { role: 'student' };

    if (params?.search) {
      where.OR = [
        { firstName: { contains: params.search } },
        { lastName: { contains: params.search } },
        { displayName: { contains: params.search } },
        { username: { contains: params.search } },
      ];
    }

    if (params?.role === 'instructor' && params?.userId) {
      // Instructor can only see students in their classes
      where.classMembers = {
        some: {
          class: {
            OR: [
              { createdBy: params.userId },
              {
                members: {
                  some: { userId: params.userId, role: 'instructor' },
                },
              },
            ],
          },
        },
      };
    }

    if (params?.classId) {
      // Need to AND with existing classMembers if instructor RBAC added it
      const classFilter = { some: { classId: params.classId } };
      if (where.classMembers) {
        where.AND = [
          { classMembers: where.classMembers },
          { classMembers: classFilter },
        ];
        delete where.classMembers;
      } else {
        where.classMembers = classFilter;
      }
    }

    const [total, students] = await this.prisma.$transaction([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          displayName: true,
          phone: true,
          school: true,
          totalXp: true,
          totalPoints: true,
          lastActiveAt: true,
          currentLevel: { select: { levelNumber: true, title: true } },
        },
        orderBy: { firstName: 'asc' },
        skip: params?.skip || 0,
        take: params?.take || 50,
      }),
    ]);

    return {
      data: students,
      total,
      skip: params?.skip || 0,
      take: params?.take || 50,
    };
  }

  async parseExcelFile(buffer: Buffer) {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Parse the sheet to JSON
    const data: any[] = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      defval: null,
    });

    if (!data || data.length === 0) {
      throw new BadRequestException('The uploaded file is empty or invalid.');
    }

    const validRows = [];
    const invalidRows = [];

    // Fetch existing usernames to prevent duplicates
    const existingUsers = await this.prisma.user.findMany({
      select: { username: true },
    });
    const existingUsernames = new Set(existingUsers.map((u) => u.username));

    const excelUsernames = new Set<string>();

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const studentName = row['Student Name']?.trim();
      let username = row['Username']?.trim();
      const password = row['Password']?.trim();
      const year = row['Year']?.trim();
      const dobStr = row['Date of Birth']?.trim();
      const phone = row['Phone']?.trim();

      const errors = [];
      if (!studentName) {
        errors.push('Student Name is required.');
      }

      // Auto-generate username if missing
      if (!username && studentName) {
        username = this.generateUsername(
          studentName,
          existingUsernames,
          excelUsernames,
        );
      }

      // Check duplicate in DB
      if (username && existingUsernames.has(username)) {
        errors.push(`Username '${username}' already exists in the system.`);
      }

      // Check duplicate in Excel
      if (username && excelUsernames.has(username)) {
        errors.push(`Username '${username}' is duplicated in the Excel file.`);
      }

      if (username && !existingUsernames.has(username)) {
        excelUsernames.add(username);
      }

      // Validate dates roughly
      let dob: Date | null = null;
      if (dobStr) {
        const parsedDate = new Date(dobStr);
        if (isNaN(parsedDate.getTime())) {
          errors.push('Invalid Date of Birth format.');
        } else {
          dob = parsedDate;
        }
      }

      const parsedRow = {
        index: i + 2, // Excel row number
        studentName,
        firstName: studentName ? studentName.split(' ')[0] : '',
        lastName:
          studentName && studentName.split(' ').length > 1
            ? studentName.split(' ').slice(1).join(' ')
            : 'User',
        username,
        password,
        year,
        dateOfBirth: dob,
        phone,
        address: row['Address']?.trim(),
        motherName: row['Mother Name']?.trim(),
        motherPhone: row['Mother Phone']?.trim(),
        fatherName: row['Father Name']?.trim(),
        fatherPhone: row['Father Phone']?.trim(),
        siblings: row['Siblings']?.trim(),
      };

      if (errors.length > 0) {
        invalidRows.push({ ...parsedRow, errors });
      } else {
        validRows.push(parsedRow);
      }
    }

    return {
      total: data.length,
      validCount: validRows.length,
      invalidCount: invalidRows.length,
      validRows,
      invalidRows,
    };
  }

  async createStudent(body: any, currentUser: any) {
    return this.prisma.$transaction(async (tx) => {
      let familyId = null;

      // Ensure instructor can only assign to their own class if they provided one
      if (body.classId && currentUser.role === 'instructor') {
        const classRecord = await tx.class.findFirst({
          where: {
            id: body.classId,
            OR: [
              { createdBy: currentUser.userId },
              {
                members: {
                  some: { userId: currentUser.userId, role: 'instructor' },
                },
              },
            ],
          },
        });
        if (!classRecord) {
          throw new BadRequestException(
            'You do not have access to this class.',
          );
        }
      }

      // 1. Create or Find Parents and Family
      if (body.motherPhone || body.fatherPhone) {
        let motherId = null;
        let fatherId = null;

        if (body.motherPhone) {
          const mother = await tx.user.findFirst({
            where: { phone: body.motherPhone, role: 'parent' },
          });
          if (mother) {
            motherId = mother.id;
          } else {
            const m = await tx.user.create({
              data: {
                username: `mother_${body.motherPhone}`,
                passwordHash: await bcrypt.hash('password123', 10),
                firstName: body.motherName?.split(' ')[0] || 'Mother',
                lastName:
                  body.motherName?.split(' ').slice(1).join(' ') || 'User',
                displayName: body.motherName || 'Mother',
                phone: body.motherPhone,
                role: 'parent',
                isActive: true,
              },
            });
            motherId = m.id;
          }
        }

        if (body.fatherPhone) {
          const father = await tx.user.findFirst({
            where: { phone: body.fatherPhone, role: 'parent' },
          });
          if (father) {
            fatherId = father.id;
          } else {
            const f = await tx.user.create({
              data: {
                username: `father_${body.fatherPhone}`,
                passwordHash: await bcrypt.hash('password123', 10),
                firstName: body.fatherName?.split(' ')[0] || 'Father',
                lastName:
                  body.fatherName?.split(' ').slice(1).join(' ') || 'User',
                displayName: body.fatherName || 'Father',
                phone: body.fatherPhone,
                role: 'parent',
                isActive: true,
              },
            });
            fatherId = f.id;
          }
        }

        const existingFamily = await tx.family.findFirst({
          where: { OR: [{ fatherId }, { motherId }] },
        });

        if (existingFamily) {
          familyId = existingFamily.id;
          // Ensure both parents are linked
          if (fatherId && !existingFamily.fatherId) {
            await tx.family.update({
              where: { id: familyId },
              data: { fatherId },
            });
          }
          if (motherId && !existingFamily.motherId) {
            await tx.family.update({
              where: { id: familyId },
              data: { motherId },
            });
          }
        } else {
          const family = await tx.family.create({
            data: {
              name: `Family of ${body.fatherName || body.motherName || 'Student'}`,
              fatherId,
              motherId,
            },
          });
          familyId = family.id;
        }
      }

      // 2. Create Student
      const passwordHash = await bcrypt.hash(
        body.password || 'password123',
        10,
      );
      const student = await tx.user.create({
        data: {
          username: body.username,
          firstName:
            body.firstName || body.studentName?.split(' ')[0] || 'Student',
          lastName:
            body.lastName ||
            body.studentName?.split(' ').slice(1).join(' ') ||
            'User',
          displayName: body.studentName || `${body.firstName} ${body.lastName}`,
          passwordHash,
          role: 'student',
          dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
          phone: body.phone,
          address: body.address,
          schoolYear: body.year,
          isProfileComplete: false,
          isActive: true,
          locale: 'ar',
          familyId,
        },
      });

      // 3. Assign Class
      if (body.classId) {
        await tx.classMember.create({
          data: {
            classId: body.classId,
            userId: student.id,
            role: 'student',
          },
        });
      }

      return student;
    });
  }

  async updateStudent(id: string, body: any, currentUser: any) {
    // Only basic profile update for now
    return this.prisma.user.update({
      where: { id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        displayName: body.displayName || body.studentName,
        phone: body.phone,
        address: body.address,
        schoolYear: body.year,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
      },
    });
  }

  async executeImport(validRows: any[], currentUser: any, classId?: string) {
    const results: any[] = [];
    const errors: any[] = [];

    // Check class access for instructor
    if (classId && currentUser?.role === 'instructor') {
      const classRecord = await this.prisma.class.findFirst({
        where: {
          id: classId,
          OR: [
            { createdBy: currentUser.userId },
            {
              members: {
                some: { userId: currentUser.userId, role: 'instructor' },
              },
            },
          ],
        },
      });
      if (!classRecord) {
        throw new BadRequestException('You do not have access to this class.');
      }
    }

    for (const row of validRows) {
      try {
        await this.prisma.$transaction(async (tx) => {
          let familyId = null;

          if (row.motherPhone || row.fatherPhone) {
            let motherId = null;
            let fatherId = null;

            if (row.motherPhone) {
              const mother = await tx.user.findFirst({
                where: { phone: row.motherPhone, role: 'parent' },
              });
              if (mother) motherId = mother.id;
              else {
                const m = await tx.user.create({
                  data: {
                    username: `mother_${row.motherPhone.replace(/[^0-9]/g, '')}`,
                    passwordHash: await bcrypt.hash('password123', 10),
                    firstName: row.motherName?.split(' ')[0] || 'Mother',
                    lastName:
                      row.motherName?.split(' ').slice(1).join(' ') || 'User',
                    displayName: row.motherName || 'Mother',
                    phone: row.motherPhone,
                    role: 'parent',
                    isActive: true,
                  },
                });
                motherId = m.id;
              }
            }

            if (row.fatherPhone) {
              const father = await tx.user.findFirst({
                where: { phone: row.fatherPhone, role: 'parent' },
              });
              if (father) fatherId = father.id;
              else {
                const f = await tx.user.create({
                  data: {
                    username: `father_${row.fatherPhone.replace(/[^0-9]/g, '')}`,
                    passwordHash: await bcrypt.hash('password123', 10),
                    firstName: row.fatherName?.split(' ')[0] || 'Father',
                    lastName:
                      row.fatherName?.split(' ').slice(1).join(' ') || 'User',
                    displayName: row.fatherName || 'Father',
                    phone: row.fatherPhone,
                    role: 'parent',
                    isActive: true,
                  },
                });
                fatherId = f.id;
              }
            }

            const existingFamily = await tx.family.findFirst({
              where: { OR: [{ fatherId }, { motherId }] },
            });

            if (existingFamily) {
              familyId = existingFamily.id;
              if (fatherId && !existingFamily.fatherId) {
                await tx.family.update({
                  where: { id: familyId },
                  data: { fatherId },
                });
              }
              if (motherId && !existingFamily.motherId) {
                await tx.family.update({
                  where: { id: familyId },
                  data: { motherId },
                });
              }
            } else {
              const family = await tx.family.create({
                data: {
                  name: `Family of ${row.fatherName || row.motherName || row.studentName}`,
                  fatherId,
                  motherId,
                },
              });
              familyId = family.id;
            }
          }

          const rawPassword = row.password || this.generateRandomPassword();
          const passwordHash = await bcrypt.hash(rawPassword, 10);

          const student = await tx.user.create({
            data: {
              username: row.username,
              firstName: row.firstName || 'Student',
              lastName: row.lastName || 'User',
              displayName: row.studentName || 'Student User',
              passwordHash,
              role: 'student',
              dateOfBirth: row.dateOfBirth,
              phone: row.phone,
              address: row.address,
              schoolYear: row.year,
              isProfileComplete: false,
              isActive: true,
              locale: 'ar',
              familyId,
            },
          });

          if (classId) {
            await tx.classMember.create({
              data: {
                classId,
                userId: student.id,
                role: 'student',
              },
            });
          }

          results.push({
            studentName: row.studentName,
            username: row.username,
            temporaryPassword: rawPassword,
          });
        });
      } catch (error: any) {
        errors.push({ row, error: error.message || String(error) });
      }
    }

    return {
      successful: results.length,
      failed: errors.length,
      results,
      errors,
    };
  }

  private generateUsername(
    studentName: string,
    existingUsernames: Set<string>,
    excelUsernames: Set<string>,
  ): string {
    const base = studentName.toLowerCase().replace(/[^a-z0-9]/g, '');
    let suffix = Math.floor(100 + Math.random() * 900).toString();
    let username = `${base}${suffix}`;

    let attempts = 0;
    while (
      (existingUsernames.has(username) || excelUsernames.has(username)) &&
      attempts < 100
    ) {
      suffix = Math.floor(1000 + Math.random() * 9000).toString();
      username = `${base}${suffix}`;
      attempts++;
    }
    return username;
  }

  private generateRandomPassword(): string {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}
