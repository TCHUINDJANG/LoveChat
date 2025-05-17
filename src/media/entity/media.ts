import { Entity, Column, ManyToOne, PrimaryGeneratedColumn , JoinColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';


@Entity()
export class Media {

    @PrimaryGeneratedColumn()
    id: number;


    @Column()
    filename: string;

    @Column()
     type: 'image' | 'video' | 'audio';


     @Column({ nullable: true })
    thumbnail?: string;

    @ManyToOne(() => User, user => user.media)
    @JoinColumn({ name: 'user_id' })
    user: User;

}