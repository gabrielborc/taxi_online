import { startServer, stopServer } from '../../../src/application/server/server';

beforeAll(() => {
  startServer();
});

afterAll(async () => {
  await stopServer();
});

describe('Create account - Test API', () => {
  test('Should fail creation account when payload.name is invalid', async () => {
    const creationResponse = await fetch('http://localhost:3000/signup', {
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
      email: 'fulano@gmail.com',
      cpf: '959.600.920-69',
      carPlate: 'GOW7799',
      password: '123',
      isPassenger: false,
      isDriver: true
    };
  
    const creationResponse = await fetch('http://localhost:3000/signup', {
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
      email: 'fulano4@gmail.com',
      cpf: '959.600.920-69',
      carPlate: 'GOW7799',
      password: '123',
      isPassenger: false,
      isDriver: true
    };
  
    const creationResponse = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      body: JSON.stringify(account),
      headers: { "Content-Type": "application/json" },
    });
    const creationData = await creationResponse.json();
  
    const searchResponse = await fetch(`http://localhost:3000/account/${creationData.accountId}`);
    const searchData = await searchResponse.json();
  
    expect(creationResponse.status).toBe(200);
    expect(searchResponse.status).toBe(200);
    expect(creationData).toHaveProperty('accountId');
    expect(searchData).toEqual({
      account_id: creationData.accountId,
      name: account.name,
      email: account.email,
      cpf: account.cpf,
      password: account.password,
      car_plate: account.carPlate,
      is_driver: account.isDriver,
      is_passenger: account.isPassenger
    });
  });

  test('Should fail get account because not found acccount', async () => { 
    const searchResponse = await fetch('http://localhost:3000/account/61b281b9-e7ec-42ab-8480-4c6f42163a5d');
    const searchData = await searchResponse.json();
  
    expect(searchResponse.status).toBe(404);
    expect(searchData).toEqual({ message: 'Account not found' });
  });
});
