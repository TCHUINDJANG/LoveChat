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

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepo:Repository<User>,
        private readonly jwtService: JwtService
    ) {}





    async register(dto: RegisterDto){
            const user = await this.userRepo.findOne({where: [{email:dto.email} , { telephone:dto.telephone}]});

            if (user) throw new BadRequestException("l'utilisateur exite deja")

                const hashedPassword = await bcrypt.hash(dto.password , 10)

                const newUser = this.userRepo.create({
                    nom:dto.nom,
                    prenom:dto.prenon,
                    email:dto.email,
                    telephone:dto.telephone,
                    password:hashedPassword

                });

                const saved = await this.userRepo.save(newUser)

                return {
                    success:true,
                    message:"Utilisateur cree",
                    data:saved,
                }
    }



    async findByEmailOrPhone(email , telephone ):Promise<any> {

        const user =   await this.userRepo.findOne({
            where: [{ email : email} , {telephone: telephone}],
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
        const user = await this.findByEmailOrPhone(dto.email , dto.telephone)

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
    
}
