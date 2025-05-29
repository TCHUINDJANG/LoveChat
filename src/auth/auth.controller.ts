import { BadRequestException, Body, Controller, Post , Request } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/ResetPasswordDto.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth-guard';
import { RegisterAdminDto } from './dto/register.admin.dto';
import { Request as ExpressRequest } from 'express';



@Controller('auth')
export class AuthController {



    constructor(private readonly authService : AuthService) {}
    @Post('register')
    async register(@Body() dto: RegisterDto) {

        return this.authService.register(dto);
    }


    @Post('register-admin')
    async registerAdmin(@Body() dto: RegisterAdminDto) {

        return this.authService.registerAdmin(dto);
    }


    @Post('login')
    async login(@Body() dto:LoginDto){
        return this.authService.login(dto)
    }


    @UseGuards(JwtAuthGuard)
    @Post('reset-password')
    async resetPassword(@Request() req, @Body() dto:ResetPasswordDto){
        return this.authService.resetPassword(req.user.id , dto)
    }




    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Request() req: ExpressRequest) {

        const token = req.headers.authorization?.split(' ')[1];

        if(!token) {
            throw new BadRequestException('Token non fournit');
        }

        return this.authService.logout(token);

    }

    
}




// {
//     "nom":"dav",
//     "prenon":"Davide",
//     "telephone":"657486000",
//     "password":"1234",
//     "email":"dav@gmail.com"
    
    
    
//   }
