import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreatePrayerRequestDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;
}

export class UpdatePrayerRequestDto {
  @IsBoolean()
  @IsOptional()
  isAddressed?: boolean;

  @IsString()
  @IsOptional()
  response?: string;
}
