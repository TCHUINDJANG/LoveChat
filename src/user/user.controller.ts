import { Controller, UseGuards , Request , Get, Body , Param , Post } from '@nestjs/common';
import { Put } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { UserService } from './user.service';
import { UpdateProfileDto } from 'src/auth/dto/update-profile.dto';
import { ForgotPasswordDto } from 'src/auth/dto/forgot-password.dto';
import { ResetPasswordDto } from 'src/auth/dto/ResetPasswordDto.dto';
import { UpdateStatutDto } from 'src/auth/dto/update-status-dto';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req){

        return this.userService.getProfile(req);
        
    }

    @UseGuards(JwtAuthGuard)
    @Put('profile')
    async updateProfile(@Request() req,  @Body() updateProfileDto:UpdateProfileDto) {
        return this.userService.updateUserProfile(req.user.id , updateProfileDto)
    }


     @UseGuards(JwtAuthGuard)
    @Put('statut')
    async updateStatus(@Request() req,  @Body() dto:UpdateStatutDto) {
        return this.userService.putStatut(req.user.id , dto)
    }


    // @UseGuards(JwtAuthGuard)
    // @Post('forgot-password')
    // async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    //     await this.userService.forgotPassword(forgotPasswordDto);
    //     return { message: 'Email de réinitialisation envoyé si l\'email existe.' };
    // }

    
}


