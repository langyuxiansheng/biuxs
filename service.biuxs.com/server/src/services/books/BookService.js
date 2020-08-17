/**
 * 书籍相关服务类
 */
const result = require(':lib/Result');
const { logger } = require(':lib/logger4'); //日志系统
const { MODELS_PATH, isSuperAdmin } = require(':lib/Utils');
const { SOP, BiuDB } = require(':lib/sequelize');
const BookBaseModel = BiuDB.import(`${MODELS_PATH}/books/BookBaseModel`);
const BookChapterModel = BiuDB.import(`${MODELS_PATH}/books/BookChapterModel`);
const BookArticleModel = BiuDB.import(`${MODELS_PATH}/books/BookArticleModel`);
const BookInfoCrawler = require(':crawlers/BookInfoCrawler');
const bic = new BookInfoCrawler();
module.exports = class {
    /**
     * 管理员获取书籍列表
     * @param {*} param0
     */
    async getBookListByAdmin({ title, author, page, limit }, user) {
        //非超级管理员不可获取此菜单
        if (!isSuperAdmin(user)) return result.noAuthority();
        let queryData = {
            where: { isDelete: false },
            order: [
                ['createdTime', 'DESC']
            ],
            attributes: { exclude: ['isDelete'] }
        };
        if (title) queryData.where['title'] = { [SOP.like]: `%${title}%` };
        if (author) queryData.where['author'] = { [SOP.like]: `%${author}%` };
        //分页
        if (page && limit) {
            queryData.offset = Number((page - 1) * limit); //开始的数据索引
            queryData.limit = Number(limit); //每页限制返回的数据条数
        };
        try {
            const { rows, count } = await BookBaseModel.findAndCountAll(queryData);
            return result.success(null, { list: rows, total: count });
        } catch (error) {
            logger.error(`管理员获取书籍列表出错:${new Error(error)}`);
            return result.failed(error);
        }
    }

    /**
     * 管理员删除书籍
     * @param {*} param0
     */
    async delBookAdminByIds({ ids, isDelete }, user) {
        //非超级管理员不可获取此菜单
        if (!isSuperAdmin(user)) return result.noAuthority();
        if (!ids || !isDelete || !Array.isArray(ids)) return result.paramsLack();
        try {
            await BiuDB.transaction(async(t) => {
                const del = { where: { bookId: ids } };
                //同步删除书籍 章节 和章节内容表
                await BookBaseModel.destroy(del, { transaction: t });
                await BookChapterModel.destroy(del, { transaction: t });
                return BookArticleModel.destroy(del, { transaction: t });
            });
            return result.success();
        } catch (error) {
            logger.error(`管理员删除书籍出错:${new Error(error)}`);
            return result.failed(error);
        }
    }

    /**
     * 管理员修改书籍
     * @param {*} data
     */
    async updateBookAdmin(data, user) {
        if (!isSuperAdmin(user)) return result.noAuthority();
        if (!data.bookId) return result.paramsLack();
        try {
            await BookBaseModel.update(data, { where: { bookId: data.bookId } });
            return result.success(null);
        } catch (error) {
            logger.error(`管理员修改书籍出错:${new Error(error)}`);
            return result.failed(error);
        }
    }

    /**
     * 管理员获取书籍章节列表
     * @param {*} param0
     */
    async getBookChapterListByAdmin({ bookId, title, page, limit }, user) {
        //非超级管理员不可获取此菜单
        if (!isSuperAdmin(user)) return result.noAuthority();
        if (!bookId) return result.paramsLack();
        let queryData = {
            where: { bookId, isDelete: false },
            order: [['index', 'ASC']],
            attributes: { exclude: ['isDelete'] }
        };
        if (title) queryData.where['title'] = { [SOP.like]: `%${title}%` };
        //分页
        if (page && limit) {
            queryData.offset = Number((page - 1) * limit); //开始的数据索引
            queryData.limit = Number(limit); //每页限制返回的数据条数
        };
        try {
            const { rows, count } = await BookChapterModel.findAndCountAll(queryData);
            return result.success(null, { list: rows, total: count });
        } catch (error) {
            logger.error(`管理员获取书籍章节列表出错:${new Error(error)}`);
            return result.failed(error);
        }
    }

    /**
     * 管理员删除书籍章节
     * @param {*} param0
     */
    async delBookChapterAdminByIds({ ids, isDelete }, user) {
        //非超级管理员不可获取此菜单
        if (!isSuperAdmin(user)) return result.noAuthority();
        if (!ids || !isDelete || !Array.isArray(ids)) return result.paramsLack();
        try {
            await BiuDB.transaction(async(t) => {
                //同步删除章节 和章节内容表
                await BookChapterModel.destroy({ where: { chapterId: ids } }, { transaction: t });
                return BookArticleModel.destroy({ where: { articleId: ids } }, { transaction: t });
            });
            return result.success();
        } catch (error) {
            logger.error(`管理员删除书籍章节出错:${new Error(error)}`);
            return result.failed(error);
        }
    }

    /**
     * 管理员修改书籍章节
     * @param {*} data
     */
    async updateBookChapterAdmin(data, user) {
        if (!isSuperAdmin(user)) return result.noAuthority();
        if (!data.chapterId) return result.paramsLack();
        try {
            await BookChapterModel.update(data, { where: { chapterId: data.chapterId } });
            return result.success(null);
        } catch (error) {
            logger.error(`管理员修改书籍章节出错:${new Error(error)}`);
            return result.failed(error);
        }
    }

    /**
     * 管理员获取书籍章节内容
     * @param {*} param0
     */
    async getBookArticleByAdmin({ chapterId }, user) {
        //非超级管理员不可获取此菜单
        if (!isSuperAdmin(user)) return result.noAuthority();
        if (!chapterId) return result.paramsLack();
        let queryData = { where: { articleId: chapterId, isDelete: false } };
        try {
            let article = await BookArticleModel.findOne(queryData);
            //数据库没有就现成抓取
            if (!article) {
                const chapter = await BookChapterModel.findOne({ where: { chapterId, isDelete: false } });
                article = await bic.runArticleTask(chapter);
            }
            return result.success(null, article);
        } catch (error) {
            logger.error(`管理员获取书籍章节内容出错:${new Error(error)}`);
            return result.failed(error);
        }
    }

    /**
     * 管理员更新书籍章节
     * @param {*} param0
     */
    async refreshBookChapterByAdmin({ bookId }, user) {
        //非超级管理员不可获取此菜单
        if (!isSuperAdmin(user)) return result.noAuthority();
        if (!bookId) return result.paramsLack();
        let queryData = { where: { bookId, isDelete: false } };
        try {
            const book = await BookBaseModel.findOne(queryData);
            if (book) {
                const res = await bic.refreshBookChapterList(book);
                if (res) {
                    await BookBaseModel.update({ remark: `管理员更新书籍章节:本地更新${res}条` }, { where: { bookId } });
                }
                return result.success(null, res);
            } else {
                return result.failed(`未获取到书籍信息!`);
            }
        } catch (error) {
            logger.error(`管理员更新书籍章节出错:${new Error(error)}`);
            return result.failed(error);
        }
    }
};
