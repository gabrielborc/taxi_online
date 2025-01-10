import sinon from 'sinon';
import Singup from '../../../src/core/useCases/Singup';
import AccountDAOMemory from '../../../src/application/db/memory/AccountDAOMemory';
import MailerGatewayMemory from '../../../src/application/services/MailerGatewayMemory';

let accountDAOMemory: AccountDAOMemory;
let mailerGatewayMemory: MailerGatewayMemory;
let singup: Singup;

beforeEach(() => {
  accountDAOMemory = new AccountDAOMemory();
  mailerGatewayMemory = new MailerGatewayMemory();
  singup = new Singup(accountDAOMemory, mailerGatewayMemory);
});

describe('Create account', () => {
  test('Should fail creation account when payload.name is invalid', () => {
    const account = {
      name: 'a'
    };
  
    expect(() => singup.execute(account)).rejects.toThrow('Invalid name');
  });
  
  test('Should fail creation account when payload.email is invalid', () => {
    const account = {
      name: 'fulano silva',
      email: 'a'
    };
  
    expect(() => singup.execute(account)).rejects.toThrow('Invalid email');
  });
  
  test('Should fail creation account when payload.cpf is invalid', () => {
    const account = {
      name: 'fulano silva',
      email: 'fulano@gmail.com',
      cpf: '000.000.000-00'
    };
  
    expect(() => singup.execute(account)).rejects.toThrow('Invalid CPF');
  });
  
  test('Should fail creation account when account is driver and payload.carPlate is invalid', () => {
    const account = {
      name: 'fulano silva',
      email: 'fulano@gmail.com',
      cpf: '959.600.920-69',
      carPlate: 'a',
      isDriver: true
    };
  
    expect(() => singup.execute(account)).rejects.toThrow('Invalid car plate');
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
  
    const creationData = await singup.execute(account);
    
    expect(creationData).toHaveProperty('accountId');
    expect(() => singup.execute(account)).rejects.toThrow('Duplicate account');
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
  
    const creationData = await singup.execute(account);
    
    expect(creationData).toHaveProperty('accountId');
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
  
    const creationData = await singup.execute(account);
    
    expect(creationData).toHaveProperty('accountId');
  });
});


describe('Create account - Test Doubles', () => {
  test('Should create account of passenger with stub', async () => {
    const mailerStub = sinon.stub(MailerGatewayMemory.prototype, 'send').resolves();
    const accountDAOStub1 = sinon.stub(AccountDAOMemory.prototype, 'findAccountByEmail').resolves();
    const accountDAOStub2 = sinon.stub(AccountDAOMemory.prototype, 'saveAccount').resolves();
    
    const account = {
      name: 'Fulano Silva',
      email: 'fulano3@gmail.com',
      cpf: '959.600.920-69',
      carPlate: 'GOW7799',
      password: '123',
      isPassenger: true,
      isDriver: false
    };
    
    const creationData = await singup.execute(account);
    
    expect(creationData).toHaveProperty('accountId');

    mailerStub.restore();
    accountDAOStub1.restore();
    accountDAOStub2.restore();
  });

  test('Should create account of passenger with spy', async () => {
    const mailerSpy = sinon.stub(MailerGatewayMemory.prototype, 'send');
    
    const account = {
      name: 'Fulano Silva',
      email: 'fulano3@gmail.com',
      cpf: '959.600.920-69',
      carPlate: 'GOW7799',
      password: '123',
      isPassenger: true,
      isDriver: false
    };
    
    const creationData = await singup.execute(account);
    
    expect(creationData).toHaveProperty('accountId');
    expect(mailerSpy.calledOnce).toBeTruthy();
    expect(mailerSpy.calledWith(account.email, 'Welcome', '...')).toBeTruthy();

    mailerSpy.restore();
  });

  test('Should create account of passenger with mock', async () => {
    const mailerMock = sinon.mock(MailerGatewayMemory.prototype);
    
    const account = {
      name: 'Fulano Silva',
      email: 'fulano3@gmail.com',
      cpf: '959.600.920-69',
      carPlate: 'GOW7799',
      password: '123',
      isPassenger: true,
      isDriver: false
    };

    mailerMock.expects('send').withArgs(account.email, 'Welcome', '...').once().callsFake(() => {
      console.log('abc')
    });
    
    const creationData = await singup.execute(account);
    
    expect(creationData).toHaveProperty('accountId');
    
    mailerMock.verify();
    mailerMock.restore();
  });
});