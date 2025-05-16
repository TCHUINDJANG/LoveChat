import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MatchesService } from './matches.service';
import { JwtService } from '@nestjs/jwt';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from 'src/auth/ws-jwt.guard';


@WebSocketGateway({ namespace: 'matches' })
export class MatchesGateway {
    constructor(
        private readonly matchesService: MatchesService,
        private readonly jwtService: JwtService,
    ){}


    @UseGuards(WsJwtGuard)
    @SubscribeMessage('likeUser')
    async handleLike(
         @MessageBody() data: { targetUserId: string },
         @ConnectedSocket() client: Socket,
    ) {
        const userId = client.handshake.auth.user.id;
        const match = await this.matchesService.likeUser(userId , data.targetUserId)

        if(match.isMatched) {
            //Notifier les deux utilisateurs
            client.emit('newMatch', match);
            client.to(`user_${data.targetUserId}`).emit('newMatch', match);
        }

        return {
            status:'success'
        };
    }
}