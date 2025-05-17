import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entity/notification.entity';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';
import { User } from '../../user/entities/user.entity';
import { read } from 'fs';
import { NotificationType } from '../entity/notification-type.enum';


@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Créer une notification

 async createNotification(createDto: CreateNotificationDto , data): Promise<Notification> {
    // Vérifiez que le recipient existe
    const recipient = await this.userRepository.findOneBy({ id: createDto.recipientId });
    if (!recipient) {
      throw new Error('Recipient not found');
    }

    // Créez la notification avec le bon typage
    const notification = this.notificationRepository.create({
      recipient: recipient, // Passez l'entité User complète
      type: createDto.type as NotificationType, // Cast explicite vers NotificationType
      message: createDto.message,
      senderId: data.id,
      metadata: createDto.metadata,
      isRead: false, // Assurez-vous que le nom correspond à votre entité (read ou isRead)
      createdAt: new Date(),
    });
      return await this.notificationRepository.save(notification);
  }



    
  
  // Récupérer les notifications d'un utilisateur
  async getUserNotifications(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { recipient: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  // Marquer comme lu 
  async markAsRead(notificationId: string, updateDto: UpdateNotificationDto): Promise<Notification> {

    const notification = await this.notificationRepository.findOneBy({ id: notificationId });
    
    if (!notification) throw new Error('Notification not found');

    notification.isRead = updateDto.isRead ?? true;
    return this.notificationRepository.save(notification);
  }

  // Supprimer une notification
  async delete(notificationId: string): Promise<void> {
    await this.notificationRepository.delete(notificationId);
  }
}