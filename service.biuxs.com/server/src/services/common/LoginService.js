/**
 * 用户登录
 */
const result = require(':lib/Result');
const config = require(':config/server.base.config'); //配置文件
const redis = require(':lib/redis'); //redis
const { MODELS_PATH, getLC, signJWT, deepCloneObject, getUCMd5, getTimeStampUUID } = require(':lib/Utils');
const { logger } = require(':lib/logger4');
const { BiuDB } = require(':lib/sequelize');
const AdminBaseModel = BiuDB.import(`${MODELS_PATH}/system/AdminBaseModel`);
module.exports = class {
    /**
     * 管理员登录
     * @param data 登录数据
     * @param cookies cookie
     */
    async userLoginForSysAdmin({ data, session }) {
        // const cookieCode = cookies.get(config.imgCodeCookieKey);
        const cookieCode = session[config.imgCodeCookieKey];
        if (!cookieCode) return result.failed(`验证码已过期!`);
        const { account, password, code } = data;
        if (!account || !password || !code) return result.paramsLack();
        if (getLC(code) !== getLC(cookieCode)) return result.failed(`验证码错误!`);
        let queryData = {
            where: { account, isDelete: false },
            attributes: { exclude: ['isDelete', 'createdTime', 'updatedTime'] }
        };
        try {
            const user = await AdminBaseModel.findOne(queryData);
            if (!user) return result.failed('用户不存在!');
            if (password !== user.password) return result.failed('账号或密码输入错误!'); //对比密码
            if (!user.roleId) return result.failed('账号异常请联系管理员,异常信息:"未设置用户的角色!"');
            const info = deepCloneObject(user);//克隆一个对象
            info['userId'] = user.adminId; //设置通用id名
            info['userName'] = user.adminName; //设置通用用户名
            const sid = getUCMd5(info.userId);
            const jwtId = getTimeStampUUID(); //生成唯一id
            const jwt = signJWT({ sid, jwtId }, '2h'); //验证通过签发jwt,2小时有效!
            const res = await redis.setData(sid, { jwt, user: info, jwtId }); //redis
            if (!res) return result.failed('系统错误,登录出错');
            //隐藏手机号中间4位
            delete info['password']; //移除密码字段
            return result.success(null, { jwt, user: info });
        } catch (error) {
            logger.error(`管理员登录`, `LoginService.userLoginForSysAdmin`, JSON.stringify(error));
            return result.failed(`登录出错!`, null, error);
        }
    }
};
