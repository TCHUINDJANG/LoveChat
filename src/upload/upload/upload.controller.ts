import { Controller , Post, UploadedFile, UseInterceptors , Get , Param, Delete , Res , Header} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Response } from 'express';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

@Controller('files')
export class UploadController {
        constructor(private readonly uploadService : UploadService ) {}



  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {

    return this.uploadService.processImage(file);
    // if (file.mimetype.startsWith('image/')) {
    //   return this.uploadService.processImage(file);
    // }
    // return { filename: file.filename };
  }


  @Get(':filename')
  @Header('Content-Type', '')
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    
    const file = await this.uploadService.getFileStream(filename);

    res.setHeader('Content-Type', this.getMimeType(filename));
    file.pipe(res);
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
