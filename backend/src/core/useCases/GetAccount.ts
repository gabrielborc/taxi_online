import NotFoundError from '../domain/entities/errors/NotFoundError';
import AccountData from './repositories/AccountData';

export default class GetAccount {
  constructor(readonly accountData: AccountData) {}

  async execute(accountId: string) {
    const account = await this.accountData.findAccountById(accountId);

    if (!account) throw new NotFoundError('Account not found');

    return account;
  }
}
