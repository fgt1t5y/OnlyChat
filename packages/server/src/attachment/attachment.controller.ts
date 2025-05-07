import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AttachmentService } from './attachment.service';

@Controller('attachment')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  // @Post()
  // create(@Body() createAttachmentDto: CreateAttachmentDto) {
  //   return this.attachmentService.create(createAttachmentDto);
  // }

  // @Get()
  // findAll() {
  //   return this.attachmentService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.attachmentService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAttachmentDto: UpdateAttachmentDto) {
  //   return this.attachmentService.update(+id, updateAttachmentDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.attachmentService.remove(+id);
  // }
}
