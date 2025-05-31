import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  paymentMethodId: string;  // ID de la carte bancaire (Stripe)

  @IsNotEmpty()
  @IsString()
  planId: string;  // Ex: 'premium_monthly'
}