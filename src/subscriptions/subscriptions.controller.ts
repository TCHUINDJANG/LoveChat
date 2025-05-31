import { Controller, Post, Body, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionsService } from './subscriptions/subscriptions.service';
import { User } from 'src/user/entities/user.entity';
import { SubscriptionResponseDto } from './subscription-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';


@Controller('api/subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}


  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    user: User,
    @Body() dto: CreateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    return this.subscriptionsService.createSubscription(user, dto);
  }


  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(user: User): Promise<SubscriptionResponseDto[]> {
    return this.subscriptionsService.getSubscriptions(user.id);
  }


  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async cancel(
     user: User,
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    await this.subscriptionsService.cancelSubscription(user, id);
    return { message: 'Subscription canceled successfully' };
  }
}