/**
 * web信息爬虫系统信息服务类
 */
const result = require(':lib/Result');
const WebSiteBase = require(':crawlers/WebSiteBase'); //配置文件
module.exports = class {
    /**
     * 抓取输入链接网站的基础信息
     * @param {*} param0
     */
    async getWebSiteBase({ url }) {
        try {
            const hao123 = new WebSiteBase(url);
            const res = await hao123.start();
            return result.success(null, res);
        } catch (error) {
            console.error(error);
            return result.failed(new Error(error));
        }
    }
};
