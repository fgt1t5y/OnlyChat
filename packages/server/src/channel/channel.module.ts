import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities';

@Module({
  controllers: [ChannelController],
  imports: [TypeOrmModule.forFeature([Channel])],
  providers: [ChannelService],
})
export class ChannelModule {}
