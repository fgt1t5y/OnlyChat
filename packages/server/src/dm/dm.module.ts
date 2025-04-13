import { Module } from '@nestjs/common';
import { DmService } from './dm.service';
import { DmController } from './dm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DmMessage, DmSession } from './entities';

@Module({
  controllers: [DmController],
  imports: [TypeOrmModule.forFeature([DmSession, DmMessage])],
  providers: [DmService],
})
export class DmModule {}
