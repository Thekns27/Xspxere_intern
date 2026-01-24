import { Category } from "src/categories/entities/category.entity";
import { Post } from "src/post/entities/post.entity";

export class CategoriesOnPost {
     id: number;

  postId: number;
  post?: Post;

  categoryId: number;
  category?: Category;

  createdAt: Date;
  updatedAt: Date;
}
