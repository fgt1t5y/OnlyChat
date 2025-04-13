import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  controllers: [UserController],
  imports: [
    TypeOrmModule.forFeature([User]),
    MulterModule.register({
      storage: diskStorage({
        destination: './../../data/avatars',
        filename(req, file, callback) {
          const ext = file.originalname.split('.');

          return callback(null, `${Date.now()}.${ext[ext.length - 1]}`);
        },
      }),
    }),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
