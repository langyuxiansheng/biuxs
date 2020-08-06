/**
 * 公共工具类
 */
const svgCaptcha = require('svg-captcha');
const emailTool = require(':lib/Email');
const result = require(':lib/Result');
const config = require(':config/server.base.config'); //配置文件
const redis = require(':lib/redis'); //redis
const { getYearMonthDay, getRandomNum, getTimeStamp } = require(':lib/Utils');
module.exports = class {
    async getImgValidate({ size = 4, w = 100, h = 30 }, { session, request }) {
        try {
            const { headers } = request;
            const { text, data } = svgCaptcha.create({
                inverse: false, // 翻转颜色
                size: size, //随机字符串长度
                noise: 1, // 噪声线条数
                fontSize: 46,
                width: w,
                height: h,
                color: true, //随机颜色
                background: !true
            });
            //设置验证码
            session[config.imgCodeCookieKey] = text; //系统时间5分钟
            //设置验证码
            await redis.setData(`${config.imgCodeCookieKey}_${headers.origin}`, { origin: headers.origin, code: text }, 60 * 5); //设置为5分钟有效
            return result.success(null, { img: data, text });
        } catch (error) {
            return result.failed(error);
        }
    }

    /**
     * 向用户发送邮件验证码
     * @param {*} email
     */
    async sendEmailValidateCode({ email, type = 'ecode' }, { ip }) {
        if (!email) return result.paramsLack();
        if (!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(email)) { //邮箱
            return result.failed(`邮箱格式不正确`);
        }
        if (!ip) return result.paramsLack();
        try {
            const rd = await redis.getData(email + type);
            let count = 1; //用户发送邮件的计次数
            if (rd) {
                const time = getTimeStamp() - rd.addAt;
                count += rd.count; //从redis里取出来
                if (ip === rd.ip && time < 60 * 60 * 24 && count > 10) { //1天同ip和同邮箱最多只能发送10封邮件,且属于那种只发出去不操作的
                    return result.failed(`您今天发送的邮件已超过上限!`);
                }
            }
            const code = getRandomNum(100000, 999999);
            //设置存入的时间 //加上5s的发送延迟误差
            const setRes = await redis.setData(email + type, { code, ip, count, ttl: 60 * 30 + 5, addAt: getTimeStamp() }, 60 * 60 * 24);
            if (!setRes) return result.failed('邮件发送失败');
            const subject = `用户邮箱验证`;
            const message = `
            <div class="biu-nav-email" style="width: 600px; margin: 40px auto;box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);font-size: 16px;padding: 20px;">
                <h3 style="margin-bottom: 40px;">
                    Hi! 亲爱的用户：
                </h3>
                <p>
                    感谢您使用笔优网址导航,您正在进行邮箱验证,本次请求的验证码为:
                </p>
                <p style="color: #9da4a5;">
                    <strong style="color: #3acbff;font-size: 24px;">${code}</strong>
                    <span>(为了保障您帐号的安全性,请在30分钟内完成验证,祝您生活愉快!)</span>
                </p>
                <p>
                    <span>快速访问:</span>
                    <a href="https://www.biunav.com" target="_blank" rel="noopener noreferrer">https://www.biunav.com</a>
                </p>
                <p style="margin-top: 40px;">笔优团队</p>
                <p>${getYearMonthDay(null, true)}</p>
            </div>`;
            const res = await emailTool.sendEmail({ toEmail: email, subject, message });
            if (res && res.messageId) {
                return result.success();
            }
            return result.failed('邮件发送失败');
        } catch (error) {
            console.error(error);
            return result.failed('邮件发送失败!', null, error);
        }
    }
};
