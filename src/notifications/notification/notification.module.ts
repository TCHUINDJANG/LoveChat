import { Module } from '@nestjs/common';
import { NotificationService } from '../notifications/notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { Notification } from '../entity/notification.entity';
import { AuthModule } from 'src/auth/auth.module';




@Module({

imports: [
    TypeOrmModule.forFeature([Notification , User]),
    // Importez aussi le module contenant UserRepository si nécessaire
    UserModule,
    AuthModule
  ],
  providers: [NotificationService],
  exports: [NotificationService], // Important : doit être exporté
})
export class NotificationModule {}
