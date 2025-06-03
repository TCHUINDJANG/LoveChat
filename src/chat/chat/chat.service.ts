import { Injectable , NotFoundException , ForbiddenException } from '@nestjs/common';
import { Message } from '../entities/message.entity';
import { InjectRepository  } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from 'src/matches/enttity/match.entity';
import { User } from 'src/user/entities/user.entity';
import { Request } from '@nestjs/common';
import { Like } from 'src/likes/entities/likes.entity';
import { Param , Body } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';


@Injectable()
export class ChatService {

    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    ){}



   async sendMessage(@Request() req, @Param('matchId') matchId: number, @Body('content') content: string) {
    const sender = req.user;
  
  if (!sender?.id) {
    throw new ForbiddenException('Utilisateur non authentifié');
  }

  // 1. D'abord vérifier que le match existe (sans condition d'utilisateur)
  const baseMatch = await this.likeRepository.findOne({
    where: { 
      id: matchId,
      isMatch: false,
    },
    relations: ['user', 'likedUser'],
  });

  if (!baseMatch) {
    throw new NotFoundException('Match non trouvé');
  }

  // 2. Ensuite vérifier que l'utilisateur fait partie du match
  if (baseMatch.user.id !== sender.id && baseMatch.likedUser.id !== sender.id) {
    throw new ForbiddenException('Vous ne faites pas partie de ce match');
  }


  // 3. Vérifier que le like inverse existe aussi (double vérification)
  const reciprocalLike = await this.likeRepository.findOne({
    where: {
      user: baseMatch.likedUser,
      likedUser: baseMatch.user,
      isMatch: true
    }
  });

  if (!reciprocalLike) {
    throw new BadRequestException('Le match doit être mutuel pour envoyer des messages');
  }

  // 3. Création du message
  const receiverId = baseMatch.user.id === sender.id 
    ? baseMatch.likedUser.id 
    : baseMatch.user.id;

  const message = this.messageRepository.create({
    like: { id: matchId },
    sender: { id: sender.id },
    receiver: { id: receiverId },
    content,
    read: false,
    createdAt: new Date()
  });

  return await this.messageRepository.save(message);
}


    async getMessagesForLike(@Request() req,  matchId: number) {

      const sender = req.user;
        // Vérifier que le match existe et que l'utilisateur fait partie du match
        const like = await this.likeRepository.findOne({
            where: { id: matchId , isMatch:true},
            relations: ['user', 'likedUser'],
        });


        if(!like) {
            throw new NotFoundException('Match not found or not mutual');
        }


        // Vérifier que l'utilisateur fait partie du match
        if (like.user.id !== sender.id && like.likedUser.id !== sender.id) {
            throw new ForbiddenException('You are not part of this match');
    }

        // Récupérer les messages du match
        return this.messageRepository.find({
            where: {like: {id:matchId}} , 
            relations: ['sender'],
            order: { createdAt: 'ASC' },
        });
    }


    async markAsRead( @Request() req, messageId:number) {

      const sender = req.user;
        const message = await this.messageRepository.findOne({
            where: { id: messageId},
            relations: ['like.user', 'like.likedUser', 'sender'],
        });

        if(!message) {
            throw new NotFoundException('Message not found');
        }

        // Vérifier que l'utilisateur est le destinataire

        const isRecipient = 
        (message.like.user.id === sender.id && message.sender.id === message.like.likedUser.id) ||
        (message.like.user.id === sender.id && message.sender.id === message.like.likedUser.id);


        if(!isRecipient){
            throw new ForbiddenException('You are not the recipient of this message');
        }

        message.read = true;
        await this.messageRepository.save(message);
    }


    async getConversations(user: User) {
        // Récupérer tous les matches mutuels avec les derniers messages
        const like = await this.likeRepository.find({
            where: [
                { user: {id:user.id} , isMatch:true},
                { likedUser: {id: user.id} , isMatch:true},
            ],

            relations: ['user', 'likedUser', 'messages'],
        });

        // Pour chaque match, récupérer le dernier message

        const matchesWithLastMessage = await Promise.all(
      like.map(async (likes) => {
        const lastMessage = await this.messageRepository.findOne({
          where: { like: { id: likes.id } },
          order: { createdAt: 'DESC' },
        });
        return { ...like, lastMessage };
      }),
    );

    return matchesWithLastMessage;
  }



  async validateUserMatch(userId: string, matchId: number){
    const like = await this.likeRepository.findOne({
      where: { 
        id: matchId, 
        isMatch: true,
      },
      relations: ['user', 'likedUser'],
    });

    if (!like) {
      throw new NotFoundException('like not found or not mutual');
    }

    // Check if user is part of this match
    if (like?.user.id !== userId && like?.likedUser.id !== userId) {
      throw new ForbiddenException('You are not part of this match');
    }

    return like;
  }


  async getMatch(matchId: number) {
    const match = await this.likeRepository.findOne({
      where: { id: matchId },
      relations: ['user', 'likedUser'],
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    return match;
  }
    }

