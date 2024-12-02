import sinon from 'sinon';
import signup from '../../../src/core/useCases/signup';
import AccountDAOMemory from '../../../src/application/db/memory/AccountDAOMemory';
import MailerGatewayMemory from '../../../src/application/services/MailerGatewayMemory';

let accountDAOMemory: AccountDAOMemory;
let mailerGatewayMemory: MailerGatewayMemory;

beforeEach(() => {
  accountDAOMemory = new AccountDAOMemory();
  mailerGatewayMemory = new MailerGatewayMemory();
});

describe('Create account', () => {
  test('Should fail creation account when payload.name is invalid', () => {
    const account = {
      name: 'a'
    };
  
    expect(() => signup(account, accountDAOMemory, mailerGatewayMemory)).rejects.toThrow('Invalid name');
  });
  
  test('Should fail creation account when payload.email is invalid', () => {
    const account = {
      name: 'fulano silva',
      email: 'a'
    };
  
    expect(() => signup(account, accountDAOMemory, mailerGatewayMemory)).rejects.toThrow('Invalid email');
  });
  
  test('Should fail creation account when payload.cpf is invalid', () => {
    const account = {
      name: 'fulano silva',
      email: 'fulano@gmail.com',
      cpf: '000.000.000-00'
    };
  
    expect(() => signup(account, accountDAOMemory, mailerGatewayMemory)).rejects.toThrow('Invalid CPF');
  });
  
  test('Should fail creation account when account is driver and payload.carPlate is invalid', () => {
    const account = {
      name: 'fulano silva',
      email: 'fulano@gmail.com',
      cpf: '959.600.920-69',
      carPlate: 'a',
      isDriver: true
    };
  
    expect(() => signup(account, accountDAOMemory, mailerGatewayMemory)).rejects.toThrow('Invalid car plate');
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
  
    const creationData = await signup(account, accountDAOMemory, mailerGatewayMemory);
    
    expect(creationData).toHaveProperty('accountId');
    expect(() => signup(account, accountDAOMemory, mailerGatewayMemory)).rejects.toThrow('Duplicate account');
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
  
    const creationData = await signup(account, accountDAOMemory, mailerGatewayMemory);
    
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
  
    const creationData = await signup(account, accountDAOMemory, mailerGatewayMemory);
    
    expect(creationData).toHaveProperty('accountId', account.id);
  });
});


describe('Create account - Test Doubles', () => {
  test('Should create account of passenger with stub', async () => {
    const mailerStub = sinon.stub(MailerGatewayMemory.prototype, 'send').resolves();
    const accountDAOStub1 = sinon.stub(AccountDAOMemory.prototype, 'findAccountByEmail').resolves();
    const accountDAOStub2 = sinon.stub(AccountDAOMemory.prototype, 'createAccount').resolves();
    
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
    
    const creationData = await signup(account, accountDAOMemory, mailerGatewayMemory);
    
    expect(creationData).toHaveProperty('accountId', account.id);

    mailerStub.restore();
    accountDAOStub1.restore();
    accountDAOStub2.restore();
  });

  test('Should create account of passenger with spy', async () => {
    const mailerSpy = sinon.stub(MailerGatewayMemory.prototype, 'send');
    
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
    
    const creationData = await signup(account, accountDAOMemory, mailerGatewayMemory);
    
    expect(creationData).toHaveProperty('accountId', account.id);
    expect(mailerSpy.calledOnce).toBeTruthy();
    expect(mailerSpy.calledWith(account.email, 'Welcome', '...')).toBeTruthy();

    mailerSpy.restore();
  });

  test('Should create account of passenger with mock', async () => {
    const mailerMock = sinon.mock(MailerGatewayMemory.prototype);
    
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

    mailerMock.expects('send').withArgs(account.email, 'Welcome', '...').once().callsFake(() => {
      console.log('abc')
    });
    
    const creationData = await signup(account, accountDAOMemory, mailerGatewayMemory);
    
    expect(creationData).toHaveProperty('accountId', account.id);
    
    mailerMock.verify();
    mailerMock.restore();
  });
});