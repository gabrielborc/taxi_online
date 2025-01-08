import { db } from './db';
import AccountData from '../../../core/useCases/repositories/AccountData';
import Account from '../../../core/domain/entities/Account';

export default class AccountDAODatabase implements AccountData {
  async findAccountById(accountId: string) {
    const [accountData] = await db.query("select * from ccca.account where account_id = $1", [accountId]);

    if (!accountData) return null;

    return new Account(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.cpf,
      accountData.car_plate,
      accountData.password,
      accountData.is_passenger,
      accountData.is_driver
    );
  }

  async findAccountByEmail(email: string) {
    const [accountData] = await db.query("select * from ccca.account where email = $1", [email]);

    if (!accountData) return null;

    return new Account(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.cpf,
      accountData.car_plate,
      accountData.password,
      accountData.is_passenger,
      accountData.is_driver
    );
  }

  async saveAccount(account: Account) {
    await db.query(
      "insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)",
      [account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver, account.password]
    );
  }
}