import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriesOnPostsService } from './categories-on-posts.service';
import { CreateCategoriesOnPostDto } from './dto/create-categories-on-post.dto';
import { UpdateCategoriesOnPostDto } from './dto/update-categories-on-post.dto';

@Controller('categories-on-posts')
export class CategoriesOnPostsController {
  constructor(
    private readonly categoriesOnPostsService: CategoriesOnPostsService,
  ) {}

  @Post()
  create(@Body() createCategoriesOnPostDto: CreateCategoriesOnPostDto) {
    return this.categoriesOnPostsService.create(createCategoriesOnPostDto);
  }

  @Get()
  findAll() {
    return this.categoriesOnPostsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesOnPostsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoriesOnPostDto: UpdateCategoriesOnPostDto,
  ) {
    return this.categoriesOnPostsService.update(+id, updateCategoriesOnPostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesOnPostsService.remove(+id);
  }
}
