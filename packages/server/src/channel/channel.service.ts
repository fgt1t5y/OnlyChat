import { Injectable } from '@nestjs/common';
import { Channel } from './entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
  ) {}

  async findAllByServerId(serverId: number): Promise<Channel[]> {
    return this.channelRepository.find({
      relations: {
        group: true,
      },
      where: {
        serverId,
      },
    });
  }
}
