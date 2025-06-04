import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { NotificationService } from './notifications.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { Request } from '@nestjs/common';
import { Role } from 'src/user/entities/user.entity';
import { ForbiddenException } from '@nestjs/common';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req ,  @Body() createDto: CreateNotificationDto) {

    const role = req.user.role;
    if(role ==! Role.ADMIN && role ==! Role.SUPERADMIN ) {
      throw new ForbiddenException("Acces non autorise vous n'etes pas admin");
    }
    return this.notificationService.createNotification(createDto , req.user);
  }

  @Get(':userId')
  getUserNotifications(@Param('userId') userId: string) {


    return this.notificationService.getUserNotifications(userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @Body() updateDto: UpdateNotificationDto) {
    return this.notificationService.markAsRead(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.notificationService.delete(id);
  }
}