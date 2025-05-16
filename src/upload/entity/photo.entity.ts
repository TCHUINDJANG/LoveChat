import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/user/entities/user.entity';


@Entity()
export class Photo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @Column({ default: false })
    isProfile: boolean;


    @ManyToOne(() => User, user => user.photos)
    user: User;

}