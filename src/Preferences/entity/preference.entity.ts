import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';


@Entity()
export class Preference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, user => user.preference)
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  minAge: number;

  @Column({ nullable: true })
  maxAge: number;

  @Column({ nullable: true })
  location: string;

  @Column('float', { nullable: true })
  latitude: number;

  @Column('float', { nullable: true })
  longitude: number;

  @Column('simple-array', { nullable: true })
  coordinates: number[]; // [latitude, longitude]

  @Column({ nullable: true })
  profession: string;

  @Column({ nullable: true })
  educationLevel: string;

  @Column({ nullable: true })
  distancePreference: number; // en kilomètres

  @Column('simple-array', { nullable: true })
  interests: string[];
}