import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
  Check,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
@Unique(['user', 'likedUser']) // Empêche les doublons de likes
@Check(`user_id != liked_user_id`) // Empêche un utilisateur de se liker lui-même
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sentLikes, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => User, (user) => user.receivedLikes, { onDelete: 'CASCADE' })
  @Index() // Index pour les requêtes fréquentes
  likedUser: User;

  @Column({ default: true })
  isLike: boolean; // true = like, false = dislike

//   @Column({ default: false })
//   isSuperLike: boolean; // Pour les super likes

  @Column({ default: false })
  isMatch: boolean; // Devient true quand c'est un match

  @Column({ nullable: true })
  matchDate: Date; // Date quand le match s'est produit

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}