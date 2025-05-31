import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Subscription } from '../entities/subscription.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,
    @Inject('STRIPE') private stripe: Stripe,
  ) {}

  async createSubscription(user: User, dto: CreateSubscriptionDto) {
    // 1. Créer un client Stripe si nécessaire
    let customerId: string;

    if (!user.stripeCustomerId) {
      const customer = await this.stripe.customers.create({
        email: user.email,
        payment_method: dto.paymentMethodId,
      });
      customerId = customer.id;
      // Sauvegarder customerId dans l'utilisateur (à implémenter)
    } else {
      customerId = user.stripeCustomerId;
    }

    // 2. Créer l'abonnement Stripe
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ plan: dto.planId }],
      expand: ['latest_invoice.payment_intent'],
    });

    // 3. Sauvegarder en base
    const newSubscription = this.subscriptionRepo.create({
      stripeSubscriptionId: subscription.id,
      planId: dto.planId,
      status: subscription.status,
    //   startDate: new Date(subscription.current_period_start * 1000),
    //   endDate: new Date(subscription.current_period_end * 1000),
      user,
    });

    return this.subscriptionRepo.save(newSubscription);
  }

  async cancelSubscription(user: User, subscriptionId: string) {
    const subscription = await this.subscriptionRepo.findOne({
      where: { id: subscriptionId, user: { id: user.id } },
    });

    if (!subscription) throw new Error('Subscription not found');

    await this.stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
    subscription.status = 'canceled';
    return this.subscriptionRepo.save(subscription);
  }




  async getSubscriptions(userId: string) {
    return this.subscriptionRepo.find({ where: { user: { id: userId } } });
  }
}