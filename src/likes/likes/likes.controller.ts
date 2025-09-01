
import { LikesService } from './likes.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { Request } from '@nestjs/common';
import { Controller, UseGuards , Get, Body , Param , Post , Query , Put } from '@nestjs/common';
import { LikeDto } from '../dto/likes.dto';

@Controller('likes')
export class LikesController {

    constructor(private readonly likeService: LikesService) {}



        @UseGuards(JwtAuthGuard)
        @Post('create')
        async createLike(@Request() req,  @Body() dto:LikeDto) {
            return this.likeService.createLike(req , dto)
        }
}
