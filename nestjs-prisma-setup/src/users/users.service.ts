import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { GENDER } from 'src/profile/dto/create-profile.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class UserService {
  constructor(private readonly dbService: DatabaseService) {}

  // async create1(dto: CreateUserDto) {
  //   try {
  //     const newUser = await this.dbService.user.create({
  //       data: {
  //         email: dto.email,
  //         name: dto.name,
  //         password: dto.password,
  //         roles: dto.roles,
  //         referralUser: dto.referralUserId
  //           ? {
  //               connect: { id: dto.referralUserId },
  //             }
  //           : undefined,
  //         profile: {
  //           create: {
  //             profileImageUrl: dto.profileImageUrl,
  //             gender: dto.gender as GENDER,
  //             age: dto.age,
  //             birthdate: new Date(dto.birthdate),
  //           },
  //         },
  //       },
  //       include: { profile: true },
  //     });
  //     return newUser;
  //   } catch (e) {
  //     if (e instanceof PrismaClientKnownRequestError) {
  //       if (e.code === 'P2025') {
  //         throw new HttpException(' not found', 400);
  //       }
  //     }
  //     if (e instanceof Error) throw new HttpException(e.message, 400);
  //   }
  // }
  async create(dto: CreateUserDto) {
  try {
    const birthdate = new Date(dto.birthdate);
    if (isNaN(birthdate.getTime())) {
      throw new HttpException('Invalid birthdate', 400);
    }

    const newUser = await this.dbService.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: dto.password,
        roles: dto.roles,
        referralUser: dto.referralUserId
          ? { connect: { id: dto.referralUserId } }
          : undefined,
        profile: {
          create: {
            profileImageUrl: dto.profileImageUrl,
            gender: dto.gender as GENDER,
            age: dto.age,
            birthdate,
          },
        },
      },
      include: { profile: true },
    });

    return newUser;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === 'P2025') {
        throw new HttpException('Referral user not found', 400);
      }

      if (e.code === 'P2002') {
        throw new HttpException('Email already exists', 409);
      }
    }

    throw new HttpException(
      e instanceof Error ? e.message : 'User creation failed',
      400,
    );
  }
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
    try {
      const user = await this.dbService.user.findUnique({
        where: { id },
        include: {
          profile: true,
          referralUsers: true,
          referralUser: true,
          posts: true,
        },
      });
      return user;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new HttpException('userId not found', 400);
        }
      }
      if (e instanceof Error) throw new HttpException(e.message, 400);
    }
  }

  async update(id: number, dto: Partial<CreateUserDto>) {
    try {
      const updateUser = await this.dbService.user.update({
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
      return updateUser;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new HttpException('postid not found', 400);
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
      return {
        message: 'delete success',
        deletedUser,
      };
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new HttpException('deletedId not found', 400);
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
