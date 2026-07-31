const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const apiSrc = path.join(__dirname, 'src');

// 1. Add ValidationPipe globally in main.ts
const mainTsPath = path.join(apiSrc, 'main.ts');
const mainTs = `import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');
  await app.listen(3001);
}
bootstrap();
`;
fs.writeFileSync(mainTsPath, mainTs);

// 2. Install class-validator and class-transformer
try {
  execSync('npm i class-validator class-transformer', { stdio: 'inherit' });
} catch(e) {}

// 3. Create User DTO
const userDtoPath = path.join(apiSrc, 'users', 'dto');
if (!fs.existsSync(userDtoPath)) fs.mkdirSync(userDtoPath);
const createDto = `import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  displayName: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  passwordHash: string;

  @IsString()
  @IsOptional()
  role?: string;
}
`;
fs.writeFileSync(path.join(userDtoPath, 'create-user.dto.ts'), createDto);

console.log('DTOs and Validation added.');
