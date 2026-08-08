import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsBoolean, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  classId: string;

  @IsString()
  @IsOptional()
  lessonId?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  taskType: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  xpReward?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  pointsReward?: number;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsInt()
  @IsOptional()
  maxSubmissions?: number;

  @IsBoolean()
  @IsOptional()
  allowLate?: boolean;

  @IsString()
  @IsOptional()
  status?: string;
}
