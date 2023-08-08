import { NodeMailgun } from 'ts-mailgun';

const API_KEY = process.env.MAIL_KEY; 
const DOMAIN = 'sandbox66befa0c57a643ddb7c1604c3b1e286b.mailgun.org';

export class Mail {
  static async init() {
    const mailer = new NodeMailgun();
    //mailer.testMode = true;
    //mailer.options! = { host: 'api.eu.mailgun.net' }; // If create a EU domain
    mailer.apiKey = API_KEY!;
    mailer.domain = DOMAIN;
    mailer.fromEmail = 'ihbelda@gmail.com';
    mailer.fromTitle = 'Present3';

    mailer.init();

    return mailer;
  }

  static async sendMessage(mailer: Promise<NodeMailgun>, email: string, msg: string) {
    (await mailer)
      .send(
        email,
        'Present3 invited you to an event',
        `<h1>${msg}</h1>`
      )
      .then((result: any) => console.log('Email delivered', result))
      .catch((error: any) => console.error('Error delivering Email ', error));
  }
}
