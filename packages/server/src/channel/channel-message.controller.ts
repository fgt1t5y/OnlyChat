import { Controller, Get, UseGuards, Query, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ChannelMessageService } from './channel-message.service';
import { GetChannelMessageDto } from './channel.dto';

@Controller('channel/:channelId/messages')
export class ChannelMessageController {
  constructor(private readonly channelMessageService: ChannelMessageService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getChannelMessages(
    @Query() { before, around, after, takeCount }: GetChannelMessageDto,
    @Param('channelId') channelId: number,
  ) {
    if (before) {
      return await this.channelMessageService.findBefore(
        channelId,
        before,
        takeCount,
      );
    }

    if (around) {
      return await this.channelMessageService.findAround(
        channelId,
        around,
        takeCount,
      );
    }

    if (after) {
      return await this.channelMessageService.findAfter(
        channelId,
        after,
        takeCount,
      );
    }

    return [];
  }
}
