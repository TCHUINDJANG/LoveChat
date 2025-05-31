import { IsNotEmpty, IsNumber } from "class-validator";

export class LocalisationUserDto {


   @IsNotEmpty()
   @IsNumber()
  longitude: number;

  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  }