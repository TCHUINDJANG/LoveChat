// import { Injectable } from "@nestjs/common";
// import { User } from "src/user/entities/user.entity";
// import { PreferenceService } from "src/Preferences/preference/preference.service";


// @Injectable()
// export class MatchAlgorithmService {
//     constructor(private readonly preferencesService: PreferenceService){}


//     async calculateCompatibilityScore(user1: User , user2:User) : Promise<number> {
//         const pref1 = await this.preferencesService.getUserPreference(user1.id);
//         const pref2 = await this.preferencesService.getUserPreference(user2.id);

//         let score = 0;

//         // 1. Correspondance d'âge (20%)

//         const ageDiff = Math.abs(pref1.age - pref2.age);
//         if(ageDiff <= 5) score +=20;
//         else if (ageDiff <= 10) score +=10;


//         // 3. Centres d'intérêt communs (20%)

//         const commonInterrest = pref1.interests.filter(interest =>
//             pref2.interests.includes(interest)).length;

//         score += Math.min(20, commonInterrest * 5);


//         // 4. Localisation (15%)
//         if(pref1.location === pref2.location) score +=15;
//         else if (pref1.distancePreference >= this.calculateDistance(
//             pref1.coordinates,
//             pref2.coordinates
//         )) {
//             score += 10
//         }


//         // 5. Niveau d'éducation et profession (15%)
//         if(pref1.educationLevel === pref2.educationLevel) score += 7;
//         if(pref1.profession === pref2.profession) score += 8;

//         return Math.min(100 , score) 
//     }

//     private calculateDistance(coords1: [number, number], coords2: [number, number]): number {
//     // Implémentation de la distance haversine
//     const [lat1, lon1] = coords1;
//     const [lat2, lon2] = coords2;
    
//     const R = 6371; // Rayon de la Terre en km
//     const dLat = this.toRad(lat2 - lat1);
//     const dLon = this.toRad(lon2 - lon1);
//     const a = 
//       Math.sin(dLat/2) * Math.sin(dLat/2) +
//       Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
//       Math.sin(dLon/2) * Math.sin(dLon/2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//     return R * c;
//   }

//   private toRad(degrees: number): number {
//     return degrees * (Math.PI / 180);
//   }
// }

