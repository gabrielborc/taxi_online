import { pgp } from '../db/postgreSQL/db';

export default class Server {
  constructor(readonly httpServer: HttpServer) {}

  start() {
    const PORT: any = process.env.PORT || 3000;
    this.httpServer.listen(PORT);
  }

  async stop() {
    return new Promise((resolve, reject) => {
      this.httpServer.close((err: any) => {
        if (err) {
          reject(err);
        } else {
          pgp.end();
          resolve(0);
        }
      });  
    });
  }
}

export interface HttpServer {
  register(method: string, url: string, callback: Function): void;
  listen(port: number): void;
  close(callback: Function): void;
}