/**
 *  公共信息入口
 */
const KoaRouter = require('koa-router');
const ConfigService = require(':services/common/ConfigService');
const controller = new KoaRouter({ prefix: '/config' });
const service = new ConfigService();

//添加配置项
controller.post('/addConfig', async(ctx) => {
    ctx.body = await service.addConfig(ctx.request.body, ctx.state.user);
});

//获取配置项列表
controller.get('/getConfigList', async(ctx) => {
    ctx.body = await service.getConfigList(ctx.request.query, ctx.state.user);
});

//根据唯一标识符获取配置项
controller.get('/getConfigByCode/:code', async(ctx) => {
    ctx.body = await service.getConfigByCode(ctx.params, ctx.state.user);
});

//编辑配置项
controller.put('/updateConfig', async(ctx) => {
    ctx.body = await service.updateConfig(ctx.request.body, ctx.state.user);
});

//删除配置项
controller.delete('/delConfigByIds', async(ctx) => {
    ctx.body = await service.delConfigByIds(ctx.request.body, ctx.state.user);
});

module.exports = controller;
