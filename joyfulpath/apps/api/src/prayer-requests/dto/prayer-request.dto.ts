import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreatePrayerRequestDto {
  @IsString()
  @IsNotEmpty()
  requestText: string;

  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;
}

export class UpdatePrayerRequestDto {
  @IsBoolean()
  @IsOptional()
  isAnswered?: boolean;

  @IsString()
  @IsOptional()
  response?: string;
}
