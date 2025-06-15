import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ChannelService } from './channel.service';
import { GetServerChannelsDto } from './channel.dto';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getChannels(@Query() query: GetServerChannelsDto) {
    return this.channelService.findAllByServerId(query.serverId);
  }
}
