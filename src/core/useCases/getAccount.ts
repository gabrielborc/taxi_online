export default async function getAccount(accountID: string, db: GetAccountDb) {
  return db.findAccountByID(accountID);
}

export interface GetAccountDb {
  findAccountByID(accountID: string): Promise<any>;
}