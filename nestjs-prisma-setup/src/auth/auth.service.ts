import { RegisterDto } from './dto/register.dto';
import { CreateUserDto } from './../users/dto/create-user.dto';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user || user.password !== loginDto.password) {
      throw new UnauthorizedException('wrong password or email');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };
    return {
      message: 'login success',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto:CreateUserDto){ {
    const existingUser = await this.userService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists!use another email');
    }
     const saltRounds = 10;
     const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const user = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const payload = {
      sub: user.id,
      email: user.email,
      password:createUserDto.password,
      roles: createUserDto.roles,
    };
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      message: 'registration success!go to login',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      access_token: this.jwtService.sign(payload),
    };
  }
  }

  // async register2(registerDto:RegisterDto) {
  //   const existingUser = await this.userService.findByEmail(registerDto.email);
  //   if (existingUser) {
  //     throw new ConflictException('Email already exists!use another email');
  //   }
  //   const hashedPassword = await bcrypt.hash(registerDto.password, 10);

  //   const user = await this.userService.create({
  //     ...registerDto,
  //     password: hashedPassword,
  //     roles:createUserDto.roles,
  //   },
  //   createUserDto.profileImageUrl
  //   );

  //   const payload = {
  //     sub: user.id,
  //     email: user.email,
  //     roles: createUserDto.roles,
  //   };
  //   if (!user) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }
  //   return {
  //     message: 'registration success',
  //     user: {
  //       id: user.id,
  //       email: user.email,
  //       name: user.name,
  //       createdAt: user.createdAt,
  //     },
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }
}

