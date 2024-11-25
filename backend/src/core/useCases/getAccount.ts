export default async function getAccount(accountID: string, getAccountData: GetAccountData) {
  return getAccountData.findAccountByID(accountID);
}

export interface GetAccountData {
  findAccountByID(accountID: string): Promise<any>;
}