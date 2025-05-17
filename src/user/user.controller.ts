import { Controller, UseGuards , Request , Get, Body , Param , Post , Query } from '@nestjs/common';
import { Put } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { UserService } from './user.service';
import { UpdateProfileDto } from 'src/auth/dto/update-profile.dto';
import { ForgotPasswordDto } from 'src/auth/dto/forgot-password.dto';
import { ResetPasswordDto } from 'src/auth/dto/ResetPasswordDto.dto';
import { UpdateStatutDto } from 'src/auth/dto/update-status-dto';
import { SearchUserDto } from './dto/search-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiBody, ApiParam } from '@nestjs/swagger';



@ApiTags('Users') // Groupe tous ces endpoints sous la section "Users" dans Swagger UI
@ApiBearerAuth() // Indique que ces endpoints nécessitent une authentification Bearer Token
@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiOperation({ 
        summary: 'Récupérer le profil utilisateur', 
        description: 'Renvoie les informations du profil de l\'utilisateur authentifié' 
    })

    @ApiResponse({ 
        status: 200, 
        description: 'Profil utilisateur récupéré avec succès',
        // type: UserProfileResponse 
    })
    @ApiResponse({ status: 401, description: 'Non autorisé' })
    async getProfile(@Request() req){

        return this.userService.getProfile(req);
        
    }

    @UseGuards(JwtAuthGuard)
    @Put('profile')
    @ApiOperation({ 
        summary: 'Mettre à jour le profil utilisateur', 
        description: 'Met à jour les informations du profil de l\'utilisateur authentifié' 
    })

    @ApiResponse({ 
        status: 200, 
        description: 'Profil utilisateur mis à jour avec succès',
        // type: UserProfileResponse 
    })
    @ApiResponse({ status: 400, description: 'Données invalides' })
    @ApiResponse({ status: 401, description: 'Non autorisé' })
    async updateProfile(@Request() req,  @Body() updateProfileDto:UpdateProfileDto) {
        return this.userService.updateUserProfile(req.user.id , updateProfileDto)
    }


     @UseGuards(JwtAuthGuard)
    @Put('statut')
    @ApiOperation({ 
        summary: 'Mettre à jour le statut utilisateur', 
        description: 'Met à jour le statut de l\'utilisateur authentifié' 
    })
    @ApiBody({ 
        type: UpdateStatutDto,
        description: 'Nouveau statut de l\'utilisateur'
    })

    @ApiResponse({ 
        status: 200, 
        description: 'Statut utilisateur mis à jour avec succès',
        // type: UserProfileResponse 
    })
    @ApiResponse({ status: 400, description: 'Données invalides' })
    @ApiResponse({ status: 401, description: 'Non autorisé' })
    async updateStatus(@Request() req,  @Body() dto:UpdateStatutDto) {
        return this.userService.putStatut(req.user.id , dto)
    }



    @Get('search')
    @ApiOperation({ 
        summary: 'Rechercher des utilisateurs', 
        description: 'Recherche des utilisateurs selon différents critères' 
    })
    @ApiQuery({ 
        type: SearchUserDto,
        description: 'Critères de recherche des utilisateurs',
        required: false
    })

    @ApiResponse({ 
        status: 200, 
        description: 'Liste des utilisateurs correspondant aux critères',
        // type: [UserProfileResponse] 
    })
    async search(@Query() searchdto:SearchUserDto){
        return this.userService.SearchUserDto(searchdto)
    }



    // @UseGuards(JwtAuthGuard)
    // @Post('forgot-password')
    // async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    //     await this.userService.forgotPassword(forgotPasswordDto);
    //     return { message: 'Email de réinitialisation envoyé si l\'email existe.' };
    // }

    
}


