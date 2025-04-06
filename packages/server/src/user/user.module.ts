import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Role } from 'src/role/role.entity';

@Module({
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [UserService],
})
export class UserModule {}
