import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, BadRequestException, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('users')

export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  //  @UseInterceptors(
  //   FileInterceptor('profileImage', {
  //     fileFilter: (req, file, cb) => {
  //       // if (!file.mimetype.match(/image\/(PNG|JPG)/)) {
  //       //   return cb(
  //       //     new BadRequestException('Only JPG and PNG files are allowed'),
  //       //     false,
  //       //   );
  //       // }
  //       cb(null, true);
  //     },
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename: (req, file, cb) => {
  //         const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         cb(null, uniqueName + extname(file.originalname));
  //       },
  //     }),
  //   }),
  // )
  create(
    @Body() createUserDto: CreateUserDto
    // @UploadedFile(
    //   new ParseFilePipe({
    //     validators: [
    //       new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
    //       // new FileTypeValidator({ fileType: /image\/(png|jpg)/ }),
    //     ],
    //     fileIsRequired: true,
    //   }),
    // )
    // profileImage: Express.Multer.File,
  ) {
   // console.log(profileImage,createUserDto)
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}