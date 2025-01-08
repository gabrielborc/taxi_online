import Account from '../../domain/entities/Account';

export default interface AccountData {
  findAccountById(accountID: string): Promise<Account|null>;
  findAccountByEmail(email: string): Promise<Account|null>;
  saveAccount(account: Account): Promise<void>;
}