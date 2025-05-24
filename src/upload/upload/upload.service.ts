import { Injectable } from '@nestjs/common';
import { join } from 'path';
import * as sharp from 'sharp';
import { promises as fs } from 'fs';
import { existsSync, createReadStream } from 'fs';
import { NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class UploadService {
    private readonly uploadPath = join(__dirname, '..', '..', 'uploads');

    async processImage(file: Express.Multer.File) {
        // Validation du fichier
        if (!file) {
            throw new BadRequestException('Aucun fichier reçu');
        }

        // Vérification des propriétés nécessaires
        if (!file.path || !file.originalname) {
            throw new BadRequestException('Fichier mal formaté');
        }

        // Création du répertoire uploads s'il n'existe pas
        if (!existsSync(this.uploadPath)) {
            await fs.mkdir(this.uploadPath, { recursive: true });
        }

        const thumbnailFilename = `thumb_${file.originalname}`;
        const thumbnailPath = join(this.uploadPath, thumbnailFilename);
        
        try {
            await sharp(file.path)
                .resize(300, 300)
                .toFile(thumbnailPath);

            return {
                original: file.originalname,
                thumbnail: thumbnailFilename,
            };
        } catch (error) {
            throw new BadRequestException('Erreur lors du traitement de l\'image');
        }
    }

    async getFileStream(filename: string) {
        const filePath = join(this.uploadPath, filename);

        if (!existsSync(filePath)) {
            throw new NotFoundException('Fichier non trouvé');
        }
        return createReadStream(filePath);
    }

    async deleteFile(filename: string) {
        const filePath = join(this.uploadPath, filename);
        
        if (!existsSync(filePath)) {
            throw new NotFoundException('Fichier non trouvé');
        }

        await fs.unlink(filePath);

        // Supprimer aussi le thumbnail si c'est une image
        if (filename.startsWith('thumb_')) {
            const original = filename.replace('thumb_', '');
            const originalPath = join(this.uploadPath, original);
            if (existsSync(originalPath)) {
                await fs.unlink(originalPath);
            }
        }
    }
}