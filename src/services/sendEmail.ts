const PORT = process.env.PORT ?? 3000
const FRONT = process.env.F_PORT

export class Mail {
  mailData: object;
  constructor() {
    this.mailData = {};
  }

  createDataVerify(email: string, userData: any) {
    this.mailData[email] = {
      from: `no reply <matveev.nikita96@gmail.com>`,
      to: [`${email}`],
      subject: 'Hello, please Verify your account',
      text: ` Hello, ${userData.firstName} ${userData.lastName}, please verify you account!
       Please, click this link: href="http://localhost:${PORT}/?token=${userData.token}">Verify`,
      html: ` Hello, ${userData.firstName} ${userData.lastName}, please verify you account!<br>
      Please, click this link: <a href="http://localhost:${PORT}/?token=${userData.token}">Verify</a>`,
    };
    return email;
  }

  createDataRestore(email: string, userData: any) {
    this.mailData[email] = {
      from: `no reply <matveev.nikita96@gmail.com>`,
      to: [`${email}`],
      subject: 'Hello, reset password',
      text: ` Hello, ${userData.firstName} ${userData.lastName}, you want to restore your password!
       Please, click this link: href="http://localhost:${FRONT}/passwordreset?token=${userData.token}">Restore`,
      html: ` Hello, ${userData.firstName} ${userData.lastName}, you want to restore your password!<br>
      Please, click this link: <a href="http://localhost:${FRONT}/passwordreset?token=${userData.token}">Restore</a>`,
    };
    return email;
  }

  getData(email: string) {
    const data = this.mailData[email];
    return data ? { ...data } : null;
  }
}
