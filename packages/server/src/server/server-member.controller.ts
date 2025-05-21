import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ServerMemberService } from './server-member.service';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/types';
import { ServerService } from './server.service';

@Controller('server/:serverId/members')
export class ServerMemberController {
  constructor(
    private readonly serverService: ServerService,
    private readonly serverMemberService: ServerMemberService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getServerMembers(
    @CurrentUser() user: JwtPayload,
    @Param('serverId') serverId: number,
  ) {
    const server = await this.serverService.findById(serverId);

    if (!server) {
      throw new NotFoundException('Server not found');
    }

    if (server.creatorId !== user.id) {
      throw new BadRequestException('You are not the creator of this server');
    }

    return await this.serverMemberService.findAll(serverId);
  }
}
