import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CategoriesService {
  constructor(private dbService: DatabaseService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const newCategory = await this.dbService.category.create({
      data: {
        id: createCategoryDto.id,
        name: createCategoryDto.name,
      },
    });
    return {
      message: 'create category',
      newCategory,
    };
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
