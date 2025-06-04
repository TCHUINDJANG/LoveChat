import { IsNotEmpty, IsString, MaxLength , IsUUID } from 'class-validator';



export class createMessageDto {

    @IsNotEmpty()
    matchId: number;


  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  content: string;
}