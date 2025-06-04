const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

import { Express } from 'express';

interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

interface FileUploadResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_MIME_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/jpg': ['.jpg'],
};

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const DOCS_DIR = path.join(UPLOAD_DIR, 'identity');
const FILES_DIR = path.join(UPLOAD_DIR, 'files');

export class FileService {
  constructor() {
    this.initializeDirectories();
  }

  private async initializeDirectories() {
    await this.ensureDirectoryExists(UPLOAD_DIR);
    await this.ensureDirectoryExists(DOCS_DIR);
    await this.ensureDirectoryExists(FILES_DIR);
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    if (!fs.existsSync(dirPath)) {
      await fs.promises.mkdir(dirPath, { recursive: true });
    }
  }

  public validateFile(file: Express.Multer.File): FileValidationResult {
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `Le fichier ${file.originalname} dépasse la taille maximale autorisée (5MB)`,
      };
    }

    const allowedExtensions = ALLOWED_MIME_TYPES[file.mimetype];
    if (!allowedExtensions) {
      return {
        isValid: false,
        error: `Le type de fichier ${file.mimetype} n'est pas autorisé`,
      };
    }

    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return {
        isValid: false,
        error: `L'extension ${ext} n'est pas autorisée pour ce type de fichier`,
      };
    }

    return { isValid: true };
  }

  private generateUniqueFileName(originalName: string): string {
    const extension = path.extname(originalName);
    const uniqueId = uuidv4();
    return `${uniqueId}${extension}`;
  }

  public async saveIdentityFile(
    file: Express.Multer.File,
    userId: string,
  ): Promise<FileUploadResult> {
    const userDir = path.join(DOCS_DIR, `user_${userId}`);
    return await this.saveFile(file, userDir);
  }

  public async saveGeneralFile(
    file: Express.Multer.File,
    folder: string = 'default',
  ): Promise<FileUploadResult> {
    const targetDir = path.join(FILES_DIR, folder);
    return await this.saveFile(file, targetDir);
  }

  public async saveFile(
 
    file: Express.Multer.File,
    targetDir: string,
  ): Promise<FileUploadResult> {
    try {
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      await this.ensureDirectoryExists(targetDir);

      const uniqueName = this.generateUniqueFileName(file.originalname);
      const filePath = path.join(targetDir, uniqueName);

      await fs.promises.writeFile(filePath, file.buffer);

      return {
        success: true,
        filePath: uniqueName,
      };
    } catch (error) {
      return {
        success: false,
        error: `Erreur lors de la sauvegarde du fichier: ${error.message}`,
      };
    }
  }
}
