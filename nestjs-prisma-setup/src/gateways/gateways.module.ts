import { Module } from '@nestjs/common';
import { NotiGateways } from './noti.gateway';

@Module({
  providers: [NotiGateways],
  exports: [NotiGateways],
})
export class GatewaysModule {}
