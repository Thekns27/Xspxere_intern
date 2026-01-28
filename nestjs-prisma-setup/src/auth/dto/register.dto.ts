import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsArray, IsNumber } from 'class-validator';
import { Profile } from 'src/profile/entities/profile.entity';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
    @ApiProperty({
    description: 'The name of the email',
    example: 'kyaw@gmail.com',
  })
  email: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
    @ApiProperty({
    description: 'The name of the user',
    example: 'kyaw',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
    @ApiProperty({
    description: 'password',
    example: '123456',
  })
  password: string;

  @IsOptional()
  @IsArray()
    @ApiProperty({
    description: 'The name of the roles',
    example: '["User"]',
  })
  roles?: string[];

  // @IsOptional()
  // @IsArray()
  // profile?: Profile[];

  @IsOptional()
  @IsNumber()
    @ApiProperty({
    description: 'referralUserId',
    example: 'photo.jpg',
  })
  referralUserId?: number;
}
