import AccountController from '../../../src/application/controllers/AccountController';
import RideController from '../../../src/application/controllers/RideController';
import AccountDAODatabase from '../../../src/application/db/postgreSQL/AccountDAODatabase';
import RideDAODatabase from '../../../src/application/db/postgreSQL/RideDAODatabase';
import { ExpressAdapter } from '../../../src/application/http/express/ExpressAdapter';
import Server from '../../../src/application/http/Server';
import MailerGatewayMemory from '../../../src/application/services/MailerGatewayMemory';
import GetAccount from '../../../src/core/useCases/GetAccount';
import GetRide from '../../../src/core/useCases/GetRide';
import RequestRide from '../../../src/core/useCases/RequestRide';
import Singup from '../../../src/core/useCases/Singup';


let server: Server;

beforeAll(() => {
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
  server = new Server(httpServer);

  console.log('beforeAll')
  server.start();
});

afterAll(async () => {
  await server.stop();
});

describe('Create account - Test API', () => {
  test('Should fail creation account when payload.name is invalid', async () => {
    const creationResponse = await fetch('http://localhost:3000/singup', {
      method: 'POST',
      body: JSON.stringify({ name: 'a' }),
      headers: { "Content-Type": "application/json" },
    });
    
    const creationData = await creationResponse.json();

    expect(creationResponse.status).toBe(422);
    expect(creationData).toHaveProperty('message', 'Invalid name');
  });

  test('Should create account of driver', async () => {
    const account = {
      name: 'Fulano Silva',
      email: `fulano${Math.random()}@gmail.com`,
      cpf: '959.600.920-69',
      carPlate: 'GOW7799',
      password: '123',
      isPassenger: false,
      isDriver: true
    };

    const creationResponse = await fetch('http://localhost:3000/singup', {
      method: 'POST',
      body: JSON.stringify(account),
      headers: { "Content-Type": "application/json" },
    });
    const creationData = await creationResponse.json();

    expect(creationResponse.status).toBe(200);
    expect(creationData).toHaveProperty('accountId');
  });
});

describe('Get account - Test API', () => {
  test('Should get account', async () => {
    const account = {
      name: 'Fulano Silva',
      email: `fulano${Math.random()}@gmail.com`,
      cpf: '959.600.920-69',
      carPlate: 'GOW7799',
      password: '123',
      isPassenger: false,
      isDriver: true
    };

    const creationResponse = await fetch('http://localhost:3000/singup', {
      method: 'POST',
      body: JSON.stringify(account),
      headers: { "Content-Type": "application/json" },
    });
    const creationData = await creationResponse.json();

    const searchResponse = await fetch(`http://localhost:3000/accounts/${creationData.accountId}`);
    const searchData = await searchResponse.json();

    expect(creationResponse.status).toBe(200);
    expect(searchResponse.status).toBe(200);
    expect(creationData).toHaveProperty('accountId');
    expect(searchData).toEqual({
      accountId: creationData.accountId,
      name: account.name,
      email: account.email,
      cpf: account.cpf,
      password: account.password,
      carPlate: account.carPlate,
      isDriver: account.isDriver,
      isPassenger: account.isPassenger
    });
  });

  test('Should fail get account because not found acccount', async () => {
    const searchResponse = await fetch('http://localhost:3000/accounts/61b281b9-e7ec-42ab-8480-4c6f42163a5d');
    const searchData = await searchResponse.json();

    expect(searchResponse.status).toBe(404);
    expect(searchData).toEqual({ message: 'Account not found' });
  });
});
