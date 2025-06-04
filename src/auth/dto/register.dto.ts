
import { IsEmail, IsNotEmpty, IsString, Validate, ValidateIf } from 'class-validator';


export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  nom: string;

  @IsNotEmpty()
  @IsString()
  prenon: string;

  @IsNotEmpty()
  @IsString()
  telephone?: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  email?: string;
}