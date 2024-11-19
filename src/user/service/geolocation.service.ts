import { Injectable } from '@nestjs/common';

import axios from 'axios';

@Injectable()
export class GeoLocationService {
  private readonly apiKey = process.env.IPSTACK_API_KEY;

  async getGeoLocation(ip: string) {
    const url = `http://api.ipstack.com/${ip}?access_key=${this.apiKey}`;
    const response = await axios.get(url);
    return response.data;
  }
}
