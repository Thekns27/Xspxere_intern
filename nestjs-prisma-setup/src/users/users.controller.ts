import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiBadRequestResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

   @ApiOperation({summary: 'Used to create a new User'})
    @ApiResponse({status: 201,description:'User created',type: CreateUserDto})
    @ApiBadRequestResponse({description:'Bad payload sent'})
  @Post()
  @UseInterceptors(
    FileInterceptor('profileImageUrl', {
      fileFilter: (req, file, cb) => {
        console.log('profileImageUrl');
        if (!file.mimetype.match(/image\/(png|jpg|jpeg)/)) {
          return cb(
            new BadRequestException('Only JPG and PNG files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          // new FileTypeValidator({ fileType: /image\/(png|jpg)/ }),
        ],
        fileIsRequired: true,
      }),
    )
    profileImage: Express.Multer.File,
  ) {
    console.log(profileImage, createUserDto);
    return this.usersService.create(createUserDto, profileImage);
  }


   @ApiOperation({summary: 'Used to find all User'})
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({summary: 'Used to find user with id'})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiOperation({summary: 'Used to update User with id'})
  @ApiResponse({status: 201,description:'User updated success',type: UpdateUserDto})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({summary: 'Used to delete User with id'})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
