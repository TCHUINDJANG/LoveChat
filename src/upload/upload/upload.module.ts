import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from '../entity/photo.entity';
import { FileModule } from 'src/common/services/file.module';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Photo , User]), FileModule // Ceci fournit le MediaRepository
    ],
  providers: [UploadService],
  controllers: [UploadController]
})
export class UploadModule {}
