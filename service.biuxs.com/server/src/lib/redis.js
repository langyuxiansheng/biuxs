const config = require(':config/server.base.config');
// const rediskey = require(':config/redis.key'); //redis常量列表
const { getUCMd5 } = require(':lib/Utils');
const Redis = require('ioredis');
const rediskey = {
    GET_VISITOR: 'GET_VISITOR_', //'获取网站访问者'
    GET_WEBSITE_TYPES: 'GET_WEBSITE_TYPES', //'获取网站分类列表'
    GET_HOME_DATA: 'GET_HOME_DATA', //获取首页的数据（无需token）
    GET_EMAIL_VALIDATE_CODE: 'GET_EMAIL_VALIDATE_CODE_', //获取邮件验证码无需token）
    GET_BOOK_TYPES: 'GET_BOOK_TYPES', //'获取小说网站分类列表'
    IS_VALIDATE_PROXY_IP: 'IS_VALIDATE_PROXY_IP', //是否正在验证ip 避免异步方法重复运行
    GET_HOME_MOBILE_DATA: 'GET_HOME_MOBILE_DATA', //获取移动端首页的数据
    GET_BOOK_DETAIL_DATA: `GET_BOOK_DETAIL_DATA_` //前端获取书籍详情
};
class RedisStore {
    constructor() {
        this.redis = new Redis(config.redisConfig);
        this.key = rediskey;
    }
    /**
     * 设置redis data
     * @param {*} key
     * @param {*} data
     * @param {*} maxAge
     * @param {*} ex
     */
    async setData(key, data, maxAge = 60 * 60 * 24, ex = 'EX') {
        let status = null;
        try {
            const KEY = getUCMd5(key); //转成大写的MD5作为key
            if (data && typeof data === 'object') {
                status = await this.redis.set(`${config.redisConfig.dataPrefix}:${KEY}`, JSON.stringify(data), ex, maxAge);
            } else {
                status = await this.redis.set(`${config.redisConfig.dataPrefix}:${KEY}`, data, ex, maxAge);
            }
        } catch (error) {
            console.error(`设置data出错:`, error);
        }
        return status === 'OK';
    }

    /**
     * 获取redis的data
     * @param {*} key
     */
    async getData(key) {
        try {
            const KEY = getUCMd5(key); //转成大写的MD5作为key
            const data = await this.redis.get(`${config.redisConfig.dataPrefix}:${KEY}`);
            if (data && typeof data === 'string') {
                return JSON.parse(data);
            } else {
                return data;
            }
        } catch (error) {
            console.error(`设置data出错:`, error);
        }
    }

    /**
     * 删除redis的data
     * @param {*} key
     */
    async delData(key) {
        let status = null;
        try {
            const KEY = getUCMd5(key); //转成大写的MD5作为key
            status = await this.redis.del(`${config.redisConfig.dataPrefix}:${KEY}`);
        } catch (error) {
            console.error(`删除data出错:`, error);
        }
        return status > 0;
    }
}

module.exports = new RedisStore();
