import { IsEmail, IsNotEmpty, IsString, IsOptional, IsArray, IsNumber } from 'class-validator';
import { Profile } from 'src/profile/entities/profile.entity';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsArray()
  roles?: string[];

  @IsOptional()
  @IsArray()
  profile?: Profile[];

  @IsOptional()
  @IsNumber()
  referralUserId?: number;

}
