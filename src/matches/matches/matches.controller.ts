
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { MatchesService } from './matches.service';
import { User } from 'src/user/entities/user.entity';
import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';




@Controller('matches')
@UseGuards(JwtAuthGuard)
export class MatchesController {

    constructor(private readonly matchesService: MatchesService){}

    @Post('like/:userId')
    async likeUser(
        @GetUser() currentUser: User,
        @Param('userId') targetUserId: string,
    ) {
        return this.matchesService.likeUser(currentUser.id , targetUserId)
    }


    @Get('my-matches')
    async getUserMatches(@GetUser() user: User) {
        return this.matchesService.getUserMatches(user.id)
    }

    @Delete(':id')
    async unmatch(
        @GetUser() user: User,
        @Param('id') matchId: string,
    ) {
        return this.matchesService.unmatch(user.id , matchId)
    }
}
