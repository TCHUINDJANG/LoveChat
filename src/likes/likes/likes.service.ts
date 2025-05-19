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

  async createLike(@Request() req, @Body() dto: LikeDto) {
    const user2 = await this.userRepo.findOne({
      where: { id: dto.userId },
      relations: ['receivedLikes'], // 👈 assure-toi que cette relation existe dans ton User entity
    });

    const user1 = await this.userRepo.findOne({
      where: { id: req.user.id },
      relations: ['user'],
    });

    if (!user1) {
      throw new NotFoundException('Vous ne pouvez pas liker');
    }

    if (!user2) {
      throw new NotFoundException('User not found');
    }

    const findLike = await this.likeRepositoy.findOne({
      where: { user: user1, likedUser: user2 },
    });

    if (findLike) {
      throw new BadRequestException('Vous likez deja cet utilisateur');
    }

    const like = this.likeRepositoy.create({
      user: user1,
      likedUser: user2,
      isLike: true,
      matchDate: new Date(),
      createdAt: new Date(),
      updatedAt: Date(),
      isMatch: false,
    });

    const hasMatched = user2.receivedLikes.some(
      (like) => like.user.id === user1.id,
    );

    if (hasMatched) {
      like.isMatch = true;
    }

    // Notifier les deux utilisateurs
    await this.notificationService.createNotification(
      {
        recipientId: user1.id,
        type: 'NEW_MATCH',
        message: `Vous avez un nouveau match avec ${user2.prenom}!`,
        metadata: { matchId: like.id },
      },
      req.user.id,
    );

    await this.notificationService.createNotification(
      {
        recipientId: user2.id,
        type: 'NEW_MATCH',
        message: `Vous avez un nouveau match avec ${user1.prenom}!`,
        metadata: { matchId: like.id },
      },
      req.user.id,
    );
    return await this.likeRepositoy.save(like);
  }

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
}
