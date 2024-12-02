import cors from 'cors';
import express from 'express';
import routes from './routes';
import { handleError } from './handleError';

export default function createAppExpress() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(routes);
  app.use(handleError);

  return app;
}