import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriesOnPostDto } from './create-categories-on-post.dto';

export class UpdateCategoriesOnPostDto extends PartialType(CreateCategoriesOnPostDto) {}
