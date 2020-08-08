/**
 *  web信息爬虫系统入口
 */
const KoaRouter = require('koa-router');
const TasksService = require(':services/crawlers/TasksService');
const controller = new KoaRouter({ prefix: '/tasks' });
const service = new TasksService();

//获取爬虫系统任务列表
controller.get('/getTaskList', async(ctx) => {
    ctx.body = await service.getTaskList(ctx.request.query, ctx.state.user);
});

//编辑爬虫系统任务
controller.put('/updateTask', async(ctx) => {
    ctx.body = await service.updateTask(ctx.request.body, ctx.state.user);
});

//删除爬虫系统任务
controller.delete('/delTaskByIds', async(ctx) => {
    ctx.body = await service.delTaskByIds(ctx.request.body, ctx.state.user);
});

module.exports = controller;
