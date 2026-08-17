import { IsString, IsNotEmpty, IsInt, IsOptional, Min } from 'class-validator';

export class AddAttachmentDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @IsString()
  @IsNotEmpty()
  fileType: string;

  @IsInt()
  @Min(0)
  fileSize: number;
}
