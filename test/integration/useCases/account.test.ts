import { startServer, stopServer } from '../../../src/application/server/server';
import getAccount from '../../../src/core/useCases/getAccount';
import signup from '../../../src/core/useCases/signup';
import { AccountDAOMemory } from './fakes/AccountDAOFake';

let accountDAOMemory: AccountDAOMemory;

beforeEach(() => {
  accountDAOMemory = new AccountDAOMemory();
});

describe('Create account', () => {
  test('Should fail creation account when payload.name is invalid', async () => {
    const account = {
      name: 'a'
    };
  
    expect(() => signup(account, accountDAOMemory)).rejects.toThrow('Invalid name');
  });
  
  test('Should fail creation account when payload.email is invalid', async () => {
    const account = {
      name: 'fulano silva',
      email: 'a'
    };
  
    expect(() => signup(account, accountDAOMemory)).rejects.toThrow('Invalid email');
  });
  
  test('Should fail creation account when payload.cpf is invalid', async () => {
    const account = {
      name: 'fulano silva',
      email: 'fulano@gmail.com',
      cpf: '000.000.000-00'
    };
  
    expect(() => signup(account, accountDAOMemory)).rejects.toThrow('Invalid CPF');
  });
  
  test('Should fail creation account when account is driver and payload.carPlate is invalid', async () => {
    const account = {
      name: 'fulano silva',
      email: 'fulano@gmail.com',
      cpf: '959.600.920-69',
      carPlate: 'a',
      isDriver: true
    };
  
    expect(() => signup(account, accountDAOMemory)).rejects.toThrow('Invalid car plate');
  });
  
  test('Should fail creation account when account create account with email already registered', async () => {
    const account = {
      name: 'Fulano Silva',
      email: 'fulano2@gmail.com',
      cpf: '959.600.920-69',
      carPlate: 'GOW7799',
      password: '123',
      isPassenger: false,
      isDriver: true
    };  
  
    const creationData = await signup(account, accountDAOMemory);
    
    expect(creationData).toHaveProperty('accountId');
    expect(() => signup(account, accountDAOMemory)).rejects.toThrow('Duplicate account');
  });
  
  test('Should create account of driver', async () => {
    const account = {
      id: 'a4285a9a-b25c-4a14-a35b-499745432f38',
      name: 'Fulano Silva',
      email: 'fulano@gmail.com',
      cpf: '959.600.920-69',
      carPlate: 'GOW7799',
      password: '123',
      isPassenger: false,
      isDriver: true
    };
  
    const creationData = await signup(account, accountDAOMemory);
    
    expect(creationData).toHaveProperty('accountId', account.id);
  });
  
  test('Should create account of passenger', async () => {
    const account = {
      id: 'a4285a9a-b25c-4a14-a35b-499745432f38',
      name: 'Fulano Silva',
      email: 'fulano3@gmail.com',
      cpf: '959.600.920-69',
      carPlate: 'GOW7799',
      password: '123',
      isPassenger: true,
      isDriver: false
    };
  
    const creationData = await signup(account, accountDAOMemory);
    
    expect(creationData).toHaveProperty('accountId', account.id);
  });
});


describe('Get account', () => {
  test('Should get account', async () => {
    const account = {
      id: 'a4285a9a-b25c-4a14-a35b-499745432f38',
      name: 'Fulano Silva',
      email: 'fulano4@gmail.com',
      cpf: '959.600.920-69',
      carPlate: 'GOW7799',
      password: '123',
      isPassenger: false,
      isDriver: true
    };
  
    await signup(account, accountDAOMemory);
    const searchData = await getAccount(account.id, accountDAOMemory);
  
    expect(searchData).toEqual(account);
  });

  test('Should fail get account because not found acccount', async () => { 
    const accountID = '61b281b9-e7ec-42ab-8480-4c6f42163a5d';
    
    const searchData = await getAccount(accountID, accountDAOMemory);
  
    expect(searchData).toBeUndefined();
  });
});
