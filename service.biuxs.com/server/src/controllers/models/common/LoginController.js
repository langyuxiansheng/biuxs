/**
 * 用户登录路由入口
 */
const KoaRouter = require('koa-router');
const LoginService = require(':services/common/LoginService');
const controller = new KoaRouter({ prefix: '/login' });
const service = new LoginService();

//系统管理员登录
controller.post('/userLoginForSysAdmin', async(ctx) => {
    ctx.body = await service.userLoginForSysAdmin({ data: ctx.request.body, session: ctx.session });
});

module.exports = controller;
