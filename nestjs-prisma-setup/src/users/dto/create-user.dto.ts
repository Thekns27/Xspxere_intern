import { GENDER } from 'generated/prisma/enums';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  roles: string[];

  profileImage: any;

  @IsEnum(GENDER)
  gender: GENDER;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  age: number;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  birthdate: Date;
}
