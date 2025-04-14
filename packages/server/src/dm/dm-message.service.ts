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

  async findPaging(
    dmSession: DMSession,
    after: number = 0,
    takeCount: number = 10,
  ): Promise<DMMessage[]> {
    if (!dmSession) {
      return [];
    }

    return await this.dmMessageRepository
      .createQueryBuilder('dm_message')
      .leftJoinAndSelect('dm_message.author', 'author')
      .where('id > :after', { after })
      .where('authorId = :userAId', { userAId: dmSession.userAId })
      .orWhere('authorId = :userBId', { userBId: dmSession.userBId })
      .limit(takeCount)
      .getMany();
  }
}
