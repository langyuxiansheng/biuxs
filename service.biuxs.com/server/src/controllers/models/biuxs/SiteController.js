/**
 *  site
 */
const KoaRouter = require('koa-router');
const SiteService = require(':services/biuxs/SiteService');
const controller = new KoaRouter({ prefix: '/site' });
const service = new SiteService();

//用户留言（无需token）
controller.post('/addOptionMsg', async(ctx) => {
    ctx.body = await service.addOptionMsg(ctx.request.body, ctx.request.headers);
});

//获取网站首页数据(无需token)
controller.get('/getHomeData', async(ctx) => {
    ctx.body = await service.getHomeData(ctx.request);
});

module.exports = controller;
