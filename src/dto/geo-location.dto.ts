type LocationData = {
  geoname_id: number;
  capital: string;
  languages: {
    code: string;
    name: string;
    native: string;
  }[];
  country_flag: string;
  country_flag_emoji: string;
  country_flag_emoji_unicode: string;
  calling_code: string;
  is_eu: boolean;
};

export type IPAddressDto = {
  ip: string;
  type: 'ipv4' | 'ipv6';
  continent_code: string;
  continent_name: string;
  country_code: string;
  country_name: string;
  region_code: string;
  region_name: string;
  city: string;
  zip: string | null;
  latitude: number;
  longitude: number;
  msa: string | null;
  dma: string | null;
  radius: string;
  ip_routing_type: string | null;
  connection_type: string | null;
  location: LocationData;
};
