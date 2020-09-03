/**
 * 网站信息服务类
 */
const result = require(':lib/Result');
// const config = require(':config/server.base.config'); //配置文件
const redis = require(':lib/redis'); //redis
const { MODELS_PATH, getRandomNum } = require(':lib/Utils');
const { BiuDB } = require(':lib/sequelize');
const BookBaseModel = BiuDB.import(`${MODELS_PATH}/books/BookBaseModel`);
module.exports = class {
    /**
     * 获取移动端首页的数据（无需token）
     * @param {*} param0
     * @description 需要返回如下:
     * 1.轮播图推荐 2.用户的书架(待定) 3.随机推荐 4.热门推荐 5.最新推荐
     */
    async getHomeMobileData(user) {
        try {
            const homeData = await redis.getData(redis.key.GET_HOME_MOBILE_DATA);
            if (homeData) return result.success(homeData);
            //轮播
            const banner = [];
            //用户的书架
            const query = {
                limit: 10,
                offset: 0,
                where: { isDelete: false },
                order: [
                    ['createdTime', 'DESC']
                ],
                attributes: { exclude: ['sourceName', 'sourceUrl', 'remark', 'isDelete'] }
            };
            //最新推荐
            const { rows, count } = await BookBaseModel.findAndCountAll(query);
            //热门推荐
            query.order = [['readCount', 'DESC']];
            const hots = BookBaseModel.findAndCountAll(query);
            //随机推荐
            query.order = [];
            query.limit = 100;
            const randoms = BookBaseModel.findAndCountAll(query);
            const anyRes = await Promise.all([randoms, hots]);
            let randomArray = [];
            for (let i = 0; i < count; i++) {
                const index = getRandomNum(0, anyRes[0].count - 1);
                const book = anyRes[0].rows[index];
                if (randomArray.length >= 10) break;
                if (randomArray.indexOf(book) === -1) randomArray.push(book);
            }
            const res = {
                banner,
                randoms: randomArray,
                news: rows,
                hots: anyRes[1].rows
            };
            //首页数据10分钟更新一次
            redis.setData(redis.key.GET_HOME_MOBILE_DATA, res, 60 * 10);
            return result.success(null, res);
        } catch (error) {
            console.error(error);
            return result.failed(error);
        }
    }

    /**
     * 获取书籍分类
     * @param {*} user
     */
    async getBookTypeData(user) {
        try {
            const SQL = `select distinct type,pinyin from ${BookBaseModel.getTableName()}`;
            const res = await BiuDB.query(SQL, { type: BiuDB.QueryTypes.SELECT });
            return result.success(null, res);
        } catch (error) {
            console.error(error);
            return result.failed(error);
        }
    }

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
            console.error(error);
            return result.failed(error);
        }
    }
};
