import { Controller, UseGuards, Get, Query, Post, Body } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/types';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { DMMessageService } from './dm-message.service';
import { CreateDMMessageDto, GetDMMessageDto } from './dm.dto';
import { DMSessionService } from './dm-session.service';
import { WsException } from '@nestjs/websockets';

@Controller('dm/message')
export class DMMessageController {
  constructor(
    private readonly dmSessionService: DMSessionService,
    private readonly dmMessageService: DMMessageService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getDMMessages(
    @CurrentUser() user: JwtPayload,
    @Query() { dmSessionId, before, around, after, takeCount }: GetDMMessageDto,
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
  async createDMMessage(
    @CurrentUser() user: JwtPayload,
    @Body() { dmSessionId, content }: CreateDMMessageDto,
  ) {
    if (!content.trim()) {
      throw new WsException('Content is required.');
    }

    return await this.dmMessageService.create(dmSessionId, user.id, content);
  }
}
