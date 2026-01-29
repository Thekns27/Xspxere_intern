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
  ParseFilePipe,
  MaxFileSizeValidator,
  Req,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/upload/upload.service';
import { createMulterConfig } from 'src/upload/multer.config';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetAllPost } from './dto/getAllpost.dto';


//@ApiTags('Post')
@ApiBearerAuth()
@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private uploadService: UploadService,
  ) {}

  @ApiOperation({ summary: 'Used to find all Post' })
  @ApiOkResponse({ description: 'Get all Post' })
  @ApiResponse({status: 201,description:'post findAll success',type: GetAllPost})
  
  @Get()
  @UseGuards(AuthGuard)
findAll(
  @Query() query: GetAllPost,
  @Req() req,
) {
  const authorId = req.user.id;
  console.log(authorId)
  return this.postService.findAll(authorId, query);
}


  @Get()
  findAll1(@Req() req, @Query() query: GetAllPost) {
    const authorId = +req.user.id;
    console.log(authorId);
    return this.postService.findAll(authorId,query);
  }

  @ApiOperation({ summary: 'used to find Post with id' })
  @Get(':id')
  // @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @ApiOperation({ summary: 'used to update Post with id' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @ApiOperation({ summary: 'used to delete Post with id' })
 @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') postId: string) {
    console.log(postId)
    return this.postService.delete(+postId);
  }

  @ApiOperation({ summary: 'Used to create a new post' })
  @ApiResponse({
    status: 201,
    description: 'Post created',
    type: CreatePostDto,
  })
  @ApiBadRequestResponse({ description: 'Bad payload sent' })
  @Post()

  //  @UseInterceptors(
  //   FilesInterceptor('post_images',5, {
  //     fileFilter: (req, file, cb) => {
  //console.log("profileImageUrl")
  //       if (!file.mimetype.match(/image\/(png|jpg|jpeg)/)) {
  //         return cb(
  //           new BadRequestException('Only JPG and PNG files are allowed'),
  //           false,
  //         );
  //       }
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
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FilesInterceptor(
      'post_images',
      2,
      createMulterConfig(2, ['png', 'jpg', 'jpeg', 'mp4']),
    ),
  )
  async create(
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
    console.log(profileImage, postDto);
    return this.postService.create(postDto, profileImage);
  }
}
