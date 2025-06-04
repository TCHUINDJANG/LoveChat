export class SearchUserDto {
  age?: number;
  minAge?: number;
  maxAge?: number;
  gender?: string;
  location?: string;
  distance?: number; // en kilomètres
  profession?: string;
  educationLevel?: string;
  interests?: string[];
  latitude?: number;
  longitude?: number;
}