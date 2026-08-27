/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as xlsx from 'xlsx';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllStudents() {
    return this.prisma.user.findMany({
      where: { role: 'student' },
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
    });
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

  async executeImport(validRows: any[]) {
    const results = [];
    const errors = [];

    for (const row of validRows) {
      try {
        const rawPassword = row.password || this.generateRandomPassword();
        const passwordHash = await bcrypt.hash(rawPassword, 10);

        await this.prisma.user.create({
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
          },
        });

        results.push({
          studentName: row.studentName,
          username: row.username,
          temporaryPassword: rawPassword,
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
