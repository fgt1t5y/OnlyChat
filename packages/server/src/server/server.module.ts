import { Module } from '@nestjs/common';
import { ServerService } from './server.service';
import { ServerController } from './server.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from './server.entity';

@Module({
  controllers: [ServerController],
  imports: [TypeOrmModule.forFeature([Server])],
  providers: [ServerService],
})
export class ServerModule {}
