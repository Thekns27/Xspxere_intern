import { Module } from '@nestjs/common';
import { CategoriesOnPostsService } from './categories-on-posts.service';
import { CategoriesOnPostsController } from './categories-on-posts.controller';

@Module({
  controllers: [CategoriesOnPostsController],
  providers: [CategoriesOnPostsService],
})
export class CategoriesOnPostsModule {}
