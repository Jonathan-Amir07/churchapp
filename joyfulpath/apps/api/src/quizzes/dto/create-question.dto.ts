import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AnswerDto {
  @IsString()
  @IsNotEmpty()
  answerText: string;

  @IsString()
  @IsOptional()
  isCorrect?: boolean;
}

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  questionType: string; // 'MCQ', 'TF', 'SHORT'

  @IsString()
  @IsNotEmpty()
  questionText: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  pointsValue?: number;

  @IsString()
  @IsOptional()
  explanation?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  @IsOptional()
  answers?: AnswerDto[];
}
