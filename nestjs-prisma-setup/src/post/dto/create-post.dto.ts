import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the title',
    example: 'title One',
  })
  title: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ example: '1' })
  authorId: number;

  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @ApiProperty({ example: true })
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
  @ApiProperty({ example: '[1,2]' })
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
  @ApiProperty({ example: '[1]' })
  tagUsersIds?: number[];
}
