import { Injectable , NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Preference } from '../entity/preference.entity';
import { User } from 'src/user/entities/user.entity';
import { UpdatePreferenceDto } from '../dto/UpdatePreferenceDto';

@Injectable()
export class PreferenceService {

    constructor(
        @InjectRepository(Preference)
    private readonly preferenceRepository: Repository<Preference>,
    ) {}


    async createDefaultPreference(user:User) : Promise<Preference> {
        const preference = this.preferenceRepository.create({
            user,
            minAge:18,
            maxAge:99,
            distancePreference:50,   // 50 km par défaut
        });

        return this.preferenceRepository.save(preference)
    }


    async getUserPreference(userId: string):Promise<Preference> {
        const preference = await this.preferenceRepository.findOne({
            where: { user: {id:userId} },
            relations: ['user'],
        });

        if(!preference) {
            throw new NotFoundException('Preferences not found');
        }

        return preference;
    }


    async updateUserPreferences(userId:string,
        updatePreferenceDto: UpdatePreferenceDto,
    ) : Promise<Preference> {

        const preference = await this.getUserPreference(userId)


        // Mise à jour des champs

        if(updatePreferenceDto.gender !== undefined){
            preference.gender = updatePreferenceDto.gender;
        }

        if(updatePreferenceDto.interests !== undefined){
            preference.interests = updatePreferenceDto.interests;
        }

        if(updatePreferenceDto.minAge !== undefined) {
            preference.minAge = updatePreferenceDto.minAge;
        }

        if(updatePreferenceDto.maxAge !== undefined){
            preference.maxAge = updatePreferenceDto.maxAge;
        }

        if (updatePreferenceDto.location !== undefined) {
            preference.location = updatePreferenceDto.location;
    }
    if (updatePreferenceDto.coordinates !== undefined) {
            preference.coordinates = updatePreferenceDto.coordinates;
    }
    if (updatePreferenceDto.distancePreference !== undefined) {
            preference.distancePreference = updatePreferenceDto.distancePreference;
    }
    if (updatePreferenceDto.educationLevel !== undefined) {
            preference.educationLevel = updatePreferenceDto.educationLevel;
    }
    if (updatePreferenceDto.profession !== undefined) {
            preference.profession = updatePreferenceDto.profession;
    }


    return this.preferenceRepository.save(preference);
    }


    
}
