import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { DMSessionService } from './dm-session.service';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/types';
import { CreateDMSessionDto } from './dm.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('dm/session')
export class DMSessionController {
  constructor(private readonly dmSessionService: DMSessionService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getFriends(@CurrentUser() user: JwtPayload) {
    return await this.dmSessionService.findAll(user.id);
  }

  @Post('open')
  @UseGuards(JwtAuthGuard)
  async openSession(
    @CurrentUser() user: JwtPayload,
    @Body() { userBId }: CreateDMSessionDto,
  ) {
    if (await this.dmSessionService.exist(user.id, userBId)) {
      await this.dmSessionService.updateIsOpen(user.id, userBId, true);
    } else {
      await this.dmSessionService.create(user.id, userBId);
    }
  }
}
