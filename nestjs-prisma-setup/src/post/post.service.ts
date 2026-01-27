import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { DatabaseService } from 'src/database/database.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class PostService {
  constructor(private readonly dbService: DatabaseService) {}

  // async create2(createPostDto: CreatePostDto) {
  //   try {
  //     const newPost = await this.dbService.post.create({
  //       data: {
  //         title: createPostDto.title,
  //         authorId: createPostDto.authorId,
  //         isPublished: createPostDto.isPublished,
  //         categoriesOnPosts: createPostDto.categoriesIds
  //           ? {
  //               create: createPostDto.categoriesIds.map((id) => ({
  //                 category: { connect: { id } },
  //               })),
  //             }
  //           : undefined,
  //         tags: createPostDto.tagUsersIds
  //           ? {
  //               create: createPostDto.tagUsersIds.map((id) => ({
  //                 user: { connect: { id } },
  //               })),
  //             }
  //           : undefined,
  //       },
  //       select: {
  //         id: true,
  //         title: true,
  //         authorId: true,
  //         isPublished: true,
  //         createdAt: true,
  //         updatedAt: true,
  //         categoriesOnPosts: { include: { category: true } },
  //         tags: { include: { user: true } },
  //       },
  //     });

  //     return { message: 'create success', post: newPost };
  //   } catch (e) {
  //     if (e instanceof PrismaClientKnownRequestError) {
  //       if (e.code === 'P2003') {
  //         throw new HttpException(
  //           `AuthorId ${createPostDto.authorId} not found`,
  //           400,
  //         );
  //       }
  //       if (e.code === 'P2025') {
  //         throw new HttpException(
  //           'Related categoriesIds or tagUsersIds not found',
  //           400,
  //         );
  //       }
  //     }
  //     console.error('Create post error:', e);
  //     throw new HttpException('Internal server error', 500);
  //   }
  // }

  // async create1(createPostDto: CreatePostDto) {
  //   try {
  //     const checkAuthorId = await this.dbService.post.findUnique({
  //       where: { id: createPostDto.authorId },
  //     });
  //     if (checkAuthorId.authorId === null) {
  //       throw new HttpException('author Id not found', 400);
  //     }
  //     const newPost = await this.dbService.post.create({
  //       data: {
  //         title: createPostDto.title,
  //         authorId: createPostDto.authorId,
  //         isPublished: createPostDto.isPublished,
  //         categoriesOnPosts: {
  //           create: createPostDto.categoriesIds?.map((id) => ({
  //             category: { connect: { id } },
  //           })),
  //         },
  //         tags: {
  //           create: createPostDto.tagUsersIds?.map((id) => ({
  //             user: { connect: { id } },
  //           })),
  //         },
  //       },
  //       select: {
  //         id: true,
  //         title: true,
  //         authorId: true,
  //         isPublished: true,
  //         createdAt: true,
  //         updatedAt: true,
  //         categoriesOnPosts: { include: { category: true } },
  //         tags: { include: { user: true } },
  //       },
  //     });
  //     return { message: 'create success', post: newPost };
  //   } catch (e) {
  //     if (e instanceof PrismaClientKnownRequestError) {
  //       if (e.code === 'P2025') {
  //         throw new HttpException('authorId  not found', 400);
  //       }
  //     }
  //     if (e instanceof Error) throw new HttpException(e.message, 400);
  //   }
  // }
  async create(
    createPostDto: CreatePostDto,
    files: Array<Express.Multer.File>,
  ) {
    try {
      const userExists = await this.dbService.user.findUnique({
        where: { id: createPostDto.authorId },
      });

      if (!userExists) {
        throw new HttpException('Author not found', 404);
      }

      const imageNames =
        files?.map((file) => ({
          postImageUrl: file.filename,
        })) || [];

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
          postImage: {
            create: imageNames,
          },
        },
        include: {
          categoriesOnPosts: { include: { category: true } },
          tags: { include: { user: true } },
          postImage: true,
        },
        // select: {
        //   id: true,
        //   title: true,
        //   authorId: true,
        //   isPublished: true,
        //   createdAt: true,
        //   updatedAt: true,
        //   categoriesOnPosts: { include: { category: true } },
        //   tags: { include: { user: true } },
        //   postImage: true,
        // }
      });
      return { message: 'Post Create success', post: newPost };
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2003') {
          throw new HttpException(
            `AuthorId ${createPostDto.authorId} not found`,
            400,
          );
        }
        if (e.code === 'P2025') {
          throw new HttpException(
            'Related categoriesIds or tagUsersIds not found',
            400,
          );
        }
      }
      console.error('Create post error:', e);
      throw new HttpException('Internal server error', 500);
    }
  }

  async findAll() {
    const posts = await this.dbService.post.findMany({
      include: {
        categoriesOnPosts: { include: { category: true } },
        tags: { include: { user: true } },
        author: true,
        postImage: true,
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
      if (!post) {
        throw new NotFoundException('postId not found');
      }
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
