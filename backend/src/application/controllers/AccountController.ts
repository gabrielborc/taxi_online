import { Request, Response } from 'express';
import GetAccount from '../../core/useCases/GetAccount';
import Singup from '../../core/useCases/Singup';
import { HttpServer } from '../http/Server';

export default class AccountController {
	constructor (
		readonly httpServer: HttpServer,
		readonly getAccount: GetAccount,
		readonly singup: Singup
	) {
		httpServer.register('get', '/accounts/:accountId', async (req: Request, res: Response) => {
			const { accountId } = req.params;
			const account = await getAccount.execute(accountId);
			res.json(account);
		});

		httpServer.register('post', '/singup', async (req: Request, res: Response) => {
			const input = req.body;
			const result = await singup.execute(input);
			res.json(result);
		});
	}
}