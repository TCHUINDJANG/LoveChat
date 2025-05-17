import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from '../entity/media.entity';
import { User } from 'src/user/entities/user.entity';
import { UploadService } from 'src/upload/upload/upload.service';
import { NotFoundException } from '@nestjs/common';


@Injectable()
export class MediaService {
    constructor(
        @InjectRepository(Media)
        private readonly mediaRepository: Repository<Media>,
        private readonly fileService: UploadService,
    ) {}


    async addMediaUser(user:User , file: Express.Multer.File) {
        let mediaData : Partial<Media>;

        if(file.mimetype.startsWith('image/')) {
            const processed = await this.fileService.processImage(file);
            mediaData = {
                filename:processed.original,
                thumbnail:processed.thumbnail,
                type:'image',
            };
        } else if (file.mimetype.startsWith('video/')) {
            mediaData = {
                filename: file.filename,
                type:'video',
            };
        }  else {
            mediaData = {
                filename:file.filename,
                type:'audio',
            };
        }

        const media = this.mediaRepository.create({
            ...mediaData , 
            user,
        });

        return this.mediaRepository.save(media);
    }

    getUserMedia(userId:string) {
        return this.mediaRepository.find({
            where: {user: { id:userId}},
        });
    }


    async deleteMedia (mediaId: number, userId: string) {
        
        const media = await this.mediaRepository.findOne({
            where: {id: mediaId , user: {id:userId}}
        });

         if(!media) {
            throw new NotFoundException('Media not found');
         }


         await this.fileService.deleteFile(media.filename);
         if(media.thumbnail) {
            await this.fileService.deleteFile(media.thumbnail);
         }

         return this.mediaRepository.remove(media);
    }


}
