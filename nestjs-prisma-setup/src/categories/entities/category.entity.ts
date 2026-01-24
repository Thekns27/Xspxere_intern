import { CategoriesOnPost } from 'src/categories-on-posts/entities/categories-on-post.entity';

export class Category {
  id: number;
  name: string;

  categoriesOnPosts?: CategoriesOnPost[];
}
