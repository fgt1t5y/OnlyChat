import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DMMessage, DMSession } from './entities';
import { Repository } from 'typeorm';

@Injectable()
export class DMMessageService {
  constructor(
    @InjectRepository(DMMessage)
    private readonly dmMessageRepository: Repository<DMMessage>,
  ) {}

  async findById(dmMessageId: number) {
    return await this.dmMessageRepository.findOne({
      relations: { author: true },
      where: {
        id: dmMessageId,
      },
    });
  }

  async findBy(dmSessionId: number, authorId: number) {
    return await this.dmMessageRepository.findOne({
      relations: { author: true },
      where: {
        authorId: authorId,
        sessionId: dmSessionId,
      },
    });
  }

  async findPaging(
    dmSession: DMSession,
    after: number = 0,
    takeCount: number = 10,
  ): Promise<DMMessage[]> {
    return await this.dmMessageRepository
      .createQueryBuilder('dm_message')
      .leftJoinAndSelect('dm_message.author', 'author')
      .where('dm_message.id > :after AND dm_message.authorId = :userAId', {
        after,
        userAId: dmSession.userAId,
      })
      .orWhere('dm_message.authorId = :userBId', { userBId: dmSession.userBId })
      .orderBy('dm_message.id', 'ASC')
      .limit(takeCount)
      .getMany();
  }

  async create(
    dmSessionId: number,
    authorId: number,
    content: string,
  ): Promise<DMMessage> {
    const dmMessage = this.dmMessageRepository.create({
      authorId: authorId,
      sessionId: dmSessionId,
      content: content,
    });

    return await this.dmMessageRepository.save(dmMessage);
  }
}
