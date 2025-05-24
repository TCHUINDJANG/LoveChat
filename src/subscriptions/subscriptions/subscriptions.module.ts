import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from '../subscriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from '../entities/subscription.entity';
import { ConfigModule } from '@nestjs/config';
import { StripeProvider } from '../shared/config/stripe.config';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription , User]), ConfigModule],
  providers: [SubscriptionsService , StripeProvider],
  controllers: [SubscriptionsController],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
