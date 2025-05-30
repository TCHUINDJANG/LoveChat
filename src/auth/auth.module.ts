import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { InvalidToken } from './entities/invalid-token.entity';
import { EmailService } from 'src/email/email.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports : [TypeOrmModule.forFeature([User , InvalidToken]) , 
  PassportModule.register({ defaultStrategy: 'jwt' }),  
  JwtModule.registerAsync({
    imports: [ConfigModule , EmailModule],
    useFactory: async (configService: ConfigService) => ({
      secret:configService.get<string>('JWT_SECRET'),
    signOptions: { expiresIn: '7d' },
    }),
    inject: [ConfigService],
    
  }),
],
  exports: [JwtModule],
  providers: [AuthService , JwtStrategy , EmailService],
  controllers: [AuthController]
})
export class AuthModule {}
