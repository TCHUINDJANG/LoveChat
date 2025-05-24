import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

export const StripeProvider = {
  provide: 'STRIPE',
  useFactory: (configService: ConfigService) => {
    const secretKey = configService.get<string>('STRIPE_SECRET_KEY');
    
    // Validation robuste de la clé API
    if (!secretKey) {
      throw new Error(
        'Clé secrète Stripe non configurée. ' +
        'Vérifiez votre fichier .env et la configuration du module ConfigModule'
      );
    }

    // Vérification du format de la clé
    if (!secretKey.startsWith('sk_') && !secretKey.startsWith('rk_')) {
      throw new Error(
        'Format de clé Stripe invalide. ' +
        'Une clé secrète Stripe doit commencer par sk_ ou rk_'
      );
    }

    try {
      return new Stripe(secretKey, {
        apiVersion: '2025-04-30.basil',
        typescript: true, // Activation du support TypeScript
      });
    } catch (error) {
      throw new Error(
        `Échec de l'initialisation du client Stripe: ${error.message}`
      );
    }
  },
  inject: [ConfigService],
};