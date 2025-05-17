import { Injectable } from '@nestjs/common';
import { join } from 'path';
import * as sharp from 'sharp';
import { promises as fs } from 'fs';
import { existsSync , createReadStream} from 'fs';
import { NotFoundException } from '@nestjs/common';


@Injectable()
export class UploadService {
    private readonly uploadPath = join(__dirname, '..', '..', 'uploads');


    async processImage(file: Express.Multer.File) {
    const thumbnailPath = join(this.uploadPath, `thumb_${file.filename}`);
    
    await sharp(file.path)
      .resize(300, 300)
      .toFile(thumbnailPath);

    return {
      original: file.filename,
      thumbnail: `thumb_${file.filename}`,
    };
  }


  async getFileStream(filename: string) {
    const filePath = join(this.uploadPath, filename);

    if(!existsSync(filePath)) {
        throw new NotFoundException('Fichier non trouvé');
    }
    return createReadStream(filePath);
  }

  async deleteFile(filename: string) {
    const filePath = join(this.uploadPath, filename);
    await fs.unlink(filePath);

    // Supprimer aussi le thumbnail si c'est une image
    if (filename.startsWith('thumb_')) {
      const original = filename.replace('thumb_', '');
      await this.deleteFile(original);
    }
  }

}
