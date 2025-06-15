import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './entities';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
  ) {}

  async findAllByServerId(serverId: number): Promise<Channel[]> {
    return this.channelRepository.find({
      where: {
        serverId,
      },
    });
  }
}
