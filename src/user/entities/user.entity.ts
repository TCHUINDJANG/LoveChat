
import { Column, Entity, PrimaryGeneratedColumn, Unique , JoinColumn, OneToMany} from 'typeorm'
import { OneToOne } from 'typeorm';
import { Preference } from 'src/Preferences/entity/preference.entity';
import { Photo } from 'src/upload/entity/photo.entity';
import { Like } from 'src/likes/entities/likes.entity';
import { Media } from 'src/media/entity/media.entity';
// import { Preference } from 'src/Preferences/entity/preference.entity';

// id utilisateur 1 :    42e365b0-d577-4422-8f1a-19351ece0eee

// id Utilisateur  2  :     8c975f53-f239-4650-90ab-293383f98615

// id de l'utilisateur 2 :    8c975f53-f239-4650-90ab-293383f98615


export enum Sexe  {
    MASCULIN='M',
    FEMININ='F',
    DEFAULT= 'N'
}


export enum Status  {
    ACTIF='A',
    BLOCKED='B',
    DESACTIVATE= 'D'
}


export enum Role  {
    USER='User',
    ADMIN='Admin',
    SUPERADMIN="SuperAdmin",
}


@Entity()
@Unique(['email' , 'telephone'])
export class User {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    nom:string;

    @Column()
    prenom:string;

    @Column()
    email:string;

    @Column()
    telephone:string;

    @Column()
    age:number;

    @Column()
    password:string;

    @Column({nullable:true})
    biographie:string;

    @Column({
        type: 'enum',
        enum:Sexe,
        default: Sexe.DEFAULT
    })
    sexe:Sexe;



    @Column({
        type: 'enum',
        enum:Status,
        default: Status.ACTIF
    })
    statut:Status;



    @Column({
        type: 'enum',
        enum:Role,
        default: Role.USER
    })
    role:Role;


   @OneToOne(() => Preference, { cascade: true })
  @JoinColumn()
  preference: Preference;

  @Column('float', { nullable: true })
  longitude: number;

  @Column('float', { nullable: true })
  latitude: number;


  @OneToMany(() => Media, media => media.user)
  media: Media[];


  @OneToMany(() => Photo, photo => photo.user, { cascade: true })
  @JoinColumn()
  photos: Photo[];


  @OneToMany(() => Like, (like) => like.user , { 
    cascade: true, // Permet de supprimer les likes si l'user est supprimé
  })
  sentLikes: Like[];

  @OneToMany(() => Like, (like) => like.likedUser)
  receivedLikes: Like[];



    // @OneToOne(() => Preference, preference => preference.user, { cascade: true })
    // preference: Preference;


   @Column({ type: 'varchar', nullable: true })
  resetPasswordToken?: string | null = null;;

  @Column({ type: 'datetime', nullable: true })
  resetPasswordExpires?: Date | null = null;;
}
