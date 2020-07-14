/**
 *  web信息爬虫系统入口
 */
const KoaRouter = require('koa-router');
const WebService = require(':services/crawlers/WebService');
const controller = new KoaRouter();
const service = new WebService();
//抓取输入的目标网站的基本信息
controller.get('/getWebSiteBase', async(ctx) => {
    ctx.body = await service.getWebSiteBase(ctx.request.query);
});
module.exports = controller;
