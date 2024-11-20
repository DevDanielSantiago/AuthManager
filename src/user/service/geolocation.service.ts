import { Injectable } from '@nestjs/common';

import axios from 'axios';

import { IPAddressDto } from 'src/dto';

@Injectable()
export class GeoLocationService {
  private readonly apiKey = process.env.IPSTACK_API_KEY;

  async getGeoLocation(ip: string): Promise<IPAddressDto | undefined> {
    try {
      const url = `http://api.ipstack.com/${ip}?access_key=${this.apiKey}`;
      const response = await axios.get<IPAddressDto>(url);
      return response.data;
    } catch {
      return undefined;
    }
  }
}
