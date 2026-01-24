

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export class Profile {
  id: number;
  profileImageUrl: string;
  gender: Gender;
  age: number;
  birthdate: Date;
  user?: any;
}
