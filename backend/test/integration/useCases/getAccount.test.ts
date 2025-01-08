import GetAccount from '../../../src/core/useCases/GetAccount';
import Singup from '../../../src/core/useCases/Singup';
import AccountDAOMemory from '../../../src/application/db/memory/AccountDAOMemory';
import MailerGatewayMemory from '../../../src/application/services/MailerGatewayMemory';

let accountDAO: AccountDAOMemory;
let mailerGateway: MailerGatewayMemory;
let singup: Singup;
let getAccount: GetAccount;

beforeEach(() => {
  accountDAO = new AccountDAOMemory();
  mailerGateway = new MailerGatewayMemory();
  singup = new Singup(accountDAO, mailerGateway);
  getAccount = new GetAccount(accountDAO);
});

describe('Get account', () => {
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
  
    const { accountId } = await singup.execute(account);
    const searchData = await getAccount.execute(accountId);
  
    expect(searchData).toEqual({ accountId, ...account });
  });

  test('Should fail get account because not found account', () => { 
    const accountID = '61b281b9-e7ec-42ab-8480-4c6f42163a5d';
    expect(() => getAccount.execute(accountID)).rejects.toThrow('Account not found');
  });
});
