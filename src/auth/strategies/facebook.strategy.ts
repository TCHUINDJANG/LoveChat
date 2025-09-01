// // src/auth/strategies/facebook.strategy.ts
// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-facebook';
// import { AuthService } from '../auth.service';
// import { getFacebookConfig } from '../../config/social.config';

// @Injectable()
// export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
//   constructor(private authService: AuthService) {
//     super(getFacebookConfig()); // Configuration validée
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: (err: any, user: any, info?: any) => void,
//   ): Promise<any> {
//     const { name, emails, photos } = profile;
//     const user = {
//       email: emails[0].value,
//       firstName: name.givenName,
//       lastName: name.familyName,
//       picture: photos[0].value,
//       accessToken,
//     };
    
//     // const validatedUser = await this.authService.validate(user, 'facebook');
//     done(null, validatedUser);
//   }
// }