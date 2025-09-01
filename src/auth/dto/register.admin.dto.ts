
import { IsEmail, IsNotEmpty, IsString, Validate, ValidateIf } from 'class-validator';


export class RegisterAdminDto {
  
@IsString()
@IsNotEmpty()
password: string;


@IsEmail()
@IsNotEmpty()
email?:string;


    
}