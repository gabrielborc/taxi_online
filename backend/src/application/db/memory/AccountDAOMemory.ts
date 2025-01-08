import Account from '../../../core/domain/entities/Account';
import AccountData from '../../../core/useCases/repositories/AccountData';

export default class AccountDAOMemory implements AccountData {
  private data: any[] = [];

  async findAccountByEmail(email: string): Promise<Account|null> {
    const [account] = this.data.filter((account) => account?.email === email);
    return Promise.resolve(account);
  }

  async findAccountById(accountId: string): Promise<Account|null> {
    const account = this.data.find((account) => account.accountId === accountId);
    return Promise.resolve(account);
  }

  async saveAccount(account: any): Promise<void> {
    this.data.push({ ...account });
  }
}