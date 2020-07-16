/**
 *  site
 */
const KoaRouter = require('koa-router');
const SiteService = require(':services/biuxs/SiteService');
const controller = new KoaRouter({ prefix: '/site' });
const service = new SiteService();

//获取网站分类列表(无需token)
controller.get('/getWebsiteTypes', async(ctx) => {
    ctx.body = await service.getWebsiteTypes(ctx.request.query);
});

//用户留言（无需token）
controller.post('/addOptionMsg', async(ctx) => {
    ctx.body = await service.addOptionMsg(ctx.request.body, ctx.request.headers);
});

//获取网站富文本列表(无需token)
controller.get('/getWebpageBaseByMenu', async(ctx) => {
    ctx.body = await service.getWebpageBaseByMenu(ctx.request.query);
});

//获取网站首页数据(无需token)
controller.get('/getHomeData', async(ctx) => {
    ctx.body = await service.getHomeData(ctx.request);
});

//用户提交收录的链接(无需token)
controller.post('/addIncludeLink', async(ctx) => {
    ctx.body = await service.addIncludeLink(ctx.request.body, ctx.request.headers);
});

//根据分类的拼音名获取分类及其下面的链接（无需token）
controller.get('/getLinksByType', async(ctx) => {
    ctx.body = await service.getLinksByType(ctx.request.query);
});

//获取热搜词（无需token）
controller.get('/getHotSearchKeywords', async(ctx) => {
    ctx.body = await service.getHotSearchKeywords(ctx.request.query);
});

//查询黑名单公司（无需token）
controller.get('/getCompanyBlacklist', async(ctx) => {
    ctx.body = await service.getCompanyBlacklist(ctx.request.query, ctx.request.headers);
});

//添加黑名单公司（无需token）
controller.post('/addBlacklistCompanyByWeb', async(ctx) => {
    ctx.body = await service.addBlacklistCompanyByWeb(ctx.request.body, ctx.request.headers);
});

//获取背景图库（无需token）
controller.get('/getBackgroundLibs', async(ctx) => {
    ctx.body = await service.getBackgroundLibs(ctx.request.headers);
});
module.exports = controller;
