import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [EventGateway],
  exports: [EventGateway],
})
export class EventModule {}
