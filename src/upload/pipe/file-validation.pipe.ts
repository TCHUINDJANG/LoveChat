import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
      'audio/mpeg',
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Type de fichier non supporté');
    }

    if (file.size > 50 * 1024 * 1024) {
      throw new BadRequestException('Fichier trop volumineux (max 50MB)');
    }

    return file;
  }
}