/**
 * 前端书籍相关服务类
 */
const result = require(':lib/Result');
const redis = require(':lib/redis'); //redis
const { logger } = require(':lib/logger4'); //日志系统
const { MODELS_PATH } = require(':lib/Utils');
const { BiuDB } = require(':lib/sequelize');
const BookInfoCrawler = require(':crawlers/BookInfoCrawler');
const BookBaseModel = BiuDB.import(`${MODELS_PATH}/books/BookBaseModel`);
const BookChapterModel = BiuDB.import(`${MODELS_PATH}/books/BookChapterModel`);
const BookArticleModel = BiuDB.import(`${MODELS_PATH}/books/BookArticleModel`);
const bic = new BookInfoCrawler();
module.exports = class {
    /**
     * 获取书籍详情
     * @param {*} user
     */
    async getBookDetailData({ query: { bookId }, ip }, user) {
        try {
            if (!bookId) return result.paramsLack();
            let book = await redis.getData(`${redis.key.GET_BOOK_DETAIL_DATA}${bookId}`);
            if (!book) {
                //书籍详情
                book = await BookBaseModel.findOne({
                    where: { isDelete: false, bookId },
                    attributes: { exclude: ['isDelete', 'remark'] }
                });
            }
            const isRead = await redis.getData(`${redis.key.GET_VISITOR}${ip}${bookId}`);
            if (book && !(isRead)) {
                book.readCount += 1;
                BookBaseModel.update({ readCount: book.readCount }, { where: { bookId } });
                redis.setData(`${redis.key.GET_VISITOR}${ip}${bookId}`, true, 60 * 60 * 2);
            };
            redis.setData(`${redis.key.GET_BOOK_DETAIL_DATA}${bookId}`, book);
            return result.success(null, book);
        } catch (error) {
            logger.error(`获取书籍详情出错:${new Error(error)}`);
            return result.failed(error);
        }
    }

    /**
     * 获取书籍章节列表
     * @param {*} param0
     */
    async getBookChapterListData({ bookId, page, limit }, user) {
        if (!bookId) return result.paramsLack();
        let queryData = {
            where: { bookId, isDelete: false },
            order: [['index', 'ASC']],
            attributes: ['chapterId', 'index', 'title', 'bookId']
        };
        //分页
        if (page && limit) {
            queryData.offset = Number((page - 1) * limit); //开始的数据索引
            queryData.limit = Number(limit); //每页限制返回的数据条数
        };
        try {
            const { rows, count } = await BookChapterModel.findAndCountAll(queryData);
            return result.success(null, { list: rows, total: count });
        } catch (error) {
            logger.error(`获取书籍章节列表出错:${new Error(error)}`);
            return result.failed(error);
        }
    }

    /**
     * 获取书籍章节内容
     * @param {*} param0
     */
    async getBookChapterArticleData({ chapterId }, user) {
        if (!chapterId) return result.paramsLack();
        let queryData = {
            where: { articleId: chapterId, isDelete: false },
            attributes: ['articleId', 'index', 'title', 'content', 'letterCount']
        };
        try {
            let article = await redis.getData(`${redis.key.GET_BOOK_CHAPTER_ARTICLE_DATA}${chapterId}`);
            if (article) return result.success(null, article);
            article = await BookArticleModel.findOne(queryData);
            //数据库没有就现成抓取
            if (!article) {
                const chapter = await BookChapterModel.findOne({ where: { chapterId, isDelete: false } });
                if (chapter) {
                    const bicArticle = await bic.runArticleTask(chapter);
                    if (bicArticle) { //过滤一次
                        article = {
                            articleId: bicArticle.articleId,
                            index: bicArticle.index,
                            title: bicArticle.title,
                            content: bicArticle.content,
                            letterCount: bicArticle.letterCount
                        };
                    }
                } else {
                    return result.failed(`章节不存在!`);
                }
            } else { //每章章节缓存2小时
                redis.setData(`${redis.key.GET_BOOK_CHAPTER_ARTICLE_DATA}${chapterId}`, article, 60 * 60 * 2);
            }
            return result.success(null, article);
        } catch (error) {
            logger.error(`获取书籍章节内容出错:${new Error(error)}`);
            return result.failed(error);
        }
    }
};
