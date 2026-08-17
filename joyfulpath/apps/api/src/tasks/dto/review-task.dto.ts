import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class ReviewTaskDto {
  @IsString()
  @IsNotEmpty()
  status: string; // e.g., 'approved', 'rejected', 'graded'

  @IsString()
  @IsNotEmpty()
  feedback: string;

  @IsInt()
  @Min(0)
  xpAwarded: number;

  @IsInt()
  @Min(0)
  pointsAwarded: number;
}
