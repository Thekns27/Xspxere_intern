import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { GENDER } from 'src/profile/dto/create-profile.dto';

@Injectable()
export class UserService {
  constructor(private readonly dbService: DatabaseService) {}

  async create(dto: CreateUserDto) {
    const newUser = await this.dbService.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: dto.password,
        roles: dto.roles,
        referralUser: dto.referralUserId ? {
          connect: {id: dto.referralUserId}
        }:undefined,
        profile: {
          create: {
            profileImageUrl: dto.profileImageUrl,
            gender: dto.gender as GENDER,
            age: dto.age,
            birthdate: new Date(dto.birthdate),
          },
        },
      },
      include: { profile: true },
    });
    return newUser;
  }

  async findAll() {
    return await this.dbService.user.findMany({
      include: {
        profile: true,
        _count: { select: { posts: true } },
      },
    });
  }

  async findOne(id: number) {
    const user = await this.dbService.user.findUnique({
      where: { id },
      include: {
        profile: true,
        referralUsers: true,
        referralUser: true,
        posts: true,
      },
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async update(id: number, dto: Partial<CreateUserDto>) {
    return await this.dbService.user.update({
      where: { id },
      data: {
        email: dto.email,
        name: dto.name,
        roles: dto.roles,
        profile: {
          update: {
            profileImageUrl: dto.profileImageUrl,
            gender: dto.gender as GENDER,
            age: dto.age,
            birthdate: dto.birthdate ? new Date(dto.birthdate) : undefined,
          },
        },
      },
      include: { profile: true },
    });
  }

  async remove(id: number) {
    return await this.dbService.user.delete({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.dbService.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    return this.dbService.user.findUnique({ where: { id } });
  }
}
