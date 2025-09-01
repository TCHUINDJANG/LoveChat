// // src/auth/strategies/google.strategy.ts
// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, StrategyOptions } from 'passport-google-oauth20';
// import { AuthService } from '../auth.service';

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
//   constructor(private authService: AuthService) {
//     const googleConfig: StrategyOptions = {
//       clientID: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
//       scope: ['email', 'profile'],
//       passReqToCallback: false // Ajout explicite de cette propriété
//     };

//     // Validation des variables d'environnement
//     if (!googleConfig.clientID || !googleConfig.clientSecret || !googleConfig.callbackURL) {
//       throw new Error('Google OAuth configuration is invalid');
//     }

//     super(googleConfig);
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: (err: any, user: any, info?: any) => void,
//   ): Promise<any> {
//     const { name, emails, photos } = profile;
    
//     // Validation des champs du profil
//     if (!emails || !emails[0]?.value || !name) {
//       return done(new Error('Invalid Google profile: email and name are required'), null);
//     }

//     const user = {
//       email: emails[0].value,
//       firstName: name.givenName,
//       lastName: name.familyName,
//       picture: photos?.[0]?.value,
//       accessToken,
//     };
    
//     try {
//       const validatedUser = await this.authService.validateSocialUser(user, 'google');
//       done(null, validatedUser);
//     } catch (err) {
//       done(err, null);
//     }
//   }
// }