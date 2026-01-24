import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { DatabaseService } from 'src/database/database.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class PostService {
  constructor(private readonly dbService: DatabaseService) {}

  async create(createPostDto: CreatePostDto) {
    try {
      const newPost = await this.dbService.post.create({
        data: {
          title: createPostDto.title,
          authorId: createPostDto.authorId,
          isPublished: createPostDto.isPublished,
          categoriesOnPosts: {
            create: createPostDto.categoriesIds?.map((id) => ({
              category: { connect: { id } },
            })),
          },
          tags: {
            create: createPostDto.tagUsersIds?.map((id) => ({
              user: { connect: { id } },
            })),
          },
        },
        select: {
          id: true,
          title: true,
          authorId: true,
          isPublished: true,
          createdAt: true,
          updatedAt: true,
          categoriesOnPosts: { include: { category: true } },
          tags: { include: { user: true } },
        },
      });
      return { message: 'create success', post: newPost };
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new HttpException('postid not found', 400);
        }
      }
      if (e instanceof Error) throw new HttpException(e.message, 400);
    }
  }

  async findAll() {
    const posts = await this.dbService.post.findMany({
      include: {
        categoriesOnPosts: { include: { category: true } },
        tags: { include: { user: true } },
        author: true,
      },
    });
    return {
      message: 'find all posts success',
      posts,
    };
  }

  async findOne(id: number) {
    try {
      const post = await this.dbService.post.findUnique({
        where: { id },
        include: {
          categoriesOnPosts: true,
          tags: true,
        },
      });
      return post;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new HttpException('postid not found', 400);
        }
      }
      if (e instanceof Error) throw new HttpException(e.message, 400);
    }
  }

  async update(id: number, updatePostDto: Partial<CreatePostDto>) {
    try {
      const updatedPost = await this.dbService.post.update({
        where: { id },
        data: {
          title: updatePostDto.title,
          isPublished: updatePostDto.isPublished,
          categoriesOnPosts: updatePostDto.categoriesIds
            ? {
                deleteMany: {},
                create: updatePostDto.categoriesIds.map((catId) => ({
                  category: { connect: { id: catId } },
                })),
              }
            : undefined,

          tags: updatePostDto.tagUsersIds
            ? {
                deleteMany: {},
                create: updatePostDto.tagUsersIds.map((userId) => ({
                  user: { connect: { id: userId } },
                })),
              }
            : undefined,
        },
      });

      return {
        message: 'update success',
        updatedPost,
      };
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new HttpException('postid not found', 400);
        }
      }
      if (e instanceof Error) throw new HttpException(e.message, 400);
    }
  }

  async delete(id: number) {
    try {
      const deletedPost = await this.dbService.post.delete({
        where: { id },
      });
      return {
        message: 'delete success',
        deletedPost,
      };
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new HttpException('postid not found', 400);
        }
      }
      if (e instanceof Error) throw new HttpException(e.message, 400);
    }
  }
}
