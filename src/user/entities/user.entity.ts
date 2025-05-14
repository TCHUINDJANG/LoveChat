
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'


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



    @Column({ type: 'json' , nullable: true})
    preferences?: {
        ageMin?: number;
        ageMax?: number;
        distanceMax?: number;
    };


   @Column({ type: 'varchar', nullable: true })
  resetPasswordToken?: string | null = null;;

  @Column({ type: 'datetime', nullable: true })
  resetPasswordExpires?: Date | null = null;;
}
