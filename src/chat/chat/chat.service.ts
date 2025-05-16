import { Injectable , NotFoundException , ForbiddenException } from '@nestjs/common';
import { Message } from '../entities/message.entity';
import { InjectRepository  } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from 'src/matches/enttity/match.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ChatService {

    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    ){}



    async sendMessage(sender: User , matchId:string , content:string) : Promise<Message> {

        // Vérifier que le match existe et que l'utilisateur fait partie du match

        const match = await this.matchRepository.findOne({
            where: { id:matchId , isMatched:true},
            relations: ['user1', 'user2'],
        });

        if(!match) {
            throw new NotFoundException('Match not found or not mutual');
        }

        // Vérifier que l'utilisateur fait partie du match

        if(match.user1.id !== sender.id &&  match.user2.id !== sender.id) {
            throw new ForbiddenException('Vous ne faites pas partir du match');
        }

        // Créer et sauvegarder le message

        const message = this.messageRepository.create({
            match,
            sender,
            content,
        });

        return this.messageRepository.save(message);
    }


    async getMessagesForMatch(user: User , matchId: string):Promise<Message[]> {
        // Vérifier que le match existe et que l'utilisateur fait partie du match
        const match = await this.matchRepository.findOne({
            where: { id: matchId , isMatched:true},
            relations: ['user1', 'user2'],
        });


        if(!match) {
            throw new NotFoundException('Match not found or not mutual');
        }


        // Vérifier que l'utilisateur fait partie du match
        if (match.user1.id !== user.id && match.user2.id !== user.id) {
            throw new ForbiddenException('You are not part of this match');
    }

        // Récupérer les messages du match
        return this.messageRepository.find({
            where: {match: {id:matchId}} , 
            relations: ['sender'],
            order: { createdAt: 'ASC' },
        });
    }


    async markAsRead(user:User , messageId:number): Promise<void> {
        const message = await this.messageRepository.findOne({
            where: { id: messageId},
            relations: ['match.user1', 'match.user2', 'sender'],
        });

        if(!message) {
            throw new NotFoundException('Message not found');
        }

        // Vérifier que l'utilisateur est le destinataire

        const isRecipient = 
        (message.match.user1.id === user.id && message.sender.id === message.match.user2.id) ||
        (message.match.user2.id === user.id && message.sender.id === message.match.user1.id);


        if(!isRecipient){
            throw new ForbiddenException('You are not the recipient of this message');
        }

        message.read = true;
        await this.messageRepository.save(message);
    }


    async getConversations(user: User): Promise<Match[]> {
        // Récupérer tous les matches mutuels avec les derniers messages
        const matches = await this.matchRepository.find({
            where: [
                { user1: {id:user.id} , isMatched:true},
                { user2: {id: user.id} , isMatched:true},
            ],

            relations: ['user1', 'user2', 'messages'],
        });

        // Pour chaque match, récupérer le dernier message

        const matchesWithLastMessage = await Promise.all(
      matches.map(async (match) => {
        const lastMessage = await this.messageRepository.findOne({
          where: { match: { id: match.id } },
          order: { createdAt: 'DESC' },
        });
        return { ...match, lastMessage };
      }),
    );

    return matchesWithLastMessage;
  }



  async validateUserMatch(userId: string, matchId: string): Promise<Match> {
    const match = await this.matchRepository.findOne({
      where: { 
        id: matchId, 
        isMatched: true,
      },
      relations: ['user1', 'user2'],
    });

    if (!match) {
      throw new NotFoundException('Match not found or not mutual');
    }

    // Check if user is part of this match
    if (match.user1.id !== userId && match.user2.id !== userId) {
      throw new ForbiddenException('You are not part of this match');
    }

    return match;
  }


  async getMatch(matchId: string): Promise<Match> {
    const match = await this.matchRepository.findOne({
      where: { id: matchId },
      relations: ['user1', 'user2'],
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    return match;
  }
    }

