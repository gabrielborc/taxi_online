export default interface AccountData {
  findAccountByID(accountID: string): Promise<any>;
  findAccountByEmail(email: string): Promise<any>;
  createAccount(account: any): Promise<void>;
}