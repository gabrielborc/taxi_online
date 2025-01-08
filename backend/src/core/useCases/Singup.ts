import AccountData from './repositories/AccountData';
import DuplicateRecordError from '../domain/entities/errors/DuplicateRecordError';
import Account from '../domain/entities/Account';

export default class Singup {
  constructor(
    readonly accountData: AccountData, 
    readonly mailerGateway: MailerGateway
  ) {}

  async execute(input: any) {
    const account = Account.create(input.name, input.email, input.cpf, input.carPlate, input.password, input.isPassenger, input.isDriver);
    const existingAccount = await this.accountData.findAccountByEmail(input.email);
    if (existingAccount) throw new DuplicateRecordError('Duplicate account');
    
    await this.accountData.saveAccount(account);
    await this.mailerGateway.send(input.email, 'Welcome', '...');
    
    return { accountId: account.accountId };
  }
}

export interface MailerGateway {
  send(receipent: string, subejct: string, message: string): Promise<void>;
}