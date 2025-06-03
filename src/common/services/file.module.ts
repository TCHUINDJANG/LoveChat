import { Module } from '@nestjs/common';
import { FileService } from './file.service';

@Module({
  providers: [FileService],
  exports: [FileService], // important pour qu’un autre module puisse l’utiliser
})
export class FileModule {}
