
import { Transform } from "class-transformer";
import { IsDate, IsDateString, IsEnum, IsNumber, IsString } from "class-validator";
import { User } from "src/users/entities/user.entity";


export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export class CreateProfileDto {

//   @IsString()
//   profileImageUrl: string;

//   @IsEnum(GENDER)
//   gender: GENDER;

//   @IsNumber()
//   @Transform(({ value }) => Number(value))
//   age: number;

// //   @IsDateString()
// //   birthdate: string;
//  @IsDate()
//   @Transform(({ value }) => new Date(value))
//   birthdate: Date;

//   user : User[];

}