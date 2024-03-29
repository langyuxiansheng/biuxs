/***
 * 错误捕获
 */
const result = require(':lib/Result');
const { systemLogger } = require(':lib/logger4'); //日志系统
module.exports = (ctx, next) => {
    return next().catch((err) => {
        const status = err.status;
        if (status == 401) {
            ctx.body = result.authorities();
        } else if (status == 404) {
            ctx.body = result.failed(204, '非法请求!');
        } else {
            ctx.body = result.failed(null, String(err));
        }
        systemLogger.error(err);
    });
};
