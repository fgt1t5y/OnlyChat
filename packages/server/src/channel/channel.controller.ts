import { Controller, Get, Query } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { GetServerChannelsDto } from './channel.dto';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get()
  async getChannels(@Query() query: GetServerChannelsDto) {
    return this.channelService.findAllByServerId(query.serverId);
  }
}
