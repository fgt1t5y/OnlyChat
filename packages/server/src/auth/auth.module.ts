import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: 'afsde5ye5fas4y7edg6hy',
      signOptions: { expiresIn: '2d' },
    }),
  ],
  providers: [AuthService],
})
export class AuthModule {}
