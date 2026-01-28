import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[JwtModule.register({
          secret: 'SECRET_KEY',
          signOptions: { expiresIn: '1h' },
        }),],
  controllers: [UsersController],
  providers: [UserService],
})
export class UsersModule {}
