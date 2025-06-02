import { IsEmail, IsOptional, IsString, IsPhoneNumber, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Sexe } from 'src/user/entities/user.entity';
import { Transform } from 'class-transformer';



export class UpdateProfileDto {


   @IsOptional()
  @IsString()
  nom?: string;


  @IsOptional()
  @IsString()
  prenom?: string;


  @IsOptional()
  @IsString()
  biographie?: string;

  @IsOptional()
  @IsNumber()
  age?: number;


  @IsOptional()
  @IsEmail()
  email?: string;


  @IsOptional()
  @IsPhoneNumber('FR') 
  telephone?: string;

  

  @IsNotEmpty()
  @IsEnum(Sexe , {
    message: 'Le sexe doit être l\'une des valeurs suivantes: M, F, N'
  })
  @Transform(({ value }) => value?.toUpperCase())
  sexe?: Sexe;

  @IsOptional()
  preferences?: {
    ageMin?: number;
    ageMax?: number;
    distanceMax?: number;
  };
}