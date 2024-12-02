import { Request, Response } from 'express';
import signup from '../../core/useCases/signup';
import getAccount from '../../core/useCases/getAccount';
import AccountDAO from '../db/postgreSQL/AccountDAODatabase';
import MailerGatewayMemory from '../services/MailerGatewayMemory';

const accountDAO = new AccountDAO();
const mailerGateway = new MailerGatewayMemory();

export async function getAccountRequest(req: Request, res: Response) {
	const { accountID } = req.params;
	const account = await getAccount(accountID, accountDAO);
	res.json(account);
}

export async function signupRequest(req: Request, res: Response) {
	const input = req.body;
	const result = await signup(input, accountDAO, mailerGateway);
	res.json(result);
}