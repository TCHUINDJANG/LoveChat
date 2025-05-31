// src/auth/entities/invalid-token.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class InvalidToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;
 
  @Column()
  expiresAt: Date;
}