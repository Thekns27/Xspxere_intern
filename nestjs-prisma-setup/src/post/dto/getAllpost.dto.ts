import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetAllPost {
  @ApiProperty({ default: '1' })
  @Transform(({ value }) => Number(value))
  pageNumber: number;

  @ApiProperty({ default: '10' })
  @Transform(({ value }) => Number(value))
  pageSize: number;

  get skip() {
    return (this.pageNumber - 1) * this.pageSize;
  }
  get take() {
    return this.pageSize;
  }
}