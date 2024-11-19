import { Request, Response } from 'express';
import signup from '../../core/useCases/signup';
import getAccount from '../../core/useCases/getAccount';
import AccountDAO from '../db/dao/AccountDAO';

const accountDAO = new AccountDAO();

export async function getAccountRequest(req: Request, res: Response) {
	const { accountID } = req.params;
	const account = await getAccount(accountID, accountDAO);

	if (account) {
		res.json(account);
	} else {
		res.status(404).json({ message: "Account not found" });
	}
}

export async function signupRequest(req: Request, res: Response) {
	const input = req.body;
	
	try {
		const result = await signup(input, accountDAO);
		res.json(result);
	} catch (error: any) {
		res.status(422).json({ message: error?.message });
	} 
}