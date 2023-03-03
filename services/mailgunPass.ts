
export class MailRestore  {
    mailData : object
    constructor(){
       this.mailData = {}
    }
    
         
    createData(email: string, userData: any) {
      this.mailData[email] = {
        from: `no reply <matveev.nikita96@gmail.com>`,
        to: [`${email}`],
        subject: "Hello, restored password",
        text: ` Hello, ${userData.firstName} ${userData.lastName}, you want to restore your password!
       Please, click this link: href="http://localhost:3000/forgotpass1?token=${userData.token}">Restore`,
        html: ` Hello, ${userData.firstName} ${userData.lastName}, you want to restore your password!<br>
      Please, click this link: <a href="http://localhost:3000/forgotpass1?token=${userData.token}">Restore</a>`,
      };
      return email;
    }
  
    getData(email:string) {
      const data = this.mailData[email];
      return data ? { ...data } : null;
    }
  }
  
  
  