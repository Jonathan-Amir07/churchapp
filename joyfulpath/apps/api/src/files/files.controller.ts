import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  BadRequestException,
  UseGuards 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import * as crypto from 'crypto';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB max
    },
    fileFilter: (req, file, cb) => {
      // Validate secure file types
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestException('Invalid file type'), false);
      }
    }
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    
    // In a real application we would stream this to S3.
    // Here we generate a mock URL indicating success since we don't have S3 configured.
    // If local disk was required, we would use Multer's diskStorage.
    const fileId = crypto.randomUUID();
    const ext = file.originalname.split('.').pop();
    
    return {
      url: `https://storage.joyfulpath.local/uploads/${fileId}.${ext}`,
      filename: file.originalname,
      size: file.size,
    };
  }
}
