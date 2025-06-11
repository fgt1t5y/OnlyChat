import { Module } from '@nestjs/common';
import { EventModule } from 'src/event/event.module';
import { DMSessionService } from './dm-session.service';
import { DMSessionController } from './dm-session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DMMessage, DMSession } from './entities';
import { DMMessageController } from './dm-message.controller';
import { DMMessageService } from './dm-message.service';

@Module({
  controllers: [DMSessionController, DMMessageController],
  imports: [TypeOrmModule.forFeature([DMSession, DMMessage]), EventModule],
  providers: [DMSessionService, DMMessageService],
  exports: [DMSessionService, DMMessageService],
})
export class DMModule {}
