/**
 * 用户服务类
 */
const result = require(':lib/Result');
const emailTool = require(':lib/Email');
const redis = require(':lib/redis'); //redis
const { MODELS_PATH, checkParams, isSuperAdmin, getYearMonthDay, getRandomNum, getTimeStamp, signJWT, getUCMd5, getTimeStampUUID } = require(':lib/Utils');
const { BiuDB, SOP } = require(':lib/sequelize');
const UserBaseModel = BiuDB.import(`${MODELS_PATH}/member/UserBaseModel`);
const FilesBaseModel = BiuDB.import(`${MODELS_PATH}/common/FilesBaseModel`);
module.exports = class {
    // constructor() {
    //     UserBaseModel.sync().then((res) => {
    //         console.log(`UserBaseModel 同步成功`, res);
    //     });
    // }

    /**
     * Biu用户注册
     * @param {*} param0
     */
    async userRegister(data) {
        if (!checkParams(data, {
            nickname: 'string',
            email: 'string',
            password: 'string',
            code: 'number'
        })) return result.paramsLack();
        try {
            const { nickname, email, password, code } = data;
            const rd = await redis.getData(email);
            if (!rd || (getTimeStamp() - rd.addAt) > rd.ttl) return result.failed(`验证码已过期!`);
            if (code != rd.code) return result.failed(`验证码不正确!`);
            //查询昵称是否存在
            const nicknameCount = await UserBaseModel.count({
                where: { nickname, isDelete: false }
            });
            if (nicknameCount > 0) return result.failed(`昵称【${nickname}】已存在!`);
            await UserBaseModel.create({ nickname, email, password, authType: '0100' });
            redis.delData(email);
            return result.success();
        } catch (error) {
            console.error(error);
            return result.failed(error);
        }
    }

    /**
     * 发送户注册邮件
     * @param {*} param0
     */
    async sendUserRegisterEmailCode(data, { ip }) {
        if (!checkParams(data, {
            email: 'string'
        })) return result.paramsLack();
        try {
            const { email } = data;
            const emailCount = await UserBaseModel.count({ where: { email, isDelete: false } });
            if (emailCount > 0) return result.failed(`邮箱【${email}】已存在!`);
            const subject = `新用户注册邮箱验证`;
            const emailRes = await this.__sendEmailCodeToUeser({ email, content: subject, subject, ip });
            return emailRes;
        } catch (error) {
            console.error(error);
            return result.failed('邮件发送失败!', null, error);
        }
    }

    /**
     * 用户会员登录
     * @param {*} param0
     */
    async userLogin(data) {
        if (!checkParams(data, {
            account: 'string',
            password: 'string'
        })) return result.paramsLack();
        try {
            const { account, password, is15AutoLogin } = data;
            const queryData = {
                where: { isDelete: false, password },
                attributes: { exclude: ['isDelete', 'createdTime', 'updatedTime'] }
            };
            if (/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(account)) { //邮箱登录
                queryData.where['email'] = account;
            } else if (/^[1][34578]\\d{9}$/.test(account)) { //手机号登录
                queryData.where['phone'] = account;
            } else if (/^biunav?/.test(account)) { //账号登录
                queryData.where['account'] = account;
            }
            let user = await UserBaseModel.findOne(queryData);
            if (!user || (password !== user.password)) return result.failed('账号或密码不正确');
            if (user.status == 4) return result.failed('账户已被禁用'); //封号的禁止登录
            const sid = getUCMd5(user.userId);
            const jwtId = getTimeStampUUID(); //生成唯一id
            const expiresIn = is15AutoLogin ? '15d' : '7d'; //默认是7天有效
            const jwt = signJWT({ sid, jwtId }, expiresIn); //验证通过签发jwt,2小时有效!
            const res = await redis.setData(sid, { jwt, user, jwtId });
            if (!res) return result.failed('系统错误,登录出错');
            //隐藏手机号中间4位
            // user['phone'] = user.phone ? user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : null;
            user['password'] = null; //移除密码字段
            return result.success(null, { jwt, user });
        } catch (error) {
            console.error(error);
            return result.failed(error);
        }
    }

    /**
     * 用户重置密码
     * @param {*} data
     * @param type 1邮件重置 2手机验证码
     */
    async userResetPwd(data) {
        if (!checkParams(data, {
            email: 'string',
            code: 'number',
            password: 'string',
            type: 'number'
        })) return result.paramsLack();
        try {
            const { email, code, password, type } = data;
            if (type == 1) { //邮件验证码
                if (!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(email)) {
                    return result.failed('邮箱格式不正确');
                }
                const rd = await redis.getData(email);
                if (!rd || (getTimeStamp() - rd.addAt) > rd.ttl) return result.failed(`验证码已过期!`);
                if (code != rd.code) return result.failed(`验证码不正确!`);
                await UserBaseModel.update({ password }, { where: { email } });
                redis.delData(email);
                return result.success(`重置密码成功`);
            }
            return result.failed(`暂未开通该业务!`);
        } catch (error) {
            console.error(error);
            return result.failed(error);
        }
    }

    /**
     * 给用户发送密码重置邮件验证码
     * @param {*} param0
     */
    async sendUserResetPwdEmailCode(data, { ip }) {
        if (!checkParams(data, {
            email: 'string'
        })) return result.paramsLack();
        try {
            const { email } = data;
            if (!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(email)) {
                return result.failed('邮箱格式不正确');
            }
            const user = await UserBaseModel.findOne({ where: { email, isDelete: false } });
            if (!email) return result.failed(`邮箱【${email}】未注册!`);
            const subject = `笔优会员密码重置邮箱验证`;
            const name = `亲爱的${user.nickname}`;
            const content = `重置邮箱验证`;
            const emailRes = await this.__sendEmailCodeToUeser({ email, name, subject, content, ip });
            return emailRes;
        } catch (error) {
            console.error(error);
            return result.failed('邮件发送失败!', null, error);
        }
    }

    /**
     * 用户修改密码(修改成功后会发送邮件)
     * @param {*} data
     */
    async userUpdatePwd(data, { userId, sid }) {
        if (!checkParams(data, {
            oldPwd: 'string',
            newPwd: 'string'
        })) return result.paramsLack();
        try {
            const { oldPwd, newPwd } = data;
            const user = await UserBaseModel.findOne({ where: { userId, isDelete: false } });
            if (!user) return result.failed(`非法操作`);
            if (oldPwd !== user.password) return result.failed(`旧密码不正确`);
            await UserBaseModel.update({ password: newPwd }, { where: { userId, isDelete: false } });
            await redis.delData(sid);
            const subject = `用户账户密码修改通知`;
            const message = `
            <div class="biu-nav-email" style="width: 600px; margin: 40px auto;box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);font-size: 16px;padding: 20px;">
                <h3 style="margin-bottom: 40px;">
                    Hi! 亲爱的${user.nickname || '笔优会员'}：
                </h3>
                <p>
                    感谢您使用笔优网址导航,您的密码已经修改,请使用新密码登录系统，祝您生活愉快!
                </p>
                <p>
                    <span>快速访问:</span>
                    <a href="https://www.biunav.com" target="_blank" rel="noopener noreferrer">https://www.biunav.com</a>
                </p>
                <p style="margin-top: 40px;">笔优团队</p>
                <p>${getYearMonthDay(null, true)}</p>
            </div>`;
            emailTool.sendEmail({ toEmail: user.email, subject, message });
            return result.success();
        } catch (error) {
            console.error(error);
            return result.failed(error);
        }
    }

    /**
     * 登录会员获取自己的身份信息
     * @param {*} data
     */
    async getUserInfoBySelf(data) {
        try {
            if (data) {
                const { userId, account, phone, email, avatar, nickname, brief, company, qq, wechat, profession, authType, homePage, sign } = data;
                // const tel = phone ? phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : null;
                return result.success(null, { userId, account, phone, email, avatar, nickname, brief, company, qq, wechat, profession, authType, homePage, sign });
            }
            return result.success();
        } catch (error) {
            console.error(`登录会员获取自己的身份信息:`, error);
            return result.failed(error);
        }
    }

    /**
     * 用户修改个性资料
     * @param {*} data
     * @param {*} user
     */
    async userUpdateBaseInfo(data, u) {
        if (!checkParams(data, {
            userId: 'string'
        })) return result.paramsLack();
        try {
            if (data.userId !== u.userId) {
                return result.failed('非法操作');
            }
            const { userId, nickname, account, phone, brief, company, qq, wechat, profession, homePage, sign } = data;
            let updateData = { brief, company, qq, wechat, profession, homePage, sign };
            if (!u.account && account) { //账号只能修改一次
                const count = await UserBaseModel.count({ where: { isDelete: false, account } });
                if (count) return result.failed('账号已被使用');
                updateData['account'] = account;
            }
            if (!/\*/.test(phone)) { //未加密的手机号才能存入
                updateData['phone'] = phone;
            }
            if (nickname && (nickname !== u.nickname)) {
                const count = await UserBaseModel.count({ where: { isDelete: false, nickname } });
                if (count) return result.failed('昵称已被使用');
                updateData['nickname'] = nickname;
            }
            await UserBaseModel.update(updateData, { where: { userId } });
            const queryData = { where: { isDelete: false, userId }, attributes: { exclude: ['isDelete', 'createdTime', 'updatedTime'] } };
            const user = await UserBaseModel.findOne(queryData);
            const res = await redis.setData(u.sid, { jwt: u.jwt, user, jwtId: u.jwtId });
            if (!res) return result.failed('系统错误,修改出错');
            return result.success(null);
        } catch (error) {
            console.error(error);
            return result.failed(error);
        }
    }

    /**
     * 用户修改自己的头像
     * @param {*} data
     * @param {*} user
     */
    async userUpdateAvatar(data, u) {
        if (!checkParams(data, {
            avatar: 'string'
        })) return result.paramsLack();
        try {
            if (!u.userId) {
                return result.failed('非法操作');
            }
            const userId = u.userId;
            const { avatar } = data;
            const queryData = { where: { isDelete: false, userId }, attributes: { exclude: ['isDelete', 'createdTime', 'updatedTime'] } };
            const user = await UserBaseModel.findOne(queryData);
            if (user.avatar) { //如果用户有旧头像需要标记文件为已被删除的
                await FilesBaseModel.update({ isDelete: true, remark: `用户更换头像` }, { where: { path: user.avatar } });
            }
            //更新用户表的头像字段
            await UserBaseModel.update({ avatar }, { where: { userId } });
            user.avatar = avatar; //写入新的头像
            const res = await redis.setData(u.sid, { jwt: u.jwt, user, jwtId: u.jwtId });
            if (!res) return result.failed('系统错误,修改头像出错');
            return result.success(null);
        } catch (error) {
            console.error(error);
            return result.failed(error);
        }
    }

    /**
     * 会员退出登录
     * @param {*} data
     */
    async userLogout({ sid }) {
        try {
            if (sid && await redis.delData(sid)) return result.success();
            return result.success('未获取到用户');
        } catch (error) {
            console.error(`退出系统出错:`, error);
            return result.failed(error);
        }
    }

    /**
     * 管理员获取会员用户列表
     * @param {*} param0
     */
    async getUserBaseList({ email, page, limit }, userInfo) {
        //非超级管理员不可获取此菜单
        if (!isSuperAdmin(userInfo)) return result.noAuthority();
        let queryData = {
            where: { isDelete: false },
            order: [
                ['createdTime', 'DESC']
            ],
            attributes: { exclude: ['isDelete'] }
        };
        if (email) {
            queryData.where['email'] = {
                [SOP.like]: `%${email}%`
            };
        }
        //分页
        if (page && limit) {
            queryData.offset = Number((page - 1) * limit); //开始的数据索引
            queryData.limit = Number(limit); //每页限制返回的数据条数
        };
        try {
            const { rows, count } = await UserBaseModel.findAndCountAll(queryData);
            return result.success(null, { list: rows, total: count });
        } catch (error) {
            console.error(error);
            return result.failed(error);
        }
    }

    /**
     * 向用户发送邮件验证码
     * @param {*} email
     */
    async __sendEmailCodeToUeser({ email, name, content, subject, ip }) {
        if (!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(email)) { //邮箱
            return result.failed(`邮箱格式不正确`);
        }
        if (!ip) return result.paramsLack();
        try {
            const rd = await redis.getData(email);
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
            const setRes = await redis.setData(email, { code, ip, count, ttl: 60 * 30 + 5, addAt: getTimeStamp() }, 60 * 60 * 24);
            if (!setRes) return result.failed('邮件发送失败');
            const message = `
            <div class="biu-nav-email" style="width: 600px; margin: 40px auto;box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);font-size: 16px;padding: 20px;">
                <h3 style="margin-bottom: 40px;">
                    Hi! 亲爱的${name || '笔优会员'}：
                </h3>
                <p>
                    感谢您使用笔优网址导航,您正在进行${content},本次请求的验证码为:
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
