import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { User } from './entities/user.entity';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class UserService {
  constructor(private dbService: DatabaseService) {}

   async create(createUserDto: CreateUserDto, imagePath: string) {
    const newUser = await this.dbService.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: createUserDto.password,
        roles: createUserDto.roles,
        profile: {
          create: {
            age: createUserDto.age,
            birthdate: createUserDto.birthdate,
            gender: createUserDto.gender,
            profileImageUrl: imagePath,
          },
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        roles: true,
        profile: {
          select: {
            age: true,
            birthdate: true,
            gender: true,
            profileImageUrl: true,
          },
        }
      },
    });
    return newUser;
  }

  async findAll(): Promise<{ message: string; users: User[] }> {
    const users = await this.dbService.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        roles: true,
      },
    });
    return {
      message: 'fetch success',
      users,
    };
  }

  async findOne(id: number) {
    try {
      const user = await this.dbService.user.findUnique({
        where: {
          id,
        },
      });
      if (!user) {
        throw Error('User Not Found');
      }

      return user;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'p2025') {
          throw new HttpException('user not found', 400);
        }
      }
      if (e instanceof Error) throw new HttpException(e.message, 400);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const updateUser = await this.dbService.user.update({
        where: {
          id,
        },
        data: {
          ...updateUserDto,
        },
      });
      return updateUser;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new HttpException('user not found', 400);
        }
      }
      if (e instanceof Error) throw new HttpException(e.message, 400);
    }
  }

  async remove(id: number) {
    try {
      const deletedUser = await this.dbService.user.delete({
        where: { id },
      });
      return deletedUser;
    } catch (e) {
      // console.log(e);
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new HttpException('user not found', 400);
        }
      }
      if (e instanceof Error) throw new HttpException(e.message, 400);
    }
  }
  async findByEmail(email: string) {
    return this.dbService.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    return this.dbService.user.findUnique({ where: { id } });
  }
}
