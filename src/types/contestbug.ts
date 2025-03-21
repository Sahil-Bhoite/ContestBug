
export interface Contestbug {
  id: string;
  platform: string;
  name: string;
  startTime: string;
  duration: string;
  url: string;
  rating?: number;
  rank?: string;
  contests?: number;
  solved?: number;
}
