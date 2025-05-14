import { IsEmail, IsOptional, IsString, IsPhoneNumber, IsEnum, IsNotEmpty } from 'class-validator';
import { Status } from 'src/user/entities/user.entity';
import { Transform } from 'class-transformer';



export class UpdateStatutDto {

   @IsNotEmpty()
  @IsEnum(Status)
  statut?: Status;



  

  

  
 
}