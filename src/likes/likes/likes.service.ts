import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikeDto } from '../dto/likes.dto';
import { Like } from '../entities/likes.entity';
import { Request } from '@nestjs/common';
import { Body } from '@nestjs/common';

@Injectable()
export class LikesService {

    constructor(
        @InjectRepository(User)
                    private readonly userRepo:Repository<User>,
        @InjectRepository(Like)
            private readonly likeRepositoy: Repository<Like>,
                   
    ) {}


    async createLike(@Request() req , @Body() dto:LikeDto)  {

        const user2 = await this.userRepo.findOne({ where : {id:dto.userId}})

        const user1 = await this.userRepo.findOne( { where: {id :req.user.id}})


        if(!user1) {
            throw new NotFoundException("Vous ne pouvez pas liker");
        }

        if(!user2) {
            throw new NotFoundException('User not found');
        }

        const findLike = await this.likeRepositoy.findOne({ where: {user:user1 , likedUser: user2}});

        if(findLike) {
            throw new BadRequestException("Vous likez deja cet utilisateur")
        }

        const like = this.likeRepositoy.create({

            user: user1,
            likedUser : user2,
            isLike: false,
            matchDate: new Date(),
            createdAt: new Date(),
            updatedAt: Date(),
            isMatch:false,
        });


        if(user2.receivedLikes.map(likedUser =>user1)) {
            like.isMatch = true;
        }

        

        return await this.likeRepositoy.save(like);
    }

    // dislike tout passe a false
}
