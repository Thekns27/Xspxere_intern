import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
   @ApiProperty({
      description: 'The name of the email',
      example: 'kyaw@gmail.com',
    })
  email: string;

  @IsString()
  @IsNotEmpty()
   @ApiProperty({
    description: 'password',
    example: '123456',
  })
  password: string;
}
