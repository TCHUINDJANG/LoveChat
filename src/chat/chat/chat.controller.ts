import { Controller, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { Get , Param , Body , Post } from '@nestjs/common';
import { createMessageDto } from '../dto/create-message.dto';
import { Request } from '@nestjs/common';


@ApiTags('messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
    constructor(private readonly messagesService: ChatService){}



     @UseGuards(JwtAuthGuard)
    @Post()
    async sendMessage(@Request() req, @Body()dto:createMessageDto ){
            return this.messagesService.sendMessage(req , dto.matchId , dto.content);
    }
            

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'Get all messages from a match' })
    @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Match not found' })
    async getMessages(
        @Req() req: { user: User },
        @Param('matchId') matchId: number,
  ) {
        return this.messagesService.getMessagesForLike(req.user, matchId);
  }



    @Post(':messageId/read')
    @ApiOperation({ summary: 'Mark a message as read' })
    @ApiResponse({ status: 200, description: 'Message marked as read' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Message not found' })
    async markAsRead(
        @Req() req: { user: User },
        @Param('messageId') messageId: number,
  ) {
        return this.messagesService.markAsRead(req.user, messageId);
  }




    @Get('conversations/all')
    @ApiOperation({ summary: 'Get all conversations with last messages' })
    @ApiResponse({ status: 200, description: 'Conversations retrieved successfully' })
    async getConversations(@Req() req: { user: User }) {
        return this.messagesService.getConversations(req.user);
  }
}
