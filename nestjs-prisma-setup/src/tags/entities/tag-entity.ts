import { Post } from "src/post/entities/post.entity";
import { User } from "src/users/entities/user.entity";


export class Tag {
    id: number;

  postId: number;
  post?: Post;

  userId: number;
  user?: User;

  createdAt: Date;
  updatedAt: Date;
}
