import { Module } from '@nestjs/common';
import { GatewaysService } from './gateways.service';
import { NotiGateways } from './noti.gateway';

@Module({
  providers: [NotiGateways, GatewaysService],
  exports: [NotiGateways],
})
export class GatewaysModule {}