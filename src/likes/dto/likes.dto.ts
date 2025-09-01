import { IsOptional,  IsNotEmpty, IsString , IsArray , IsNumber} from 'class-validator';


export class LikeDto {
   
    
@IsNotEmpty()
@IsString()
userId: string;
}