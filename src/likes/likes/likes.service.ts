import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikeDto } from '../dto/likes.dto';
import { Like } from '../entities/likes.entity';
import { Request } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { NotificationService } from 'src/notifications/notifications/notifications.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Like)
    private readonly likeRepositoy: Repository<Like>,
    private readonly notificationService: NotificationService,
  ) {}

//   async createLike(@Request() req, @Body() dto: LikeDto) {
//     const user2 = await this.userRepo.findOne({
//       where: { id: dto.userId },
//       relations: ['sentLikes'], // 👈 assure-toi que cette relation existe dans ton User entity
//     });
// // Charge user1 avec les likes reçus
//     const user1 = await this.userRepo.findOne({
//       where: { id: req.user.id },
//       relations: ['receivedLikes'], // 👈 Ajout de la relation
//     });



//     if (!user1 || !user2) {
//     throw new NotFoundException('Utilisateur non trouvé');
//   }
    
//     if (!user1) {
//       throw new NotFoundException('Vous ne pouvez pas liker');
//     }


//     if(user1.id === dto.userId) {
//       throw new BadRequestException('Vous ne pouvez pas vous liker vous meme');
//     }

//     if (!user2) {
//       throw new NotFoundException('User not found');
//     }

//     const findLike = await this.likeRepositoy.findOne({
//       where: { user: user1, likedUser: user2 },
//     });

//     if (findLike) {
//       throw new BadRequestException('Vous likez deja cet utilisateur');
//     }

//     // Crée le nouveau like
//     const like = this.likeRepositoy.create({
//       user: user1,
//       likedUser: user2,
//       isLike: true,
//       matchDate: new Date(),
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       isMatch: true,
//     });

//     // Vérifie si user2 a déjà liké user1 (pour créer un match)

//     const hasMatched = user2.sentLikes?.some(
//       (like) => like.likedUser.id === user1.id,
//     ) || false;

//     if (hasMatched) {
//       like.isMatch = true;
//     }

//     // Notifier les deux utilisateurs
//     await this.notificationService.createNotification(
//       {
//         recipientId: user1.id,
//         type: 'NEW_MATCH',
//         message: `Vous avez un nouveau match avec ${user2.prenom}!`,
//         metadata: { matchId: like.id },
//       },
//       req.user.id,
//     );

//     await this.notificationService.createNotification(
//       {
//         recipientId: user2.id,
//         type: 'NEW_MATCH',
//         message: `Vous avez un nouveau match avec ${user1.prenom}!`,
//         metadata: { matchId: like.id },
//       },
//       req.user.id,
//     );
//     return await this.likeRepositoy.save(like);
//   }

  // dislike tout passe a false

  async DisLike(@Request() req, @Body() dto: LikeDto) {
    // 1. Trouver les utilisateurs concernés

    const utilisateurQuiDislike = await this.userRepo.findOne({
      where: { id: dto.userId },
    });
    const utilisateurDisliké = await this.userRepo.findOne({
      where: { id: req.user.id },
    });

    // 2. Vérifier que les utilisateurs existent
    if (!utilisateurQuiDislike) {
      throw new NotFoundException('Utilisateur connecté non trouvé');
    }

    if (!utilisateurDisliké) {
      throw new NotFoundException('Utilisateur cible non trouvé');
    }

    // 3. Vérifier si un dislike existe déjà

    const existingDislike = await this.likeRepositoy.findOne({
      where: {
        user: utilisateurQuiDislike,
        likedUser: utilisateurDisliké,
        isLike: true,
      },
    });

    if (existingDislike) {
      throw new BadRequestException('Vous avez déjà disliké cet utilisateur');
    }

    // 4. Vérifier et supprimer un like existant s'il existe
    const existingLike = await this.likeRepositoy.findOne({
      where: {
        user: utilisateurQuiDislike,
        likedUser: utilisateurDisliké,
        isLike: true,
      },
    });

    if (existingLike) {
      await this.likeRepositoy.remove(existingLike);
    }

    // 5. Créer le dislike

    const dislike = this.likeRepositoy.create({
      user: utilisateurQuiDislike,
      likedUser: utilisateurDisliké,
      isLike: false,
      // Pas de date de like pour un dislike
      createdAt: new Date(),
      updatedAt: new Date(),
      isMatch: false,
    });

    // 6. Sauvegarder le dislike
    return await this.likeRepositoy.save(dislike);
  }






  async createLike(@Request() req, @Body() dto: LikeDto) {
  // 1. Récupération des utilisateurs avec leurs relations

  
  const [user1, user2] = await Promise.all([
    this.userRepo.findOne({ 
      where: { id: req.user.id },
      relations: ['sentLikes', 'receivedLikes'] 
    }),
    this.userRepo.findOne({ 
      where: { id: dto.userId },
      relations: ['sentLikes', 'receivedLikes'] 
    })
  ]);

  // 2. Vérifications de base
  if (!user1 || !user2) {
    throw new NotFoundException('Utilisateur non trouvé');
  }

  if (user1.id === user2.id) {
    throw new BadRequestException('Vous ne pouvez pas vous liker vous-même');
  }

  // 3. Vérification de like existant
  const existingLike = await this.likeRepositoy.findOne({
    where: { user: user1, likedUser: user2 },
  });

  if (existingLike) {
    throw new BadRequestException('Vous likez déjà cet utilisateur');
  }

  // 4. Création du nouveau like
  const newLike = this.likeRepositoy.create({
    user: user1,
    likedUser: user2,
    isLike: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    isMatch: false // Initialisé à false par défaut
  });

  // 5. Vérification de match (version sécurisée)
  const hasMatched = user2.sentLikes?.some(like => {
    return like?.likedUser?.id === user1.id;
  }) ?? false;

  if (hasMatched) {
    newLike.isMatch = true;
    newLike.matchDate = new Date();
    
    // Optionnel: Créer une entrée dans une table de matches
    // await this.matchService.createMatch(user1.id, user2.id);
  }

  // 6. Sauvegarde et retour
  return await this.likeRepositoy.save(newLike);
}



  async getLike(@Request() req) {
     console.log('donnnes recues:' , req.user);


     const userId = req.user.id;

     const like = await this.likeRepositoy.findOne({
      where: { user: { id: userId } },
            relations: ['user'],
     })

        if(!like){
            throw new BadRequestException('Like non trouve')
        }

        return {
          success : true,
          message: "Likes récupérés avec succès",
          data: {
            isLike: like.isLike,
            isMatch:like.isMatch,
            message: like.messages,
          }
        }
  }
}
