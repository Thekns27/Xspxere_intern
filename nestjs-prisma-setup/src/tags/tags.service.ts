import { HttpException, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { DatabaseService } from 'src/database/database.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
    constructor(private dbService: DatabaseService) {}

async   create(dto : CreateTagDto) {
  const newTag = await this.dbService.tags.create({
    data: {
      postId: dto.postId,
      userId : dto.userId
    },
    select: {
      id: true,
      postId: true,
      userId: true,
    }
  });
  return newTag;
  }

   async update(id: number, updateTagDto: UpdateTagDto) {
      try {
        const updateUser = await this.dbService.tags.update({
          where: {
            id,
          },
          data: {
            ...updateTagDto,
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

async  delete(id: number) {
    try {
      const deletedTag = await this.dbService.tags.delete({
        where : {id},
      })
      return deletedTag;
    } catch (e) { if (e instanceof PrismaClientKnownRequestError) {
            if (e.code === 'P2025') {
              throw new HttpException('user not found', 400);
            }
          }
          if (e instanceof Error) throw new HttpException(e.message, 400);
        }
  }

}
