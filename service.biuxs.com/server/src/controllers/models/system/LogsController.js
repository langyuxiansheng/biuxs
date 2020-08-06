/**
 * 系统管理员管理
 */
const KoaRouter = require('koa-router');
const LogsService = require(':services/system/LogsService');
const controller = new KoaRouter({ prefix: '/logs' });
const service = new LogsService();

//获取系统日志
controller.get('/getSysLogList', async(ctx) => {
    ctx.body = await service.getSysLogList(ctx.state.user);
});

//获取系统日志内容
controller.get('/getSysLogContent', async(ctx) => {
    ctx.body = await service.getSysLogContent(ctx.request.query, ctx.state.user);
});

//删除系统日志
controller.delete('/delSysLogByPaths', async(ctx) => {
    ctx.body = await service.delSysLogByPaths(ctx.request.body, ctx.state.user);
});

module.exports = controller;
