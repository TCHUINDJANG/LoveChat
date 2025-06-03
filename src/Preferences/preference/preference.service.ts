import { Injectable , NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Preference } from '../entity/preference.entity';
import { User } from 'src/user/entities/user.entity';
import { UpdatePreferenceDto } from '../dto/UpdatePreferenceDto';
import { Request } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class PreferenceService {

    constructor(
        @InjectRepository(Preference)
        private readonly preferenceRepository: Repository<Preference>,
        @InjectRepository(User)
                private readonly userRepo:Repository<User>,
    ) {}


    async createPreference(@Request() req , dto:UpdatePreferenceDto) {


        const userId = req.user.id;

        const user = await this.userRepo.findOne(({ where: {id: userId}}));

        const existingPreference = await this.preferenceRepository.findOne({ 
             where: { id: userId } 
     });

     if (existingPreference) {
    // Mettre à jour les préférences existantes
    return this.preferenceRepository.update(existingPreference.id, dto);
  }
        
                if(!user){
                    throw new BadRequestException('Utilisateur non trouve')
                }

        const preference = this.preferenceRepository.create({
            user,
            minAge:dto.minAge,
            maxAge:dto.maxAge,
            distancePreference:dto.distancePreference,
            location:dto.location   
        });

        await this.preferenceRepository.save(preference);

        return {
            success: true,
            message:'Preference cree avec success',
            data: {
                minAge:preference.minAge,
                maxAge:preference.maxAge,
                location:preference.location,
                distancePreference:preference.distancePreference,
                
                
            }
        };
    }


    async getUserPreference(@Request() req) {


        const userId = req.user.id;

        const preference = await this.preferenceRepository.findOne({
            where: { user: { id: userId } },
            relations: ['user'],
        });

        if(!preference) {
            throw new NotFoundException('Preferences not found');
        }

         return  {
            success : true,
            message: "Préférences récupérées avec succès",
            data: {
                age: preference.age,
                profession : preference.profession,
                interests: preference.interests,
                

            }
        }
    }


    
    
   async updateUserPreference(@Request() req, dto: UpdatePreferenceDto) {
    // Trouver les préférences existantes

    const userId = req.user.id;

    const existingPreference = await this.preferenceRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!existingPreference) {
      throw new NotFoundException('Préférences non trouvées pour cet utilisateur');
    }

    // Mettre à jour les préférences
        existingPreference.age = dto.age ?? existingPreference.age
        existingPreference.interests = dto.interests ?? existingPreference.interests,
        existingPreference.profession = dto.profession ?? existingPreference.profession,

        await this.preferenceRepository.save(existingPreference);
        return {
            success: true,
            message: 'Préférences mises à jour avec succès',
            data: {
                age: existingPreference.age,
                profession: existingPreference.profession,
                interests: existingPreference.interests,
        // Ajoutez d'autres champs si nécessaire
      },
    };
  }


    
}
