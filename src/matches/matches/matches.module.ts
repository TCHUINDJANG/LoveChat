import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { MatchesGateway } from './matches.gateway';
import { PreferenceModule } from 'src/Preferences/preference/preference.module';
import { Match } from '../enttity/match.entity';

@Module({
  imports : [
    TypeOrmModule.forFeature([Match]),
    UserModule,
    PreferenceModule,
  ],
  providers: [MatchesService , MatchesGateway],
  controllers: [MatchesController]
})
export class MatchesModule {}
