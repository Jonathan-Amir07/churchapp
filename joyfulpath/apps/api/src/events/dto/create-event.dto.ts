import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsBoolean,
  IsInt,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsInt()
  @IsNotEmpty()
  maxCapacity: number;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
