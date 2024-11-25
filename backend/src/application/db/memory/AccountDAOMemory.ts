import { AccountDAO } from '../interfaces/AccountDAO';

export class AccountDAOMemory implements AccountDAO {
  private data: any[] = [];

  async findAccountByEmail(email: string): Promise<any> {
    const [ account ] = this.data.filter((account) => account?.email === email);
    return Promise.resolve(account);
  }

  async findAccountByID(accountID: string): Promise<any> {
    const [ account ] = this.data.filter(({ id }) => id === accountID);
    return Promise.resolve(account);
  }

  async createAccount(account: any): Promise<void> {
    this.data.push({ ...account });
  }
}