/**
 *  轮播图管理
 */
const KoaRouter = require('koa-router');
const BannerService = require(':services/common/BannerService');
const controller = new KoaRouter({ prefix: '/banner' });
const service = new BannerService();

//添加轮播图
controller.post('/addConfig', async(ctx) => {
    ctx.body = await service.addBanner(ctx.request.body, ctx.state.user);
});

//获取轮播图列表
controller.get('/getConfigList', async(ctx) => {
    ctx.body = await service.getBannerList(ctx.request.query, ctx.state.user);
});

//编辑轮播图
controller.put('/updateBanner', async(ctx) => {
    ctx.body = await service.updateBanner(ctx.request.body, ctx.state.user);
});

//删除轮播图
controller.delete('/delBannerByIds', async(ctx) => {
    ctx.body = await service.delBannerByIds(ctx.request.body, ctx.state.user);
});

module.exports = controller;
