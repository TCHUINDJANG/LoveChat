import { BadRequestException, Injectable , Request , NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UpdateProfileDto } from 'src/auth/dto/update-profile.dto';
import { EmailService } from 'src/email/email.service';
import { UpdateStatutDto } from 'src/auth/dto/update-status-dto';
import { SearchUserDto } from './dto/search-user.dto';
import * as geolib from 'geolib'; // Pour calculer les distances






@Injectable()
export class UserService {

    constructor(
            @InjectRepository(User)
            private readonly userRepo:Repository<User>,
            private emailService: EmailService,
            private jwtService: JwtService,
        ) {}


    async getProfile(@Request() req) {
        console.log('donnnes recues:' , req.user);


        const userId = req.user.id;
        const user = await this.userRepo.findOne(({ where: {id: userId}}));

        if(!user){
            throw new BadRequestException('Profil non trouve')
        }

        return  {
            success : true,
            message: "Profile recupere",
            data: {
                nom: user.nom,
                prenom : user.prenom,
                email: user.email,
                sexe:user.sexe,
                telephone: user.telephone,
                biographie: user.biographie,
                statut:user.statut,
                id:user.id,

            }
        }


    }


    async updateUserProfile(id: string , dto:UpdateProfileDto) {
        const user = await this.userRepo.findOne(({ where: {id: id}}));
        
        if(!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }


        user.nom = dto.nom ?? user.nom;
        user.prenom = dto.prenom ?? user.prenom;
        user.email = dto.email ?? user.email;
        user.telephone = dto.telephone ?? user.telephone;
        user.sexe = dto.sexe ?? user.sexe;
        user.biographie = dto.biographie ?? user.biographie
 

        await this.userRepo.save(user)

    
        return {
            success: true,
            message:'Profil mis a jour avec success',
            data: {
                nom:user.nom,
                prenom:user.prenom,
                sexe:user.sexe,
                email:user.email,
                telephone:user.telephone,
                biographie: user.biographie,
            }
        };

    }










    async putStatut(id: string , dto:UpdateStatutDto) {
        const user = await this.userRepo.findOne(({ where: {id: id}}));
        
        if(!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }


        user.statut = dto.statut ?? user.statut;
        
 

        await this.userRepo.save(user);

    
        return {
            success: true,
            message:"Statut de l'utilisateur modifie  avec success",
            data: {
                statut:user.statut,
                
            }
        };
    }


    // async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    //     const user = await this.userRepo.findOneBy({
    //         email: forgotPasswordDto.email
    //     });

    //     if(!user) return ;


    //     const token = this.jwtService.sign(
    //         {userId:user.id},
    //         { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_RESET_EXPIRES_IN },
    //     );



    //     user.resetPasswordToken = token;
    //     user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    //     await this.userRepo.save(user)


    //     await this.emailService.sendResetPasswordEmail(user.email , token)
    // }



    // async resetPassword(resetPasswordDto: ResetPasswordDto):Promise<void> {
    //     const payload = this.jwtService.verify(resetPasswordDto.token , {
    //         secret: process.env.JWT_SECRET,
    //     });

    //     const user = await this.userRepo.findOneBy({
    //         resetPasswordToken:resetPasswordDto.token,
    //         resetPasswordExpires:MoreThan(new Date()),
    //     })

    //     if(!user) throw new BadRequestException('Token invalide ou expiré');


    //     user.password = await bcrypt.hash(resetPasswordDto.newPassword , 10);
    //     user.resetPasswordToken = null;
    //     user.resetPasswordExpires = null;
    //     await this.userRepo.save(user)
    // }



    async SearchUserDto(searchUserdto: SearchUserDto): Promise<User[]> {
        const {
            age,
      minAge,
      maxAge,
      gender,
      location,
      distance,
      profession,
      educationLevel,
      interests,
      latitude,
      longitude,
        } = searchUserdto


        const query = this.userRepo.createQueryBuilder('user')
        .leftJoinAndSelect('user.preference' , 'preference');


        // Filtre par âge

        if(age){
            query.andWhere('user.age = :age' , {age});
        } else if (minAge || maxAge) {
            query.andWhere('user.age BETWEEN :minAge AND :maxAge', {
                minAge: minAge || 18,
                maxAge: maxAge || 100,
            });
        }


        // Filtre par genre
        if(gender) {
            query.andWhere('user.gender = :gender', { gender });
        }

        // Filtre par localisation (texte)

        if(location) {
            query.andWhere('user.localisation LIKE :localisation' , {
                location: `%${location}%`,
            })
        }


        // Filtre par profession
        if(profession){
            query.andWhere('preference.profession LIKE :profession' , {
                profession:`%${profession}%`,
            });
        }


        // Filtre par niveau d'éducation

        if(educationLevel) {
            query.andWhere('preference.educationLevel = :educationLevel', {
        educationLevel,
      });
        }



        // Filtre par centres d'intérêt

        if(interests && interests.length > 0){
            query.andWhere('preference.interests && ARRAY[:...interests]' , {
                interests,
            });
        }


        if (latitude && longitude && distance) {
      const users = await query.getMany();
      return users.filter((user) => {
        if (!user.latitude || !user.longitude) return false;
        const userDistance = geolib.getDistance(
          { latitude, longitude },
          { latitude: user.latitude, longitude: user.longitude },
        );
        return userDistance <= distance * 1000; // Conversion en mètres
      });
    }

    return query.getMany();
    }
}
