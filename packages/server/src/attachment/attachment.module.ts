import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttachmentService } from './attachment.service';
import { AttachmentController } from './attachment.controller';
import { Attachment } from './attachment.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  controllers: [AttachmentController],
  imports: [
    TypeOrmModule.forFeature([Attachment]),
    MulterModule.register({
      storage: diskStorage({
        destination: './../../data/attachments',
        filename(req, file, callback) {
          const splitted = file.originalname.split('.');

          return callback(
            null,
            `${Date.now()}.${splitted[splitted.length - 1]}`,
          );
        },
      }),
    }),
  ],
  providers: [AttachmentService],
})
export class AttachmentModule {}
