import crypto from 'crypto';
import { validateCpf } from './validateCpf';

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

export default async function signup(input: any, singupData: SingupData, mailerGateway: MailerGateway) {
	const account = await singupData.findAccountByEmail(input.email);

  if (account) throw new Error('Duplicate account');
  if (!validateName(input.name)) throw new Error('Invalid name');
  if (!validateEmail(input.email)) throw new Error('Invalid email');
  if (!validateCpf(input.cpf)) throw new Error('Invalid CPF');
  if (input.isDriver && !validateCarPlate(input.carPlate)) throw new Error('Invalid car plate');

  const id = input?.id 
    ? input.id 
    : crypto.randomUUID();
  await singupData.createAccount({ ...input, id });
  await mailerGateway.send(input.email, 'Welcome', '...');

  return { accountId: id };
}

export interface SingupData {
  findAccountByEmail(email: string): Promise<any>;
  createAccount(account: any): Promise<void>;
}

export interface MailerGateway {
  send(receipent: string, subejct: string, message: string): Promise<void>;
}