import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/types';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { DMMessageService } from './dm-message.service';
import { GetDMMessageDto } from './dm.dto';
import { DMSessionService } from './dm-session.service';

@Controller('dm/message')
export class DMMessageController {
  constructor(
    private readonly dmSessionService: DMSessionService,
    private readonly dmMessageService: DMMessageService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getSomeDMMessage(
    @CurrentUser() user: JwtPayload,
    @Query() { dmSessionId, after, takeCount }: GetDMMessageDto,
  ) {
    const dmSession = await this.dmSessionService.findOne(dmSessionId);

    if (user.id !== dmSession.userAId) {
      return [];
    }

    return await this.dmMessageService.findPaging(dmSession, after, takeCount);
  }
}
