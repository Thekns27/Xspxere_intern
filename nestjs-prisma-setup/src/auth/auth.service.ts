import { RegisterDto } from './dto/register.dto';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private dbService: DatabaseService,
  ) {}

  async login1(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    console.log(user)
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    // if (user.password !== loginDto.password) {
    //   console.log(user.password);
    //   console.log(loginDto.password)
    //   throw new UnauthorizedException('invalid password');
    // }

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };
    return {
      message: 'login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.roles,
        createdAt: user.createdAt,
      },
      access_token: this.jwtService.sign(payload),
    };
  }


  async register(dto: RegisterDto) {
   // const { email, name, password, referralUserId } = dto

    const existingUser = await this.dbService.user.findUnique({
      where: { email:dto.email }
    })

    if (existingUser) {
      throw new ConflictException('Email already exists')
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10)

    const user = await this.dbService.user.create({
      data: {
        email:dto.email,
        name: dto.name,
        password: hashedPassword,
        roles: dto.roles,
        referralUserId: dto.referralUserId ?? null
      }
    })

    const token = await this.jwtService.signAsync({
      sub: user.id,
      roles: user.roles
    })

    return {
      message: 'User registered successfully!go to login',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles
      },
      token
    }
  }

  // async register2(createUserDto:CreateUserDto){ {
  //   const existingUser = await this.userService.findByEmail(createUserDto.email);
  //   if (existingUser) {
  //     throw new ConflictException('Email already exists!use another email');
  //   }
  //    const saltRounds = 10;
  //    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

  //   const user = await this.userService.create({
  //     ...createUserDto,
  //     password: hashedPassword,
  //   });

  //   const payload = {
  //     sub: user.id,
  //     email: user.email,
  //     password:createUserDto.password,
  //     roles: createUserDto.roles,
  //   };
  //   if (!user) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }
  //   return {
  //     message: 'registration success!go to login',
  //     user: {
  //       id: user.id,
  //       email: user.email,
  //       name: user.name,
  //       createdAt: user.createdAt,
  //     },
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }
  // }

  async login(dto: LoginDto) {
   // const { email, password } = dto

    const user = await this.dbService.user.findUnique({
      where: { email:dto.email }
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      roles: user.roles
    })

    return {
      message: 'Login successful',
       user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
        createdAt: user.createdAt
      },
      access_token : token,
    }
  }
}


