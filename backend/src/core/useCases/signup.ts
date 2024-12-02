import crypto from 'crypto';
import { validateCpf } from './validateCpf';
import AccountData from './repositories/AccountData';
import DuplicateRecordError from '../entities/errors/DuplicateRecordError';
import BusinessError from '../entities/errors/BusinessError';

function validateName(name: string) {
  const patternName = /[a-zA-Z] [a-zA-Z]+/

  return patternName.test(name);
}

function validateEmail(email: string) {
  const patternEmail = /^(.+)@(.+)$/;

  return patternEmail.test(email);
}

function validateCarPlate(carPlate: string) {
  const patternCarPlate = /[A-Z]{3}[0-9]{4}/;

  return patternCarPlate.test(carPlate);
}

export default async function signup(input: any, accountData: AccountData, mailerGateway: MailerGateway) {
	const account = await accountData.findAccountByEmail(input.email);

  if (account) throw new DuplicateRecordError('Duplicate account');
  if (!validateName(input.name)) throw new BusinessError('Invalid name');
  if (!validateEmail(input.email)) throw new BusinessError('Invalid email');
  if (!validateCpf(input.cpf)) throw new BusinessError('Invalid CPF');
  if (input.isDriver && !validateCarPlate(input.carPlate)) throw new BusinessError('Invalid car plate');

  const id = input?.id 
    ? input.id 
    : crypto.randomUUID();
  await accountData.createAccount({ ...input, id });
  await mailerGateway.send(input.email, 'Welcome', '...');

  return { accountId: id };
}

export interface MailerGateway {
  send(receipent: string, subejct: string, message: string): Promise<void>;
}