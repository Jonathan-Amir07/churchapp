
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(identifier: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsernameOrEmail(identifier);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    
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
    if (!user.isActive) throw new UnauthorizedException('Account is deactivated');
    
    const payload = { 
      sub: user.id, 
      username: user.username, 
      email: user.email, 
      role: user.role,
      forcePasswordChange: user.forcePasswordChange 
    };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        role: user.role,
        forcePasswordChange: user.forcePasswordChange,
        displayName: user.displayName,
      }
    };
  }
}
