import { Module } from '@nestjs/common';
import { PreferenceService } from './preference.service';
import { PreferenceController } from './preference.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Preference } from '../entity/preference.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Preference]), UserModule],
  providers: [PreferenceService],
  controllers: [PreferenceController],
  exports: [PreferenceService],
})
export class PreferenceModule {}
