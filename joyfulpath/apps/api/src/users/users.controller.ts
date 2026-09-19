import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  Req,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@joyfulpath/database';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { OwnershipGuard } from '../auth/guards/ownership.guard';
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

  @Get()
  findAll(@Req() req: any, @Query() query: any) {
    return this.usersService.findAll(req.user, query);
  }

  @Get('me')
  findMe(@Req() req: any) {
    return this.usersService.findMe(req.user.userId);
  }

  @Patch('complete-profile')
  completeProfile(@Req() req: any, @Body() data: any) {
    return this.usersService.completeProfile(req.user.userId, data);
  }

  @Get(':id/siblings')
  getSiblings(@Param('id') id: string, @Req() req: any) {
    return this.usersService.getSiblings(id, req.user);
  }

  @Roles('admin', 'priest')
  @Get('template')
  downloadTemplate(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=users_import_template.csv',
    );
    const header =
      'firstName,lastName,displayName,username,email,password,role,churchId,branchId,parentName,parentPhone,address\n';
    res.status(200).send(header);
  }

  @Roles('admin', 'priest')
  @Post(':id/reset-password')
  resetPassword(@Param('id') id: string, @Body('password') newPass: string) {
    return this.usersService.resetPassword(id, newPass);
  }

  @Roles('admin', 'priest')
  @Patch(':id/toggle-status')
  toggleStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
    @Req() req: any,
  ) {
    return this.usersService.update(id, { isActive }, req.user);
  }

  @UseGuards(OwnershipGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.usersService.findOne(id, req.user);
  }

  @Roles('admin', 'priest', 'instructor', 'student', 'parent')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: Prisma.UserUpdateInput,
    @Req() req: any,
  ) {
    return this.usersService.update(id, updateUserDto, req.user);
  }

  @Roles('admin', 'priest')
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.usersService.remove(id, req.user); // Using soft delete or changing status to 'archived' in service
  }
}
