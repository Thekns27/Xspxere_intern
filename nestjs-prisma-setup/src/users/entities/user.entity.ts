import { Post } from "src/post/entities/post.entity";
import { Profile } from "src/profile/entities/profile.entity";



export enum Roles {
  USER = 'User',
  ADMIN = 'Admin',
  EDITOR = 'Editor'
}

export class User {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
  roles : string[];
  profileId: number;
  profile: Profile;
  posts: Post[];
  referralUserId: number;
  referralUser: User;
}
