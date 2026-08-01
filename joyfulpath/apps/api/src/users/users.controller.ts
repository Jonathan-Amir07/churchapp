import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@joyfulpath/database';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('admin', 'priest')
  @Post()
  create(@Body() createUserDto: Prisma.UserCreateInput) {
    return this.usersService.create(createUserDto);
  }

  @Roles('admin', 'priest')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles('admin', 'priest')
  @Get('template')
  downloadTemplate(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users_import_template.csv');
    const header = 'firstName,lastName,displayName,username,email,password,role,churchId,branchId,parentName,parentPhone,address\n';
    res.status(200).send(header);
  }

  @Roles('admin', 'priest')
  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importUsers(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new Error('No file provided');
    return this.usersService.importCsv(file.buffer.toString('utf-8'));
  }

  @Roles('admin', 'priest')
  @Post(':id/reset-password')
  resetPassword(@Param('id') id: string, @Body('password') newPass: string) {
    return this.usersService.resetPassword(id, newPass);
  }

  @Roles('admin', 'priest')
  @Patch(':id/toggle-status')
  toggleStatus(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.usersService.update(id, { isActive });
  }

  @Roles('admin', 'priest')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Roles('admin', 'priest')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: Prisma.UserUpdateInput) {
    return this.usersService.update(id, updateUserDto);
  }

  @Roles('admin', 'priest')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id); // Using soft delete or changing status to 'archived' in service
  }
}
