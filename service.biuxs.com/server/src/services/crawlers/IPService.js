/**
 * web信息爬虫系统信息服务类
 */
const result = require(':lib/Result');
const IPProxyCrawler = require(':crawlers/IPProxyCrawler'); //配置文件
const ipc = new IPProxyCrawler();
module.exports = class {
    /**
     * 验证ip池的ip可用性
     * @param {*} param0
     */
    async validateProxyIP({ status }) {
        try {
            const res = await ipc.validateProxyIP(status);
            return res;
        } catch (error) {
            console.error(error);
            return result.failed(new Error(error));
        }
    }

    /**
     * 手动抓取
     * @param {*} param0
     */
    async manualStart({ page }) {
        try {
            ipc.manualStart(page);
            return result.success();
        } catch (error) {
            console.error(error);
            return result.failed(new Error(error));
        }
    }
};
