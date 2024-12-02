import express from 'express';
import { getAccountRequest, signupRequest } from '../../controllers/account';
import { getRideRequest, createRideRequest } from '../../controllers/ride';

const routes = express.Router();

const handleRequest = (fn: any) => (req: express.Request, res: express.Response, next: express.NextFunction ) =>  {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/*Account*/
routes.get('/account/:accountID', handleRequest(getAccountRequest));
routes.post('/signup', handleRequest(signupRequest));

/*Ride*/
routes.get('/ride/:rideID', handleRequest(getRideRequest));
routes.post('/ride', handleRequest(createRideRequest));

export default routes;