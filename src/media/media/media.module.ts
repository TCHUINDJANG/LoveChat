import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { UploadService } from 'src/upload/upload/upload.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from '../entity/media.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media , User]), // Ceci fournit le MediaRepository
  ],
  providers: [MediaService , UploadService ],
  controllers: [MediaController],
  exports: [MediaService]
})
export class MediaModule {}
