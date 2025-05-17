import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const randomName = uuidv4();
            return cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
        fileFilter: (req, file, cb) => {
          const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'audio/mpeg'];
          if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Type de fichier non autorisé'), false);
          }
          cb(null, true);
        },
        limits: {
          fileSize: 50 * 1024 * 1024, // 50MB
        },
      }),
    }),
  ],
  providers: [UploadService],
  controllers: [UploadController]
})
export class UploadModule {}
