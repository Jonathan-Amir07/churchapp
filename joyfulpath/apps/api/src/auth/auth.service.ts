import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string, role: string): Promise<any> {
    const user = await this.usersService.findByUsernameOrEmail(username);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (user.role !== role) {
      throw new UnauthorizedException('Role mismatch');
    }

    // Fallback: If user has a pinHash, check it. Otherwise check passwordHash.
    // For students, they might log in with a PIN.
    let isMatch = false;
    if (user.role === 'student' && user.pinHash) {
      isMatch = await bcrypt.compare(pass, user.pinHash);
    }
    if (!isMatch) {
      isMatch = await bcrypt.compare(pass, user.passwordHash);
    }

    if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive)
      throw new UnauthorizedException('Account is deactivated');

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      forcePasswordChange: user.forcePasswordChange,
      accountStatus: user.accountStatus,
      isProfileComplete: user.isProfileComplete,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        role: user.role,
        forcePasswordChange: user.forcePasswordChange,
        displayName: user.displayName,
      },
    };
  }

  async refreshToken(userId: string): Promise<string> {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid or deactivated user');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      forcePasswordChange: user.forcePasswordChange,
      accountStatus: user.accountStatus,
      isProfileComplete: user.isProfileComplete,
    };

    return this.jwtService.signAsync(payload);
  }

  async changePassword(userId: string, newPass: string): Promise<string> {
    await this.usersService.changePassword(userId, newPass);
    return this.refreshToken(userId);
  }

  async forgotPassword(
    email: string,
  ): Promise<{ message: string; token?: string }> {
    const user = await this.usersService.findByUsernameOrEmail(email);
    if (!user) {
      // Return same response to prevent email enumeration
      return {
        message: 'If that email is registered, a reset link has been sent.',
      };
    }

    const payload = { sub: user.id, purpose: 'password-reset' };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    // We would inject MailService here, but since AuthService doesn't have it yet,
    // we'll return the token to the controller to handle, or we can inject MailService.
    return {
      message: 'If that email is registered, a reset link has been sent.',
      token,
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      if (payload.purpose !== 'password-reset') {
        throw new UnauthorizedException('Invalid token purpose');
      }

      await this.usersService.resetPassword(payload.sub, newPassword);
      return { message: 'Password has been successfully reset' };
    } catch (e) {
      throw new UnauthorizedException(
        'Invalid or expired password reset token',
      );
    }
  }
}
