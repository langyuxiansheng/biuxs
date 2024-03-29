/**
 * 访客日志中间件
 * 通过jwt的sid获取redis里存储的用户信息
 */
const http = require('superagent');
const redis = require(':lib/redis'); //redis
const result = require(':lib/Result');
const { MODELS_PATH } = require(':lib/Utils');
const { BiuDB } = require(':lib/sequelize');
const VisitLogsModel = BiuDB.import(`${MODELS_PATH}/system/VisitLogsModel`);
module.exports = async (ctx, next) => {
    try {
        // VisitLogsModel.sync().then((res) => {
    //     console.log(`VisitLogsModel 同步成功`, res);
    // });
        const ip = ctx.ip;
        const userAgent = ctx.headers['user-agent'];
        let visitor = await redis.getData(`${redis.key.GET_VISITOR}${ip}`);
        if (!visitor) visitor = await VisitLogsModel.findOne({ where: { ip } });
        if (!visitor) {
            const origin = ctx.origin;
            const originalUrl = ctx.originalUrl;
            const href = ctx.href;
            const remark = JSON.stringify({ ...ctx.headers, originalUrl, href });
            const requestURL = `http://ip-api.com/json/127.0.0.1?lang=zh-CN`;
            let location = null;
            http.get(requestURL).accept('json').then((res) => {
                if (res && res.status == 200) {
                    const { query, country, regionName, city, lat, lon } = res.body || {};
                    location = ['127.0.0.1', 'localhost'].includes(query) ? '本地服务调用' : `${country}${regionName}${city}[${lat},${lon}]`;
                }
            }).finally(() => {
                VisitLogsModel.create({ origin, ip, userAgent, remark, status: 1, location });
            });
        } else {
            //有效期为7天
            redis.setData(`${redis.key.GET_VISITOR}${ip}`, visitor, 60 * 60 * 24 * 7);
            if (visitor.status == 2) {
                return ctx.body = result.failed('非法访问,稍后再试!');
            } else if (visitor.status == 3) {
                return ctx.body = result.failed('非法访问!');
            }
        }
        await next();
    } catch (error) {
        return ctx.body = result.failed('服务出错!');
    }
};
