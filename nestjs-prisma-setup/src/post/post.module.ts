import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports : [
        JwtModule.register({
          secret: 'SECRET_KEY',
          signOptions: { expiresIn: '1h' },
        }),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
