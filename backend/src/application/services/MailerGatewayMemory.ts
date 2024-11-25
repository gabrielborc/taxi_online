import { MailerGateway } from '../../core/useCases/signup';

export default class MailerGatewayMemory implements MailerGateway {
  async send(receipent: string, subejct: string, message: string): Promise<void> {
    console.log('send', receipent, subejct, message);
  }
}