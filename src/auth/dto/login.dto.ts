import { IsEmail, IsNotEmpty, IsString, Validate, ValidateIf } from 'class-validator';


export class LoginDto {
   
    
@ValidateIf((o) => !o.telephone)
@IsNotEmpty()
@IsString()
email : string;


@ValidateIf((o) => !o.email)
@IsNotEmpty()
@IsString()
telephone : string;




@IsNotEmpty()
@IsString()
password : string;


}