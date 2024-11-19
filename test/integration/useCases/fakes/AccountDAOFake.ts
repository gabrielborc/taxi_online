import { GetAccountDb } from "../../../../src/core/useCases/getAccount";
import { SingupDb } from "../../../../src/core/useCases/signup";

interface AccountDAOFake extends SingupDb, GetAccountDb {};

export class AccountDAOMemory implements AccountDAOFake {
  private data: any[] = [];

  findAccountByEmail(email: string): Promise<any> {
    const [ account ] = this.data.filter((account) => account?.email === email);
    return Promise.resolve(account);
  }

  findAccountByID(accountID: string): Promise<any> {
    const [ account ] = this.data.filter(({ id }) => id === accountID);
    return Promise.resolve(account);
  }

  createAccount(account: any): Promise<void> {
    this.data.push({ ...account });
    return Promise.resolve();
  }
}