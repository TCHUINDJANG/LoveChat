// // src/auth/strategies/linkedin.strategy.ts
// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, StrategyOption } from 'passport-linkedin-oauth2';
// import { AuthService } from '../auth.service';

// @Injectable()
// export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
//   constructor(private authService: AuthService) {
//     // Configuration LinkedIn avec typage correct
//     const linkedinConfig: StrategyOption = {
//       clientID: process.env.LINKEDIN_CLIENT_ID as string,
//       clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
//       callbackURL: process.env.LINKEDIN_CALLBACK_URL as string,
//       scope: ['r_emailaddress', 'r_liteprofile'],
//       // passReqToCallback n'est PAS inclus ici car non supporté par LinkedIn
//     };

//     // Validation des variables d'environnement
//     if (!linkedinConfig.clientID || !linkedinConfig.clientSecret || !linkedinConfig.callbackURL) {
//       throw new Error('LinkedIn OAuth configuration is invalid');
//     }

//     super(linkedinConfig);
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: (err: Error | null, user: any, info?: any) => void,
//   ): Promise<void> {
//     try {
//       const { name, emails, photos } = profile;
      
//       if (!emails || !emails[0]?.value || !name) {
//         throw new Error('Invalid LinkedIn profile: email and name are required');
//       }

//       const user = {
//         email: emails[0].value,
//         firstName: name.givenName,
//         lastName: name.familyName,
//         picture: photos?.[0]?.value,
//         accessToken,
//       };
      
//       const validatedUser = await this.authService.validateSocialUser(user, 'linkedin');
//       done(null, validatedUser);
//     } catch (err) {
//       done(err as Error, null);
//     }
//   }
// }