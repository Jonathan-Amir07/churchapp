import { IsString, IsNotEmpty } from 'class-validator';

export class QrGenerateDto {
  @IsString()
  @IsNotEmpty()
  classId: string;
}

export class QrScanDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
