import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { ChatModule } from './chat/chat/chat.module';
import { MatchesModule } from './matches/matches/matches.module';
import { NotificationModule } from './notifications/notification/notification.module';
import { LikesModule } from './likes/likes/likes.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'chat-love-bd',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UserModule,
    ChatModule,
    MatchesModule,
    NotificationModule,
    LikesModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}