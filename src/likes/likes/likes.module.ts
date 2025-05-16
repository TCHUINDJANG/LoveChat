import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from '../entities/likes.entity';
import { User } from 'src/user/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
   imports : [TypeOrmModule.forFeature([Like , User]) , AuthModule],
  providers: [LikesService],
  controllers: [LikesController]
})
export class LikesModule {}
