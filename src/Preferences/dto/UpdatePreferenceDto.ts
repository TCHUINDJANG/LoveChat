import { IsOptional,  IsNotEmpty, IsString , IsArray , IsNumber} from 'class-validator';


export class UpdatePreferenceDto {
   
    
@IsOptional()
@IsNotEmpty()
@IsString()
gender?: string;


@IsOptional()
@IsArray()
@IsNotEmpty()
@IsString({ each: true })
interests?: string[];

@IsNotEmpty()
@IsString()
minAge?: number;

@IsNotEmpty()
@IsString()
maxAge?: number;

@IsNotEmpty()
@IsNumber()
age?: number;

@IsNotEmpty()
@IsString()
location?: string;

@IsOptional()
@IsNumber()
distancePreference?: number;

@IsOptional()
coordinates?: [number, number];


@IsOptional()
@IsNotEmpty()
@IsString()
educationLevel?: string;


@IsOptional()
@IsNotEmpty()
@IsString()
profession?: string;




}