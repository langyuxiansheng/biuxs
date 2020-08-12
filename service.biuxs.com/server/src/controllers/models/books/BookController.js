/**
 * 书籍管理
 */
const KoaRouter = require('koa-router');
const BookService = require(':services/books/BookService');
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

//管理员获取书籍章节列表
controller.get('/getBookChapterListByAdmin', async(ctx) => {
    ctx.body = await service.getBookChapterListByAdmin(ctx.request.query, ctx.state.user);
});

//管理员删除书籍章节
controller.delete('/delBookChapterAdminByIds', async(ctx) => {
    ctx.body = await service.delBookChapterAdminByIds(ctx.request.body, ctx.state.user);
});

//管理员修改书籍章节
controller.put('/updateBookChapterAdmin', async(ctx) => {
    ctx.body = await service.updateBookChapterAdmin(ctx.request.body, ctx.state.user);
});

module.exports = controller;
