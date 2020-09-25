/**
 * 网站信息服务类
 */
const result = require(':lib/Result');
const redis = require(':lib/redis'); //redis
const SnowflakeID = require(':lib/SnowflakeID'); //redis
const { logger } = require(':lib/logger4'); //日志系统
const { MODELS_PATH, getRandomNum } = require(':lib/Utils');
const { BiuDB, SOP } = require(':lib/sequelize');
const BookBaseModel = BiuDB.import(`${MODELS_PATH}/books/BookBaseModel`);
const BannerBaseModel = BiuDB.import(`${MODELS_PATH}/common/BannerBaseModel`);
const snid = new SnowflakeID({ mid: 13134646 });
module.exports = class {
    /**
     * 获取移动端首页的数据（无需token）
     * @param {*} param0
     * @description 需要返回如下:
     * 1.轮播图推荐 2.用户的书架(待定) 3.随机推荐 4.热门推荐 5.最新推荐
     */
    async getHomeMobileData(user) {
        try {
            let test = {};
            for (let index = 0; index < 500; index++) {
                let id = snid.generate();
                test[index] = id;
                test[`n${index}`] = Number(id);
            }
            const homeData = await redis.getData(redis.key.GET_HOME_MOBILE_DATA);
            if (homeData) {
                homeData.test = test;
                return result.success(null, homeData);
            }
            //轮播
            const banner = BannerBaseModel.findAll({
                where: {
                    status: 1,
                    isDelete: false
                },
                order: [
                    ['sort', 'ASC']
                ],
                attributes: ['title', 'image', 'link', 'type', 'status', 'expiration']
            });
            const query = {
                limit: 10,
                offset: 0,
                where: {
                    isDelete: false,
                    image: {
                        [SOP.ne]: null
                    }
                },
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
            const anyRes = await Promise.all([randoms, hots, banner]);
            let randomArray = [];
            for (let i = 0; i < count; i++) {
                const index = getRandomNum(0, anyRes[0].count - 1);
                const book = anyRes[0].rows[index];
                if (randomArray.length >= 10) break;
                if (randomArray.indexOf(book) === -1 && book && book.image && (book.image !== '/books/20200915/BIUXS_WEB_16979232C79D5E3C78D490F902E69AF2.jpg')) {
                    randomArray.push(book);
                }
            }
            const res = {
                banner: [],
                randoms: randomArray,
                news: rows,
                hots: anyRes[1].rows
            };
            //处理轮播图
            if (anyRes[2] && anyRes[2].length) {
                let time = Date.parse(new Date()) / 1000;
                res.banner = anyRes[2].filter((item) => {
                    return !item.expiration || (item.expiration - time > 0);
                });
            }
            //首页数据60分钟更新一次
            redis.setData(redis.key.GET_HOME_MOBILE_DATA, res, 60 * 60);
            return result.success(null, res);
        } catch (error) {
            logger.error(`获取移动端首页的数据出错:${new Error(error)}`);
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
            logger.error(`获取书籍分类出错:${new Error(error)}`);
            return result.failed(error);
        }
    }

    /**
     * 搜索书籍
     * @param {*} type 搜索类型: 1站内  2站外,
     * @param {*} keyword 关键字: 作者名 或者 书籍名
     * @param {*} sourceId 来源ID: 站点源ID
     * @param {*} page 分页参数 页码
     * @param {*} limit 分页参数 数据大小
     * @param {*} user
     */
    async searchBook({ type, keyword, sourceId, page, limit }, user) {
        try {
            if (!type || !keyword) return result.paramsLack();
            if (type == 1) { //站内搜索
                const query = {
                    limit: 10,
                    offset: 0,
                    where: {
                        isDelete: false,
                        [SOP.or]: [
                            { title: { [SOP.like]: `%${keyword}%` } },
                            { author: { [SOP.like]: `%${keyword}%` } }
                        ]
                    },
                    order: [
                        ['createdTime', 'DESC']
                    ],
                    attributes: { exclude: ['sourceName', 'sourceUrl', 'remark', 'isDelete'] }
                };
                //分页
                if (page && limit) {
                    query.offset = Number((page - 1) * limit); //开始的数据索引
                    query.limit = Number(limit); //每页限制返回的数据条数
                };
                const { rows, count } = await BookBaseModel.findAndCountAll(query);
                return result.success(null, { list: rows, total: count });
            }
            return result.success(null);
        } catch (error) {
            logger.error(`获取书籍分类出错:${new Error(error)}`);
            return result.failed(error);
        }
    }
};
