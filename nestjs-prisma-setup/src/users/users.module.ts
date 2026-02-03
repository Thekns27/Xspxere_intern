import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { BullService } from 'src/bull/bull.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[JwtModule.register({
          secret: 'SECRET_KEY',
          signOptions: { expiresIn: '1h' },
        })],
  controllers: [UsersController],
  providers: [UserService],
})
export class UsersModule {}
