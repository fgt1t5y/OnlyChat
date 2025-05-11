import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Attachment } from './attachment.entity';
import { JwtPayload } from 'src/common/types';
import { CurrentUser } from 'src/common/decorators';

@Controller('attachment')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAttachment(
    @CurrentUser() user: JwtPayload,
    @Body() body: Partial<Attachment>,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Partial<Attachment>> {
    const attachment = {
      uploaderId: user.id,
      size: file.size,
      width: body.width,
      height: body.height,
      filename: file.originalname,
      contentType: file.mimetype,
      url: `http://localhost:3000/content/attachments/${file.filename}`,
    };

    await this.attachmentService.create(attachment);

    return attachment;
  }
}
