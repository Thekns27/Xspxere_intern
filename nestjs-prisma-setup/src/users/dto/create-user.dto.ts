import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
   @ApiProperty({
      description: 'The name of the user',
      example: 'kyaw',
    })
  name: string;

  @IsEmail()
   @ApiProperty({
    description: 'The name of the email',
    example: 'kyaw@gmail.com',
  })
  email: string;

  @IsString()
   @ApiProperty({
    description: 'password',
    example: '123456',
  })
  password: string;

  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
   @ApiProperty({
    description: 'The name of the roles',
    example: '["Admin"]',
  })
  roles: string[];

  // @IsOptional()
  //  @ApiProperty({
  //   description: 'The name of the file',
  //   example: 'photo.jpg',
  // })
  //  profileImage?: any;

  // @IsEnum(GENDER)
  // gender: GENDER;

  // @IsNumber()
  // @Transform(({ value }) => Number(value))
  // age: number;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({
    description: 'birthdate',
    example: '1998-10-12',
  })
  birthdate?: Date;

  @IsOptional()
    @ApiProperty({
    description: 'The name of the file',
    example: 'photo.jpg',
  })
  profileImageUrl ?: any;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'gender',
    example: 'MALE',
  })
  gender?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({
    description: 'age',
    example: '25',
  })
  age?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({
    description: 'referralUserId',
    example: '1',
  })
  referralUserId?: number;
}
