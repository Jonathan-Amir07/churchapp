const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Install Auth dependencies
try {
  execSync('npm i @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs', { stdio: 'inherit' });
  execSync('npm i -D @types/passport-jwt @types/bcryptjs', { stdio: 'inherit' });
} catch(e) {}

const srcDir = path.join(__dirname, 'src');
const authDir = path.join(srcDir, 'auth');
if (!fs.existsSync(authDir)) fs.mkdirSync(authDir);

// 2. auth.module.ts
fs.writeFileSync(path.join(authDir, 'auth.module.ts'), `
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'super-secret-key-for-dev',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
`);

// 3. jwt.strategy.ts
fs.writeFileSync(path.join(authDir, 'jwt.strategy.ts'), `
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'super-secret-key-for-dev',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}
`);

// 4. auth.service.ts
fs.writeFileSync(path.join(authDir, 'auth.service.ts'), `
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

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username); // simplified for brevity
    if (!user) throw new UnauthorizedException();
    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException();
    
    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
`);

// 5. roles.guard.ts
const guardsDir = path.join(authDir, 'guards');
if (!fs.existsSync(guardsDir)) fs.mkdirSync(guardsDir);
fs.writeFileSync(path.join(guardsDir, 'roles.guard.ts'), `
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user?.role?.includes(role));
  }
}
`);
fs.writeFileSync(path.join(authDir, 'roles.decorator.ts'), `
import { SetMetadata } from '@nestjs/common';
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
`);

console.log('JWT Auth and Roles Guards added.');
