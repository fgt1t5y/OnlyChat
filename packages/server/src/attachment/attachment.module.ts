import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttachmentService } from './attachment.service';
import { AttachmentController } from './attachment.controller';
import { Attachment } from './attachment.entity';

@Module({
  controllers: [AttachmentController],
  imports: [TypeOrmModule.forFeature([Attachment])],
  providers: [AttachmentService],
})
export class AttachmentModule {}
