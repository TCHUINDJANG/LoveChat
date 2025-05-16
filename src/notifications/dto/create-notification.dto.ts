export class CreateNotificationDto {
  recipientId: string;
  type: 'NEW_MATCH' | 'NEW_MESSAGE' | 'NEW_LIKE' | 'OTHER';
  message: string;
  senderId?: string;
  metadata?: any;
}