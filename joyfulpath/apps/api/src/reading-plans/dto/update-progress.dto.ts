import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class UpdateProgressDto {
  @IsString()
  @IsNotEmpty()
  progress: string;

  @IsBoolean()
  completedToday: boolean;
}
