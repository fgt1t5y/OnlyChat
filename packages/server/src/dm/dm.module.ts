import { Module } from '@nestjs/common';
import { DMSessionService } from './dm-session.service';
import { DMSessionController } from './dm-session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DMMessage, DMSession } from './entities';

@Module({
  controllers: [DMSessionController],
  imports: [TypeOrmModule.forFeature([DMSession, DMMessage])],
  providers: [DMSessionService],
})
export class DMModule {}
