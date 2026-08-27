import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateQuizDto {
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
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  quizType: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  timeLimitSeconds?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxAttempts?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  passingScore?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  xpReward?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  pointsReward?: number;

  @IsBoolean()
  @IsOptional()
  shuffleQuestions?: boolean;

  @IsBoolean()
  @IsOptional()
  showAnswersAfter?: boolean;

  @IsString()
  @IsOptional()
  status?: string;

  @IsDateString()
  @IsOptional()
  availableFrom?: string;

  @IsDateString()
  @IsOptional()
  availableUntil?: string;
}
