import { IsString, IsNotEmpty, IsDateString, IsOptional, IsBoolean } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  eventType?: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  churchId?: string;

  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @IsString()
  @IsOptional()
  recurrenceRule?: string;
}
