import { Injectable } from '@nestjs/common';

import axios from 'axios';

import { IPAddressDto } from 'src/common/dto';

@Injectable()
export class GeolocationService {
  private readonly apiKey = process.env.IPSTACK_API_KEY;

  private async getGeoLocation(ip: string): Promise<IPAddressDto> {
    const url = `http://api.ipstack.com/${ip}?access_key=${this.apiKey}`;
    const response = await axios.get<IPAddressDto>(url);
    return response.data;
  }

  async handleLocation(ip: string): Promise<string> {
    try {
      const geoLocation = await this.getGeoLocation(ip);
      return `${geoLocation.city} / ${geoLocation.region_name} - ${geoLocation.country_name}`;
    } catch {
      return undefined;
    }
  }
}
