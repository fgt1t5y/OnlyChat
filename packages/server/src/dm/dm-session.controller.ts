import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DMSessionService } from './dm-session.service';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/types';
import { CloseDMSessionDto, OpenDMSessionDto } from './dm.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('dm-sessions')
export class DMSessionController {
  constructor(private readonly dmSessionService: DMSessionService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getDMSessions(@CurrentUser() user: JwtPayload) {
    return await this.dmSessionService.findAll(user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async openDMSession(
    @CurrentUser() user: JwtPayload,
    @Body() { userBId }: OpenDMSessionDto,
  ) {
    const dmSession = await this.dmSessionService.findBy(user.id, userBId);

    if (dmSession) {
      if (!dmSession.isOpen) {
        await this.dmSessionService.updateIsOpen(user.id, userBId, true);

        dmSession.isOpen = true;
      }

      return dmSession;
    } else {
      await this.dmSessionService.create(user.id, userBId);

      return await this.dmSessionService.findBy(user.id, userBId);
    }
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async closeDMSession(
    @CurrentUser() user: JwtPayload,
    @Body() { userBId }: CloseDMSessionDto,
  ) {
    const dmSession = await this.dmSessionService.findBy(user.id, userBId);

    if (dmSession) {
      if (dmSession.isOpen) {
        await this.dmSessionService.updateIsOpen(user.id, userBId, false);
      }
    }
  }
}
