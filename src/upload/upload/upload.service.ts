import { Injectable , Request } from '@nestjs/common';
import {  BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from '../entity/photo.entity';
import { User } from 'src/user/entities/user.entity';
import { FileService } from 'src/common/services/file.service';
import * as path from 'path';

@Injectable()
export class UploadService {


    constructor(
            @InjectRepository(Photo)
            private readonly photoRepository: Repository<Photo>,

            @InjectRepository(User)
            private readonly userRepository: Repository<User>,

            private readonly fileService : FileService,
        
        
        ){}

    
    async processImage(@Request() req , file: Express.Multer.File , profile:boolean) {


        const user = await this.userRepository.findOne({where:{ id: req.user.id} , relations:['photos']});

        if(!file) {
            throw new BadRequestException('Aucun fichier trouvee');
        }

        const validation = this.fileService.validateFile(file);
        if(! validation.isValid) {
            throw new BadRequestException(validation.error);
        }

        if(!user) {
            throw new BadRequestException('Aucun user trouvee');
        }

        const targetDir = path.join(
            process.cwd() , 'uploads' , 'identity' , `${req.user.id}`
        )

        const save = await this.fileService.saveFile(file , targetDir);

        if(!save.success) {
            throw new BadRequestException(save.error);
        }
        

        const photo = await this.photoRepository.create({
            url: `/uploads/identity/${req.user.id}` + `/${save.filePath}` ,
            user,
            isProfile:profile,
        })

        const saved = await this.photoRepository.save(photo);
        
       return {
        success:true,
        message:"Photo televersee avec success",
        url:saved.url,
       }
       
    }

    

   
       
}