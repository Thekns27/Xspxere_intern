import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";


export class CreateCategoryDto {

    @IsNumber()
     @ApiProperty({
        description: 'id number',
        example: '1',
      })
    id :number;

    @IsNotEmpty()
     @ApiProperty({
    description: 'The name of the category',
    example: 'apple',
  })
    name : string
}
