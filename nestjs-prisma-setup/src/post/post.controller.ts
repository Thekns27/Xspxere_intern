import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // @Post()
  // create(@Body() createPostDto: CreatePostDto) {
  //   return this.postService.create(createPostDto);
  // }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
 // @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  delete(@Param('id') postId: string) {
    return this.postService.delete(+postId);
  }

//   @Post()
// @UseInterceptors(FilesInterceptor('images'))
// async create(
//   @Body() createPostDto: CreatePostDto,
//   @UploadedFiles() files: Array<Express.Multer.File>
// ) {
//   return this.postService.create(createPostDto,files);
// }
 @Post()
   @UseInterceptors(
    FilesInterceptor('post_images',20, {
      fileFilter: (req, file, cb) => {
        //console.log("profileImageUrl")
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
    @Body() postDto: CreatePostDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          // new FileTypeValidator({ fileType:/(image\/jpeg|image\/png|image\/jpg)/}),// /image\/(png|jpg|jpeg)/
        ],
        fileIsRequired: true,
      }),
    )
    profileImage: Express.Multer.File[],
  ) {
   console.log(profileImage,postDto)
    return this.postService.create(postDto,profileImage);
  }
}
