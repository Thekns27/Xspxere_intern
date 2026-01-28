import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}


   @ApiOperation({ summary: 'Used to create a new Category' })
    @ApiResponse({
      status: 201,
      description: 'Category created',
      type: CreateCategoryDto,
    })
    @ApiBadRequestResponse({ description: 'Bad payload sent' })
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  //   @ApiOperation({ summary: 'Used to find all Categories' })
  //   @ApiOkResponse({ description: 'Get all Categories' })
  // @Get()
  // findAll() {
  //   return this.categoriesService.findAll();
  // }


  
  //   @ApiOperation({ summary: 'Used to find Categories with id' })
  //   @ApiOkResponse({ description: 'Get Categories with id' })
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.categoriesService.findOne(+id);
  // }

  
  //   @ApiOperation({ summary: 'Used to update Categories with id' })
  //   @ApiOkResponse({ description: 'update Categories ' })
  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCategoryDto: UpdateCategoryDto,
  // ) {
  //   return this.categoriesService.update(+id, updateCategoryDto);
  // }

  //   @ApiOperation({ summary: 'Used to delete Categories with id' })
  //   @ApiOkResponse({ description: 'Delete Categories with id' })
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.categoriesService.remove(+id);
  // }
}
