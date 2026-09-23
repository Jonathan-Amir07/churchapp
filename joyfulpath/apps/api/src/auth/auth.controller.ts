import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { MailService } from '../mail/mail.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mailService: MailService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: any,
  ) {
    const result = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
      signInDto.role,
    );

    response.cookie('ACCESS_TOKEN', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 2 * 60 * 60 * 1000, // 2 hours in ms
    });

    return result;
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    const result = await this.authService.forgotPassword(email);
    if (result.token) {
      await this.mailService.sendPasswordResetEmail(email, result.token);
    }
    return { message: result.message };
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('password') password: string,
  ) {
    return this.authService.resetPassword(token, password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Req() req: any,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: any,
  ) {
    const newToken = await this.authService.changePassword(req.user.userId, password);
    
    response.cookie('ACCESS_TOKEN', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 2 * 60 * 60 * 1000,
    });

    return { message: 'Password successfully updated' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('refresh')
  async refresh(
    @Req() req: any,
    @Res({ passthrough: true }) response: any,
  ) {
    const newToken = await this.authService.refreshToken(req.user.userId);
    
    response.cookie('ACCESS_TOKEN', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 2 * 60 * 60 * 1000,
    });

    return { success: true };
  }
}
