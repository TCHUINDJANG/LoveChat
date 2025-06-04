import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../entities/message.entity';
import { Match } from 'src/matches/enttity/match.entity';
import { MatchesModule } from 'src/matches/matches/matches.module';
import { UserModule } from 'src/user/user.module';
import { Like } from 'src/likes/entities/likes.entity';
import { LikesModule } from 'src/likes/likes/likes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Like]),
    LikesModule,
    UserModule,
  ],
  providers: [ChatService],
  controllers: [ChatController],
  exports: [ChatService]
})
export class ChatModule {}
