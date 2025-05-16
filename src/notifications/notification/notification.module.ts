import { Module } from '@nestjs/common';
import { NotificationService } from '../notifications/notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { Notification } from '../entity/notification.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';




@Module({

imports: [
    TypeOrmModule.forFeature([Notification , User]),
    // Importez aussi le module contenant UserRepository si nécessaire
    UserModule,
    JwtAuthGuard,
  ],
  providers: [NotificationService],
  exports: [NotificationService], // Important : doit être exporté
})
export class NotificationModule {}
