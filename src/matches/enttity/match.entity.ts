import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn , OneToMany } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Message } from 'src/chat/entities/message.entity';


@Entity()
export class Match {

    @PrimaryGeneratedColumn('uuid')
    id: string;


    @ManyToOne(() => User, { eager: true })
    user1: User;


    @ManyToOne(() => User, { eager: true })
    user2: User;

    @Column({ default: false })
    user1Liked: boolean;

    @Column({ default: false })
    user2Liked: boolean;

    @Column({ default: false })
    isMatched: boolean;

    @CreateDateColumn()
    createdAt: Date;


    // @OneToMany(() => Message, message => message.match)
    // messages: Message[];


}
