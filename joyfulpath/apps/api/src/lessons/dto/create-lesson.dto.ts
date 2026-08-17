import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsArray } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  classId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  bibleReferences?: string;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  xpReward?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  pointsReward?: number;

  @IsInt()
  @IsOptional()
  orderIndex?: number;

  @IsString()
  @IsOptional()
  status?: string;
}
