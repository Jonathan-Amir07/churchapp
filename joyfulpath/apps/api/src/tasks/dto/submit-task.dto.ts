import { IsString, IsOptional } from 'class-validator';

export class SubmitTaskDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  attachmentUrl?: string;
}
