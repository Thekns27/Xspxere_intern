import { IsInt } from 'class-validator';

export class CreateTagDto {
  @IsInt()
  postId: number;

  @IsInt()
  userId: number;
}
