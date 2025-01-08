import Server from './application/http/Server';
import AccountController from './application/controllers/AccountController';
import RideController from './application/controllers/RideController';
import GetAccount from './core/useCases/GetAccount';
import Singup from './core/useCases/Singup';
import GetRide from './core/useCases/GetRide';
import RequestRide from './core/useCases/RequestRide';
import AccountDAODatabase from './application/db/postgreSQL/AccountDAODatabase';
import RideDAODatabase from './application/db/postgreSQL/RideDAODatabase';
import { ExpressAdapter } from './application/http/express/ExpressAdapter';
import MailerGatewayMemory from './application/services/MailerGatewayMemory';

const accountDAO = new AccountDAODatabase();
const rideDAO = new RideDAODatabase();
const mailerGateway = new MailerGatewayMemory();

const getAccount = new GetAccount(accountDAO);
const singup = new Singup(accountDAO, mailerGateway)
const getRide = new GetRide(rideDAO);
const requestRide = new RequestRide(accountDAO, rideDAO);

const httpServer = new ExpressAdapter();
new AccountController(httpServer, getAccount, singup);
new RideController(httpServer, getRide, requestRide);
const server = new Server(httpServer);

server.start();

process.on('uncaughtException', (err) => console.log(err));
process.on('unhandledRejection', (err) => console.log(err));