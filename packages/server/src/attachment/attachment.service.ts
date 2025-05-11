import { Injectable } from '@nestjs/common';
import { Attachment } from './attachment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AttachmentService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
  ) {}

  async create(attachment: Partial<Attachment>) {
    await this.attachmentRepository.save(attachment);
  }
}
