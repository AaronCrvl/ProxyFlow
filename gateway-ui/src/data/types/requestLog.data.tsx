export type RequestLog = {
  id: number;
  body: string;
  responseStatusCode: number;
  responseBody: string;
  headers: string;
  method: string;
  timestamp: string;
  url: string;
  clientIp: string;
  serviceOrigin: number;
};