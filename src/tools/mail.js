const nodemailer = require('nodemailer');

module.exports = class {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
      port: 465, // SMTP 端口
      secureConnection: true, // 使用了 SSL
      auth: {
        user: '',
        // 这里密码不是qq密码，是你设置的smtp授权码
        pass: 'xxxxxx',
      }
    });
  }
  /**
   *发送邮件
   *
   */
  async send(to = '', subject = '', html = '') {
    let mailOptions = {
      from: '"task任务通知" <>', // sender address
      to, // list of receivers
      subject, // Subject line
      html // html body
    };
    const doc = await this._sendMail(mailOptions);
    return doc;
  }

  /**
   * 
   * @param {*} mailOptions 
   */
  _sendMail(mailOptions) {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(info);
      });
    });
  }
};