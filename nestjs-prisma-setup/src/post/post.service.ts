import { create } from 'domain';
import { HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    return await this.dbService.post.findMany({
      include: {
        categoriesOnPosts: { include: { category: true } },
        tags: { include: { user: true } },
        author: true,
      },
    });
  }
  async findOne(id: number) {
    const post = await this.dbService.post.findUnique({
      where: { id },
      include: {
        categoriesOnPosts: true,
        tags: true,
      },
    });
    if (!post) throw new NotFoundException(`Post with ID ${id} not found`);
    return post;
  }

  async update(id: number, updatePostDto: Partial<CreatePostDto>) {
    return await this.dbService.post.update({
      where: { id },
      data: {
        title: updatePostDto.title,
        isPublished: updatePostDto.isPublished,
        ...(updatePostDto.categoriesIds && {
          categoriesOnPosts: {
            deleteMany: {},
            create: updatePostDto.categoriesIds.map((catId) => ({
              category: { connect: { id: catId } },
            })),
          },
        }),
        ...(updatePostDto.tagUsersIds && {
          tags: {
            deleteMany: {},
            create: updatePostDto.tagUsersIds.map((userId) => ({
              user: { connect: { id: userId } },
            })),
          },
        }),
      },
    });
  }
  // async delete(id: number) {
  //   await this.dbService.categoriesOnPosts.deleteMany({
  //     where: { postId: id },
  //   });
  //   return await this.dbService.post.delete({
  //     where: { id },
  //   });
  // }
  async  delete (id: number) {
    const deletedPost = await this.dbService.post.delete({
      where: {id}
    })
    return deletedPost;
  }

}
