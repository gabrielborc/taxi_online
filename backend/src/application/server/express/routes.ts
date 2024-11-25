import express from 'express';
import { getAccountRequest, signupRequest } from '../../controllers/account';

const routes = express.Router();

/*Account*/
routes.get('/account/:accountID', getAccountRequest);
routes.post('/signup', signupRequest);

export default routes;