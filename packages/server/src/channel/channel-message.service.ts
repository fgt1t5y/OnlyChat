import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  And,
  LessThanOrEqual,
  MoreThanOrEqual,
  LessThan,
  MoreThan,
  Repository,
} from 'typeorm';
import { ChannelMessage } from './entities';

@Injectable()
export class ChannelMessageService {
  constructor(
    @InjectRepository(ChannelMessage)
    private readonly channelMessageRepository: Repository<ChannelMessage>,
  ) {}

  async findById(channelMessageId: number) {
    return await this.channelMessageRepository.findOne({
      relations: { author: true },
      where: {
        id: channelMessageId,
      },
    });
  }

  async findBy(channelId: number, authorId: number) {
    return await this.channelMessageRepository.findOne({
      relations: { author: true },
      where: {
        authorId,
        channelId,
      },
    });
  }

  async findBefore(
    channelId: number,
    before: number = 0,
    takeCount: number = 10,
  ): Promise<ChannelMessage[]> {
    return await this.channelMessageRepository.find({
      where: {
        id: LessThanOrEqual(before),
        channelId,
      },
      take: takeCount,
    });
  }

  async findAround(
    channelId: number,
    around: number = 0,
    takeCount: number = 10,
  ): Promise<ChannelMessage[]> {
    return await this.channelMessageRepository.find({
      where: {
        id: And(MoreThanOrEqual(around), LessThan(around)),
        channelId,
      },
      take: takeCount,
    });
  }

  async findAfter(
    channelId: number,
    after: number = 0,
    takeCount: number = 10,
  ): Promise<ChannelMessage[]> {
    return await this.channelMessageRepository.find({
      where: {
        id: MoreThan(after),
        channelId,
      },
      take: takeCount,
    });
  }

  async create(
    authorId: number,
    channelId: number,
    content: string,
  ): Promise<ChannelMessage> {
    return await this.channelMessageRepository.save({
      authorId,
      channelId,
      content,
    });
  }
}
