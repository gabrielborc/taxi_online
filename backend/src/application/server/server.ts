import http from 'http';
import { pgp } from '../db/postgreSQL/db';
import createAppExpress from './express/createAppExpress';

let server: http.Server;

export function startServer() {
  const PORT = process.env.PORT || 3000;
  const app = createAppExpress();
  
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export function stopServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (server) {
      server.close((err) => {
        if (err) {
          reject(err);
        } else {
          pgp.end();
          resolve();
        }
      });
    } else {
      pgp.end();
      resolve();
    }    
  });
}

process.on('uncaughtException', (err) => console.log(err));
process.on('unhandledRejection', (err) => console.log(err));