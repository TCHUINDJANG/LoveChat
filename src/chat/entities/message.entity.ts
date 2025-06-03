import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Match } from 'src/matches/enttity/match.entity';
import { Like } from 'src/likes/entities/likes.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Like)
  @JoinColumn({ name: 'match_id' })
  like: Like;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column('text')
  content: string;

  @ManyToOne(() => User)
  receiver: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;


  @Column({ default: false })
  read: boolean;


  @Column({ default: false })
  isMatched: boolean;
  
  @ManyToOne(() => Like)
  match: Like; // Maintenant lié au match plutôt qu'au like

}