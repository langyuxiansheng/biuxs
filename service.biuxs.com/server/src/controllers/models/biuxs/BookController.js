/**
 *  前端网站书籍API类
 *  @deprecated 此类下的所有接口都无需token
 */
const KoaRouter = require('koa-router');
const BookService = require(':services/biuxs/BookService');
const controller = new KoaRouter({ prefix: '/book' });
const service = new BookService();

//获取书籍详情
controller.get('/getBookDetailData', async(ctx) => {
    ctx.body = await service.getBookDetailData(ctx.request, ctx.state.user);
});

//获取书籍章节列表
controller.get('/getBookChapterListData', async(ctx) => {
    ctx.body = await service.getBookChapterListData(ctx.request.query, ctx.state.user);
});

//获取书籍章节内容
controller.get('/getBookChapterArticleData', async(ctx) => {
    ctx.body = await service.getBookChapterArticleData(ctx.request.query, ctx.state.user);
});

module.exports = controller;
