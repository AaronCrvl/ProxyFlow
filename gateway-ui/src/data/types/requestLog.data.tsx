export type RequestLog = {
  id: number;
  body: string;
  statusCode: number;
  headers: string;
  method: string;
  timestamp: string;
  url:string;
  serviceOrigin : number;
};  