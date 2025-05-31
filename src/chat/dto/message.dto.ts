import { Expose } from 'class-transformer';

export class MessageDto {
  @Expose()
  id: number;

  @Expose()
  content: string;

  @Expose()
  createdAt: Date;

  @Expose()
  read: boolean;

  @Expose()
  senderId: number;

  // @Expose()
  // senderId: number;
}