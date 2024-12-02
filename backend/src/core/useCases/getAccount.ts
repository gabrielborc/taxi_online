import NotFoundError from '../entities/errors/NotFoundError';
import AccountData from './repositories/AccountData';

export default async function getAccount(accountID: string, accountData: AccountData) {
  const account = await accountData.findAccountByID(accountID);

  if (!account) throw new NotFoundError('Account not found');

  return account;
}