import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt , Strategy } from "passport-jwt";
import { AuthService } from "./auth.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor( private configService: ConfigService , private readonly authService: AuthService){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey:
                configService.get('JWT_SECRET') || 'loVe_chat_2025_@@_chat_@@23_DEV',
        });
    }


    
async validate(req: Request, payload: any) {

    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);


    if(!token) {
        throw new UnauthorizedException('Token non fourni');
    }

    const isInvalid = await this.authService.isTokenInvalid(token);



    if(isInvalid) {
        throw new UnauthorizedException('Token invalide')
    }
    return {
        id:payload.id,
        email: payload.email , 
        telephone: payload.telephone,
        role:payload.role
    }
    };
}

