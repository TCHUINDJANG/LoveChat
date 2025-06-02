import { Controller } from '@nestjs/common';
import { Get , Put ,  UseGuards , Body , Post } from '@nestjs/common';
import { PreferenceService } from './preference.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { User } from 'src/user/entities/user.entity';
import { UpdatePreferenceDto } from '../dto/UpdatePreferenceDto';
import { GetUser } from 'src/auth/get-user.decorator';
import { Request } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';


@Controller('preference')
@UseGuards(JwtAuthGuard)
export class PreferenceController {
    constructor(private readonly preferencesService: PreferenceService){}


    @Get()
    async getPreferences(@Request() req){
        return this.preferencesService.getUserPreference(req)
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createPreferences(@Request() req , @Body() dto:UpdatePreferenceDto){
        return this.preferencesService.createPreference(req ,dto )
    }

    

  @Put()
  @ApiOperation({ summary: 'Mettre à jour les préférences de l\'utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Préférences mises à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Préférences non trouvées' })
  async updatePreference(
    @Request() req,
    @Body() updatePreferenceDto: UpdatePreferenceDto,
  ) {
    return this.preferencesService.updateUserPreference(
      req,
      updatePreferenceDto,
    );
  }
}
