import getAccount from '../../../src/core/useCases/getAccount';
import signup from '../../../src/core/useCases/signup';
import AccountDAOMemory from '../../../src/application/db/memory/AccountDAOMemory';
import MailerGatewayMemory from '../../../src/application/services/MailerGatewayMemory';

let accountDAO: AccountDAOMemory;
let mailerGateway: MailerGatewayMemory;

beforeEach(() => {
  accountDAO = new AccountDAOMemory();
  mailerGateway = new MailerGatewayMemory();
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
  
    await signup(account, accountDAO, mailerGateway);
    const searchData = await getAccount(account.id, accountDAO);
  
    expect(searchData).toEqual(account);
  });

  test('Should fail get account because not found account', () => { 
    const accountID = '61b281b9-e7ec-42ab-8480-4c6f42163a5d';
    expect(() => getAccount(accountID, accountDAO)).rejects.toThrow('Account not found');
  });
});
