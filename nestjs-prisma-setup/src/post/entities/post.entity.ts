import { CategoriesOnPost } from 'src/categories-on-posts/entities/categories-on-post.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { User } from 'src/users/entities/user.entity';

export class Post {
  id: number;
  title: string;
  isPublished: boolean;

  authorId: number;
  author?: User[];

  tags?: Tag[];
  categoriesOnPosts?: CategoriesOnPost[];

  createdAt: Date;
  updatedAt: Date;
}
