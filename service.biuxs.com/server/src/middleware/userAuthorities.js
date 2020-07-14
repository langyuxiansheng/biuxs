/**
 * 用户身份验证中间件
 * 通过jwt的sid获取redis里存储的用户信息
 */

const redis = require(':lib/redis'); //redis
const result = require(':lib/Result');
module.exports = async (ctx, next) => {
    const user = ctx.state.user;
    if (user) {
        const rd = await redis.getData(user.sid);
        if (rd && rd.jwtId === user.jwtId) {
            ctx.state.user = Object.assign(user, rd.user);
        } else {
            return ctx.body = result.authorities();
        }
    }
    await next();
};
