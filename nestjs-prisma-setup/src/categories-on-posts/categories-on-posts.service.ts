import { Injectable } from '@nestjs/common';
import { CreateCategoriesOnPostDto } from './dto/create-categories-on-post.dto';
import { UpdateCategoriesOnPostDto } from './dto/update-categories-on-post.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CategoriesOnPostsService {
  constructor(private dbService: DatabaseService) {}
  async create(dto: CreateCategoriesOnPostDto) {
    const newCOP = await this.dbService.categoriesOnPosts.create({
      data: {
        id: dto.id,
        postId: dto.postId,
        categoryId: dto.categoryId,
      },
      select: {
        id: true,
        postId: true,
        categoryId: true,
      },
    });
    return {
      message: 'create success',
      newCOP,
    };
  }
  findAll() {
    return `This action returns all categoriesOnPosts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoriesOnPost`;
  }

  update(id: number, updateCategoriesOnPostDto: UpdateCategoriesOnPostDto) {
    return `This action updates a #${id} categoriesOnPost`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoriesOnPost`;
  }
}
