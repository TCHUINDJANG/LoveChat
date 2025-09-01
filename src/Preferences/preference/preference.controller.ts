import { Controller } from '@nestjs/common';
import { Get , Put ,  UseGuards , Body } from '@nestjs/common';
import { PreferenceService } from './preference.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { User } from 'src/user/entities/user.entity';
import { UpdatePreferenceDto } from '../dto/UpdatePreferenceDto';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('preference')
@UseGuards(JwtAuthGuard)
export class PreferenceController {
    constructor(private readonly preferencesService: PreferenceService){}


    @Get()
    async getPreferences(@GetUser() user: User){
        return this.preferencesService.getUserPreference(user.id)
    }

    @Put()
    async updatePreferences(
        @GetUser() user: User,
        @Body() updatePreferenceDto: UpdatePreferenceDto,
    ) {
        return this.preferencesService.updateUserPreferences(
            user.id,
            updatePreferenceDto,
          
        );
    }
}
