
import { Column, Entity, PrimaryGeneratedColumn, Unique , JoinColumn, OneToMany} from 'typeorm'
import { OneToOne } from 'typeorm';
import { Preference } from 'src/Preferences/entity/preference.entity';
import { Photo } from 'src/upload/entity/photo.entity';
// import { Preference } from 'src/Preferences/entity/preference.entity';


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


  @OneToMany(() => Photo, photo => photo.user, { cascade: true })
  @JoinColumn()
  photos: Photo[];



    // @OneToOne(() => Preference, preference => preference.user, { cascade: true })
    // preference: Preference;


   @Column({ type: 'varchar', nullable: true })
  resetPasswordToken?: string | null = null;;

  @Column({ type: 'datetime', nullable: true })
  resetPasswordExpires?: Date | null = null;;
}
