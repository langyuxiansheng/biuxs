/**
 * 书籍相关服务类
 */
const result = require(':lib/Result');
const { logger } = require(':lib/logger4'); //日志系统
const { MODELS_PATH, isSuperAdmin } = require(':lib/Utils');
const { SOP, BiuDB } = require(':lib/sequelize');
const BookBaseModel = BiuDB.import(`${MODELS_PATH}/book/BookBaseModel`);
const BookChapterModel = BiuDB.import(`${MODELS_PATH}/book/BookChapterModel`);
const BookArticleModel = BiuDB.import(`${MODELS_PATH}/book/BookArticleModel`);
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
            //查询账号是否存在
            const { rows, count } = await BookBaseModel.findAndCountAll(queryData);
            return result.success(null, { list: rows, total: count });
        } catch (error) {
            logger.error(`管理员获取书籍列表出错:${JSON.stringify(error)}`);
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
            //批量软删除
            const del = { where: { bookId: ids } };
            await BiuDB.transaction(async(t) => {
                //同步删除书籍 章节 和章节内容表
                await BookBaseModel.destroy(del, { transaction: t });
                await BookChapterModel.destroy(del, { transaction: t });
                return BookArticleModel.destroy(del, { transaction: t });
            });
            return result.success();
        } catch (error) {
            logger.error(`管理员删除书籍出错:${JSON.stringify(error)}`);
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
            logger.error(`管理员修改书籍出错:${JSON.stringify(error)}`);
            return result.failed(error);
        }
    }
};
