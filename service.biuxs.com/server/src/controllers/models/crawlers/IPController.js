/**
 *  web信息爬虫系统入口
 */
const KoaRouter = require('koa-router');
const WebService = require(':services/crawlers/IPService');
const controller = new KoaRouter({ prefix: '/ip' });
const service = new WebService();

controller.post('/validateProxyIP', async(ctx) => {
    ctx.body = await service.validateProxyIP(ctx.request.body);
});

controller.get('/manualStart', async(ctx) => {
    ctx.body = await service.manualStart(ctx.request.query);
});
module.exports = controller;
