import { 
  WebSocketGateway, 
  SubscribeMessage, 
  MessageBody, 
  ConnectedSocket, 
  WebSocketServer, 
  OnGatewayConnection, 
  OnGatewayDisconnect 
} from "@nestjs/websockets";
import { ChatService } from "./chat.service";
import { Socket, Server } from "socket.io";
import { UseGuards } from "@nestjs/common";
import { WsJwtGuard } from "src/auth/ws-jwt.guard";
import { User } from "src/user/entities/user.entity";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/chat',
})
@UseGuards(WsJwtGuard)
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private connectedUsers: Map<string, Socket> = new Map();

    constructor(private readonly messagesService: ChatService) {}

    async handleConnection(client: Socket & { user: User }) {
        console.log(`Client connected: ${client.id}`);
        this.connectedUsers.set(client.user.id, client);
    }

    async handleDisconnect(client: Socket & { user: User }) {
        console.log(`Client disconnected: ${client.id}`);
        this.connectedUsers.delete(client.user.id);
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(
        @ConnectedSocket() client: Socket & { user: User },
        @MessageBody() payload: { matchId: string; content: string },
    ) {
        try {
            const message = await this.messagesService.sendMessage(
                client.user,
                payload.matchId,
                payload.content,
            );

            // Trouver l'autre utilisateur dans le match
            const match = await this.messagesService.getMatch(payload.matchId);
            const recipientId = 
                match.user1.id === client.user.id ? match.user2.id : match.user1.id;

            // Envoyer le message à tous les clients dans la room du match
            this.server.to(`match_${payload.matchId}`).emit('newMessage', message);
            
            // Confirmation à l'expéditeur
            return { 
                status: 'success',
                message: 'Message sent successfully',
                data: message 
            };
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            };
        }
    }

    @SubscribeMessage('joinMatchRoom')
    async handleJoinRoom(
        @ConnectedSocket() client: Socket & { user: User },
        @MessageBody() matchId: string,
    ) {
        try {
            await this.messagesService.validateUserMatch(client.user.id, matchId);
            client.join(`match_${matchId}`);
            return {
                status: 'success',
                message: `Joined room for match ${matchId}`
            };
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            };
        }
    }
}