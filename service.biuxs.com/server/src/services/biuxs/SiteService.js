/**
 * 网站信息服务类
 */
const result = require(':lib/Result');
// const config = require(':config/server.base.config'); //配置文件
// const redis = require(':lib/redis'); //redis
// const { MODELS_PATH, checkParams, getLC } = require(':lib/Utils');
// const { BiuDB, SOP } = require(':lib/sequelize');
// const { SOP } = require(':lib/sequelize');
module.exports = class {
    /**
     * 获取首页的数据（无需token）
     * @param {*} param0
     */
    async getHomeData({ ip, host, headers }) {
        try {

            // return result.success(null, res);
        } catch (error) {
            console.error(error);
            return result.failed(error);
        }
    }
};
