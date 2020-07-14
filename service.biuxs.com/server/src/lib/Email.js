
const nodemailer = require('nodemailer');
const config = require(':config/server.base.config'); //配置文件
class EMail {
    constructor(options) {
        this.options = {
            host: 'smtp.qq.com',
            port: 465,
            fromUser: '"发送人" <user@qq.com>',
            subject: null,
            secureConnection: true,
            // 我们需要登录到网页邮箱中，然后配置SMTP和POP3服务器的密码
            auth: {
                user: 'user@qq.com',
                pass: 'loginkey' //邮箱生成的登录key
            }
        };
        if (options) {
            for (const key in options) {
                this.options[key] = options[key];
            }
        }
        this.mailer = nodemailer.createTransport(this.options);
    }

    /**
     * 发送邮件
     * @param {*} toName 接收者的名字
     * @param {*} toEmail 接收邮件的地址
     */
    sendEmail({ toEmail, subject, message }) {
        const mailOptions = {
            // 发送邮件的地址
            from: this.options.fromUser, // login user must equal to this user
            // 接收邮件的地址
            to: toEmail,
            // 邮件主题
            subject: subject || '你有一条新消息',
            // 以HTML的格式显示，这样可以显示图片、链接、字体颜色等信息
            html: message
        };
        return this.mailer.sendMail(mailOptions);
    }
};

module.exports = new EMail(config.email);
