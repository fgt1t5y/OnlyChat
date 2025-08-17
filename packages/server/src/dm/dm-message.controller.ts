import {
  Controller,
  UseGuards,
  Get,
  Query,
  Post,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/types';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { EventGateway } from 'src/event/event.gateway';
import { DMMessageService } from './dm-message.service';
import { DMSessionService } from './dm-session.service';
import { CreateDMMessageDto, GetDMMessageDto } from './dm.dto';

@Controller('dm/:dmSessionId/messages')
export class DMMessageController {
  constructor(
    private readonly eventGateway: EventGateway,
    private readonly dmSessionService: DMSessionService,
    private readonly dmMessageService: DMMessageService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getDMMessages(
    @CurrentUser() user: JwtPayload,
    @Query() { before, around, after, takeCount }: GetDMMessageDto,
    @Param('dmSessionId') dmSessionId: number,
  ) {
    const dmSessionB = await this.dmSessionService.findById(dmSessionId);
    const dmSessionA = await this.dmSessionService.findBy(
      dmSessionB.userBId,
      user.id,
    );

    if (user.id !== dmSessionB.userAId) {
      return [];
    }

    if (before) {
      return await this.dmMessageService.findBefore(
        dmSessionA,
        dmSessionB,
        before,
        takeCount,
      );
    }

    if (around) {
      return await this.dmMessageService.findAround(
        dmSessionA,
        dmSessionB,
        around,
        takeCount,
      );
    }

    if (after) {
      return await this.dmMessageService.findAfter(
        dmSessionA,
        dmSessionB,
        after,
        takeCount,
      );
    }

    return [];
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async sendDMMessage(
    @CurrentUser() user: JwtPayload,
    @Body() { content }: CreateDMMessageDto,
    @Param('dmSessionId') dmSessionId: number,
  ) {
    if (!content.trim()) {
      throw new BadRequestException('Content is required.');
    }

    const dmSession = await this.dmSessionService.findById(dmSessionId);

    const newDMMessage = await this.dmMessageService.create(
      user.id,
      dmSessionId,
      content,
    );

    const dmMessage = await this.dmMessageService.findById(newDMMessage.id);

    await this.dmSessionService.updateLastMessageId(
      user.id,
      dmSession.userBId,
      dmMessage.id,
    );

    this.eventGateway.broadcastToUser(
      dmSession.userBId,
      'dm_message.received',
      dmMessage,
    );

    return dmMessage;
  }
}
