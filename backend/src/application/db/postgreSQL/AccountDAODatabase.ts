import { db } from './db';
import AccountData from '../../../core/useCases/repositories/AccountData';

export default class AccountDAODatabase implements AccountData {
  async findAccountByID(accountID: string) {
    try {
      const [account] = await db.query("select * from ccca.account where account_id = $1", [accountID]);
      return account;
    } catch (error) {
      console.log(error);
    }
    
    return null;
  }

  async findAccountByEmail(email: string) {
    try {
      const [account] = await db.query("select * from ccca.account where email = $1", [email]);
      return account;
    } catch (error) {
      console.log(error);
    } 
    
    return null;
  }

  async createAccount(input: any) {
    await db.query(
      "insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", 
      [input.id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver, input.password]
    );
  }
}