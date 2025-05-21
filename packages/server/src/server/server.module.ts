import { Module } from '@nestjs/common';
import { ServerService } from './server.service';
import { ServerController } from './server.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerMemberController } from './server-member.controller';
import { ServerMemberService } from './server-member.service';
import { Server, ServerMember, ServerRole } from './entities';

@Module({
  controllers: [ServerController, ServerMemberController],
  imports: [TypeOrmModule.forFeature([Server, ServerMember, ServerRole])],
  providers: [ServerService, ServerMemberService],
})
export class ServerModule {}
