import { Controller , Post, UploadedFile, UseInterceptors , Get , Param, Delete , Res , Header} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Response } from 'express';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { Request } from '@nestjs/common';

@Controller('files')
export class UploadController {
        constructor(private readonly uploadService : UploadService ) {}



  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Request() req , @UploadedFile() file: Express.Multer.File) {

    const profile = false;
    return this.uploadService.processImage(req , file , profile);
    
  }



  @UseGuards(JwtAuthGuard)
  @Post('upload/profile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileFile(@Request() req , @UploadedFile() file: Express.Multer.File) {


    const profile = true;
    return this.uploadService.processImage(req , file , profile);
    
  }


 


  private getMimeType(filename:string):string {
    const extension = filename.split('.').pop()?.toLowerCase();

    switch(extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'mp4':
        return 'video/mp4';
      case 'mp3':
        return 'audio/mpeg';
      default:
        return 'application/octet-stream';

    }
  }

}
