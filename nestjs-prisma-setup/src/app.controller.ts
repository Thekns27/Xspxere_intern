import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

   @Get('uploads/:filename')
  getUploadFile(@Param('filename') filename: string, @Res() res: Response) {
    console.log(`./upload/${filename}`);
    return res.sendFile(filename, { root: `./uploads` });
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
