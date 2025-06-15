import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelController } from './channel.controller';
import { ChannelMessageController } from './channel-message.controller';
import { ChannelMessageService } from './channel-message.service';
import { ChannelService } from './channel.service';
import { Channel, ChannelMessage } from './entities';

@Module({
  controllers: [ChannelController, ChannelMessageController],
  imports: [TypeOrmModule.forFeature([Channel, ChannelMessage])],
  providers: [ChannelService, ChannelMessageService],
})
export class ChannelModule {}
