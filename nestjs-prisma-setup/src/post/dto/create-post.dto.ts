import { Transform } from 'class-transformer';

import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class  CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  authorId: number;

  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isPublished: boolean;

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((id) => Number(id));
    }
    if (Array.isArray(value)) {
      return value.map((id) => Number(id));
    }
    return value;
  })
  categoriesIds?: number[];

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((id) => Number(id));
    }
    if (Array.isArray(value)) {
      return value.map((id) => Number(id));
    }
    return value;
  })
  tagUsersIds?: number[];
}
