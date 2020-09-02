/**
 *  前端网站API类
 *  @deprecated 此类下的所有接口都无需token
 */
const KoaRouter = require('koa-router');
const SiteService = require(':services/biuxs/SiteService');
const controller = new KoaRouter({ prefix: '/site' });
const service = new SiteService();

//移动端首页数据（无需token）
controller.get('/getHomeMobileData', async(ctx) => {
    ctx.body = await service.getHomeMobileData(ctx.state.user);
});

//获取书籍分类
controller.get('/getBookTypeData', async(ctx) => {
    ctx.body = await service.getBookTypeData(ctx.state.user);
});

//用户留言（无需token）
controller.post('/addOptionMsg', async(ctx) => {
    ctx.body = await service.addOptionMsg(ctx.request.body, ctx.request.headers);
});

//获取网站首页数据(无需token)
controller.get('/getHomeData', async(ctx) => {
    ctx.body = await service.getHomeData(ctx.request);
});

module.exports = controller;
