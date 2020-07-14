/**
 * 用户登录路由入口
 */
const KoaRouter = require('koa-router');
const UtilsService = require(':services/common/UtilsService');
const controller = new KoaRouter();
const service = new UtilsService();
//获取图片验证码
controller.get('/getImgValidate', async(ctx) => {
    ctx.body = await service.getImgValidate(ctx.request.query, ctx); ;
});

//获取邮件验证码
controller.post('/sendEmailValidateCode', async(ctx) => {
    ctx.body = await service.sendEmailValidateCode(ctx.request.body, ctx.request);
});
module.exports = controller;
