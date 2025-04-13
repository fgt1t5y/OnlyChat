import { Module } from '@nestjs/common';
import { DmSessionService } from './dm-session.service';
import { DmSessionController } from './dm-session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DmMessage, DmSession } from './entities';

@Module({
  controllers: [DmSessionController],
  imports: [TypeOrmModule.forFeature([DmSession, DmMessage])],
  providers: [DmSessionService],
})
export class DmModule {}
