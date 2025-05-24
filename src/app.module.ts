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
import { Media } from './media/entity/media.entity';
import { MediaModule } from './media/media/media.module';
import { UploadModule } from './upload/upload/upload.module';
import { SubscriptionsController } from './subscriptions/subscriptions.controller';
import { SubscriptionsModule } from './subscriptions/subscriptions/subscriptions.module';


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
    TypeOrmModule.forFeature([User , Media]),
    AuthModule,
    UserModule,
    ChatModule,
    MatchesModule,  
    NotificationModule,
    LikesModule,
    MediaModule,
    UploadModule,
    SubscriptionsModule,

  ],
  controllers: [AppController, SubscriptionsController],
  providers: [AppService],
})
export class AppModule {}