import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Roles } from './guard/role.decorator';
import { RolesGuard } from './guard/roles.guard';
import { AuthGuard } from './guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private usersService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() LoginDto: LoginDto) {
    return this.authService.login(LoginDto);
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Post('register')
  @Roles(['admin'])
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Get('all-users')
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(['Editor'])
  async findAllUsers() {
    return this.usersService.findAll ();
  }
}
