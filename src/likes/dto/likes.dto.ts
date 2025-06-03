import { IsOptional,  IsNotEmpty, IsString , IsArray , IsNumber } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';


export class LikeDto {
   
    
@IsNotEmpty()
@PrimaryGeneratedColumn('uuid')
userId: string;
}