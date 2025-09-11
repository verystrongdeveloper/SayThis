
export interface Place {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  countryCode: string;
}

export interface Phrase {
  original?: string;
  pronunciation?: string;
  korean: string;
}
