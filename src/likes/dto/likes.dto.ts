import { IsOptional,  IsNotEmpty, IsString , IsArray , IsNumber} from 'class-validator';


export class LikeDto {
   
    
@IsOptional()
@IsNotEmpty()
@IsString()
userId: string;
}