import crypto from 'crypto';
import { validateCpf } from "../validateCpf";
import BusinessError from "./errors/BusinessError";

export default class Account {
  constructor(
    readonly accountId: string,
    readonly name: string,
    readonly email: string,
    readonly cpf: string,
    readonly carPlate: string,
    readonly password: string,
    readonly isPassenger: boolean,
    readonly isDriver: boolean
  ) {
    if (!this.validateName(name)) throw new BusinessError('Invalid name');
    if (!this.validateEmail(email)) throw new BusinessError('Invalid email');
    if (!validateCpf(cpf)) throw new BusinessError('Invalid CPF');
    if (isDriver && !this.validateCarPlate(carPlate)) throw new BusinessError('Invalid car plate');
  }

  validateName(name: string) {
    const patternName = /[a-zA-Z] [a-zA-Z]+/
  
    return patternName.test(name);
  }
  
  validateEmail(email: string) {
    const patternEmail = /^(.+)@(.+)$/;
  
    return patternEmail.test(email);
  }
  
  validateCarPlate(carPlate: string) {
    const patternCarPlate = /[A-Z]{3}[0-9]{4}/;
  
    return patternCarPlate.test(carPlate);
  }

  static create(
    name: string,
    email: string,
    cpf: string,
    carPlate: string,
    password: string,
    isPassenger: boolean,
    isDriver: boolean
  ) {
    const accountId = crypto.randomUUID();
    return new Account(accountId, name, email, cpf, carPlate, password, isPassenger, isDriver);
  }
}