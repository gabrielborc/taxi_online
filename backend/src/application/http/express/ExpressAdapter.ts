import cors from 'cors';
import express, { Request, Response } from 'express';
import { HttpServer } from '../Server';
import { handleError } from './handleError';

export class ExpressAdapter implements HttpServer {
  app: any;

  constructor() {
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());
  }

  register(method: string, url: string, callback: Function): void {
    this.app[method](url, async (req: Request, res: Response) => {
      try {
        const output = await callback(req, res);
        return res.json(output);
      } catch (error) {
        return handleError(error, res);
      }
    });
  }

  listen(port: number): void {
    this.app.listen(port, () => console.log(`Server running on port ${port}`));
  }

  close(callback: Function): void {
    if (this.app.close) {
      this.app.close(callback);
    }
    callback();
  }
}