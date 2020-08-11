/**
 * 书籍管理
 */
const KoaRouter = require('koa-router');
const BookService = require(':services/book/BookService');
const controller = new KoaRouter({ prefix: '/book' });
const service = new BookService();

//管理员获取书籍列表
controller.get('/getBookListByAdmin', async(ctx) => {
    ctx.body = await service.getBookListByAdmin(ctx.request.query, ctx.state.user);
});

//管理员删除书籍
controller.delete('/delBookAdminByIds', async(ctx) => {
    ctx.body = await service.delBookAdminByIds(ctx.request.body, ctx.state.user);
});

//管理员修改书籍
controller.put('/updateBookAdmin', async(ctx) => {
    ctx.body = await service.updateBookAdmin(ctx.request.body, ctx.state.user);
});

module.exports = controller;
