import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikeDto } from '../dto/likes.dto';
import { Like } from '../entities/likes.entity';
import { Request } from '@nestjs/common';

@Injectable()
export class LikesService {

    constructor(
        @InjectRepository(User)
                    private readonly userRepo:Repository<User>,
        @InjectRepository(Like)
            private readonly likeRepositoy: Repository<Like>,
                   
    ) {}


    async createLike(@Request() req , dto:LikeDto)  {

        const user2 = await this.userRepo.findOneBy({id:dto.userId})

        const user1 = await this.userRepo.findOneBy({id :req.user.id})


        if(!user1) {
            throw new Error("Vous ne pouvez pas liker");
        }

        if(!user2) {
            throw new Error('User not found');
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

        return await this.likeRepositoy.save(like);
    }
}
