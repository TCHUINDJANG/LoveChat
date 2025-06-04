// src/common/token/password-token.generator.ts
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

export function generatePasswordResetToken(
  userId: string,
  config: ConfigService,
): string {
  return jwt.sign(
    {
      id: userId,
      it: 1, // it = 1 pour dire que c’est un token de reset
    },
    config.get<string>('JWT_SECRET') || "",
    {
      expiresIn: '15m',
    },
  );
}
