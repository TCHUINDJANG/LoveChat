import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt , Strategy } from "passport-jwt";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor( private configService: ConfigService){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey:
                configService.get('JWT_SECRET') || 'loVe_chat_2025_@@_chat_@@23_DEV',
        });
    }


    
async validate(payload: any) {
    return {id:payload.id
         , email: payload.email , 
         telephone: payload.telephone}
    };
}

