import { IsNotEmpty, IsNumber } from "class-validator";


export class CreateCategoryDto {

    @IsNumber()
    id :number;

    @IsNotEmpty()
    name : string
}
