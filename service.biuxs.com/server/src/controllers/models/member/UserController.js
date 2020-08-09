/**
 *  用户先关入口
 */
const KoaRouter = require('koa-router');
const UserService = require(':services/member/UserService');
const controller = new KoaRouter({ prefix: '/user' });
const service = new UserService();

//用户注册
controller.post('/userRegister', async(ctx) => {
    ctx.body = await service.userRegister(ctx.request.body);
});

//发送注册邮件
controller.post('/sendUserRegisterEmailCode', async(ctx) => {
    ctx.body = await service.sendUserRegisterEmailCode(ctx.request.body, ctx.request);
});

//用户会员登录
controller.post('/userLogin', async(ctx) => {
    ctx.body = await service.userLogin(ctx.request.body, ctx.request);
});

//用户会员重置密码
controller.post('/userResetPwd', async(ctx) => {
    ctx.body = await service.userResetPwd(ctx.request.body);
});

//发送重置密码验证码邮件
controller.post('/sendUserResetPwdEmailCode', async(ctx) => {
    ctx.body = await service.sendUserResetPwdEmailCode(ctx.request.body, ctx.request);
});

//用户修改密码(修改成功后会发送邮件)
controller.put('/userUpdatePwd', async(ctx) => {
    ctx.body = await service.userUpdatePwd(ctx.request.body, ctx.state.user);
});

//登录会员获取自己的身份信息
controller.get('/getUserInfoBySelf', async(ctx) => {
    ctx.body = await service.getUserInfoBySelf(ctx.state.user);
});

//会员修改自己的基础信息
controller.put('/userUpdateBaseInfo', async(ctx) => {
    ctx.body = await service.userUpdateBaseInfo(ctx.request.body, ctx.state.user);
});

//会员修改自己的基础信息
controller.put('/userUpdateAvatar', async(ctx) => {
    ctx.body = await service.userUpdateAvatar(ctx.request.body, ctx.state.user);
});

//会员退出登录
controller.put('/userLogout', async(ctx) => {
    ctx.body = await service.userLogout(ctx.state.user);
});

// 管理员获网站的会员列表
controller.get('/getUserBaseList', async(ctx) => {
    ctx.body = await service.getUserBaseList(ctx.request.query, ctx.state.user);
});

module.exports = controller;
