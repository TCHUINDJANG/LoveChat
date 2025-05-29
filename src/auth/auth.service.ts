import { BadRequestException, Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Status, User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ResetPasswordDto } from './dto/ResetPasswordDto.dto';
import { NotFoundException } from '@nestjs/common';
import { RegisterAdminDto } from './dto/register.admin.dto';
import { Role } from 'src/user/entities/user.entity';
import { InvalidToken } from './entities/invalid-token.entity';
import { error } from 'console';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepo:Repository<User>,
        private readonly jwtService: JwtService,
        @InjectRepository(InvalidToken)
        private readonly invalidTokenRepo: Repository<InvalidToken>,
        private emailService : EmailService,
    ) {}





    async register(dto: RegisterDto){

            const user = await this.userRepo.findOne({where: [{email:dto.email} , { telephone:dto.telephone}]});

            if (user) throw new BadRequestException("l'utilisateur exite deja")

                const hashedPassword = await bcrypt.hash(dto.password , 10)


            // 3. Générer un token d'activation (JWT)
            const activationToken = this.jwtService.sign(
                { email: dto.email, telephone: dto.telephone },
                { secret: process.env.JWT_ACTIVATION_SECRET, expiresIn: '24h' },
            )

                const newUser = this.userRepo.create({
                    nom:dto.nom,
                    prenom:dto.prenon,
                    email:dto.email,
                    telephone:dto.telephone,
                    password:hashedPassword,
                    isActive: false,
                    activationToken,
                });

                const saved = await this.userRepo.save(newUser)

            // 6. Envoyer l'email d'activation (uniquement si email fourni)
            if(dto.email) {
                await this.emailService.sendActivationEmail(dto.email , activationToken);
            }

            const { password, activationToken: _, ...userData } = saved;

                return {
                    success:true,
                    message:"Utilisateur cree. Un email d'activation a été envoyé.",
                    data:saved,
                }
    }




    // Ajoutez cette méthode pour activer le compte
    async activateAccount(token:string) {
        try {
            const payload = this.jwtService.verify(token , {
                secret:process.env.JWT_ACTIVATION_SECRET,
            });

            const user = await this.userRepo.findOne({
                where: [
                    { email: payload.email },
                    { telephone: payload.telephone },
                ],
            });

            if(!user) throw new BadRequestException('Utilisateur non trouvé');
            if(user.isActive) throw new BadRequestException('Compte déjà activé');

            user.isActive = true;
            user.activationToken = null;
            await this.userRepo.save(user);

            return  {
                success : true,
                message:'Compte active avec success'
            }
        } catch (error) {
            throw new BadRequestException('Token invalide ou expiré');
        }
    }



    async findByEmailOrPhone(email , telephone , role):Promise<any> {

        const user =   await this.userRepo.findOne({
            where: [{ email : email , role:role} , {telephone: telephone , role:role}],
        });

        if(!user)  throw new BadRequestException("l'utilisateur n'exite pas")

        if(user.statut===Status.DESACTIVATE) 
            throw new UnauthorizedException('votre compte a ete supprime')

        if(user.statut===Status.BLOCKED) 
            throw new UnauthorizedException('votre compte a ete bloque')


            return {
                success: true,
                message: "Utilisateur trouve",
                data:user
            }

       
    }


    async login(dto: LoginDto) {
        const role = Role.USER
        const user = await this.findByEmailOrPhone(dto.email , dto.telephone , role)

        const passwordMatch = await bcrypt.compare(dto.password , (await user).data.password)

        if(!passwordMatch) throw new BadRequestException("Mot de passe incorect")


        const payload = {
            id: user.data.id,
            email:user.data.email,
            telephone: user.data.telephone
        };

        const token = this.jwtService.sign(payload)

            return {
                success : true,
                message:"Utilisateur connecte",
                token:token,
                user:user
            };
    }



    async resetPassword(id: string ,dto:ResetPasswordDto) {
        const user = await this.userRepo.findOne(({ where: {id: id}}));

        if(!user) {
                    throw new NotFoundException(`User with ID ${id} not found`);
                }


        const hashedPassword = await bcrypt.hash(dto.newPassword, 10)

        user.password = hashedPassword ?? user.password



        await this.userRepo.save(user)

        return {
            success:true,
            message:'Mot de passe echange avec success',
        }

        
    }


     async registerAdmin(dto: RegisterAdminDto){
        
            const role = Role.ADMIN
            const user = await this.userRepo.findOne({where: {email:dto.email ,  password:dto.password , role}});

            if (user) throw new BadRequestException("cet admin  exite deja")

                const hashedPassword = await bcrypt.hash(dto.password , 10)

                const newAdmin = this.userRepo.create({
                    email:dto.email,
                    password:hashedPassword,
                    role: Role.ADMIN

                });

                const saved = await this.userRepo.save(newAdmin)

                return {
                    success:true,
                    message:"Administrateur cree avec success",
                    data: {
                        email:saved.email,
                        telephone:saved.telephone
                    },
                }
    }




    async loginAdmin(dto: LoginDto) {
        const role = Role.ADMIN
        const user = await this.findByEmailOrPhone(dto.email , dto.telephone , role)

        const passwordMatch = await bcrypt.compare(dto.password , (await user).data.password)

        if(!passwordMatch) throw new BadRequestException("Mot de passe incorect")


        const payload = {
            id: user.data.id,
            email:user.data.email,
            telephone: user.data.telephone,
            role: Role.ADMIN,
        };

        const token = this.jwtService.sign(payload)

            return {
                success : true,
                message:"Utilisateur connecte",
                token:token,
                user:user
            };
    }



    
    async logout(token: string): Promise<{ success: boolean; message: string }> {
    try {
      // Vérifier si le token est déjà invalidé
      const existing = await this.invalidTokenRepo.findOne({ where: { token } });
      if (existing) {
        return {
          success: true,
          message: 'Déconnexion réussie (token déjà invalidé)',
        };
      }

      // Décoder le token pour obtenir la date d'expiration
      const decoded = this.jwtService.decode(token) as { exp: number };
      if (!decoded || !decoded.exp) {
        throw new Error('Token invalide');
      } // Convertir le timestamp UNIX en Date
      const expiresAt = new Date(decoded.exp * 1000);

      // Stocker le token invalidé
      await this.invalidTokenRepo.save({
        token,
        expiresAt,
      });

      return {
        success: true,
        message: 'Déconnexion réussie',
      };
    } catch (error) {
      throw new BadRequestException('Échec de la déconnexion: ' + error.message);
    }
  }


  async isTokenInvalid(token: string): Promise<boolean> {
    const invalidToken = await this.invalidTokenRepo.findOne({ where: { token } });
    return !!invalidToken;
  }

  // Méthode pour nettoyer les tokens expirés (peut être appelée périodiquement)
  async cleanExpiredTokens(): Promise<void> {
    await this.invalidTokenRepo
      .createQueryBuilder()
      .delete()
      .where('expiresAt < :now', { now: new Date() })
      .execute();
  }





    
}
