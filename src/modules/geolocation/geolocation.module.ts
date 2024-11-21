import { Module } from '@nestjs/common';
import { GeolocationService } from './service/geolocation.service';

@Module({
  providers: [GeolocationService],
  exports: [GeolocationService],
})
export class GeolocationModule {}
