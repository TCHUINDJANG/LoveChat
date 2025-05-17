import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/email/email.module';
import { Media } from 'src/media/entity/media.entity';

@Module({
  imports : [TypeOrmModule.forFeature([User , Media]) , EmailModule , AuthModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule.forFeature([User])],
})
export class UserModule {}
