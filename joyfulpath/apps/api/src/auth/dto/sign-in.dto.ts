import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['admin', 'priest', 'instructor', 'parent', 'student'])
  role!: string;
}
