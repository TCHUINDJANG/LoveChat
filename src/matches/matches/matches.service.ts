import { Injectable , NotFoundException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../enttity/match.entity';
import { PreferenceService } from 'src/Preferences/preference/preference.service';
import { NotificationService } from 'src/notifications/notifications/notifications.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MatchesService {

    constructor(
        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>,
        private readonly preferencesService: PreferenceService,
        private notificationService: NotificationService,
    ) {}



    async likeUser(currendUserId:string, targetUserId:string) : Promise<Match> {
        
        const match = await this.matchRepository.findOne({
            where: [
                {user1: {id:currendUserId} , user2: {id:targetUserId}},
                {user1: {id:targetUserId} , user2 : {id:currendUserId}}
            ],
        });


        let marchToSave:Match;

        if(!match) {
            marchToSave = this.matchRepository.create({
                user1: { id:currendUserId},
                user2: {id:targetUserId},
                user1Liked: true,
                user2Liked:false,
                isMatched:false
            });

         } else {
            //mettre a jour le match existant
            if(match.user1.id === currendUserId){
                match.user1Liked = true;
            } else {
                match.user2Liked = true;
            }

            marchToSave = match;
        }
         

        // Vérifier si c'est un match mutuel
        if(marchToSave.user1Liked && marchToSave.user2Liked) {
            marchToSave.isMatched = true;
        }

        return await this.matchRepository.save(marchToSave);
       
    }



    async getUserMatches(userId:string):Promise<Match[]> {
        return this.matchRepository.find({
            where: [
                {user1: {id:userId} , isMatched:true},
                {user2: { id:userId} , isMatched:true}
            ],
            relations: ['user1', 'user2'],
        })
    }



    async unmatch(userId:string , matchId:string): Promise<void> {
        const match = await this.matchRepository.findOne({
            where: [
                {id:matchId , user1: {id:userId}},
                {id:matchId , user2: {id:userId}}
            ],
        });

        if(!match) {
            throw new NotFoundException('Match not found');
        }

        await this.matchRepository.remove(match)
    }




    async createMatch(user1: User, user2: User) {
        const newMatch = this.matchRepository.create({
            user1:user1,
            user2:user2,
            user1Liked:true,
            user2Liked:true,
            isMatched:true,
        });

        const savedMatch = await this.matchRepository.save(newMatch)
    
    // Notifier les deux utilisateurs
    await this.notificationService.createNotification({
      recipientId: user1.id,
      type: 'NEW_MATCH',
      message: `Vous avez un nouveau match avec ${user2.prenom}!`,
      senderId: user2.id,
      metadata: { matchId: savedMatch.id },
    });

    await this.notificationService.createNotification({
      recipientId: user2.id,
      type: 'NEW_MATCH',
      message: `Vous avez un nouveau match avec ${user1.prenom}!`,
      senderId: user1.id,
      metadata: { matchId: savedMatch.id },
    });
  }
}
