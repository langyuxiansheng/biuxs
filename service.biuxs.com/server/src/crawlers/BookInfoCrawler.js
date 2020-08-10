/**
 * 书籍的详情信息采集爬虫
 */
const http = require('superagent');
const tr = require('transliteration'); //分类拼音
const { logger } = require(':lib/logger4'); //日志系统
const redis = require(':lib/redis'); //redis
const utils = require(':lib/Utils');
require('superagent-proxy')(http);
require('superagent-charset')(http);
const cheerio = require('cheerio');
const schedule = require('node-schedule');
const userAgents = require(':lib/userAgents');
const { MODELS_PATH } = require(':lib/Utils');
const { BiuDB } = require(':lib/sequelize');
const TasksModel = BiuDB.import(`${MODELS_PATH}/crawlers/TasksModel`);
const ConfigBaseModel = BiuDB.import(`${MODELS_PATH}/common/ConfigBaseModel`);
const BookBaseModel = BiuDB.import(`${MODELS_PATH}/book/BookBaseModel`);
const BookChapterModel = BiuDB.import(`${MODELS_PATH}/book/BookChapterModel`);
const BookArticleModel = BiuDB.import(`${MODELS_PATH}/book/BookArticleModel`);
module.exports = class BookBaseCrawler {
    constructor(pathname, typeId) {
        this.count = 0;
        // BookBaseModel.sync().then((res) => {
        //     console.log(`BookBaseModel 同步成功`, res);
        // });
        BookChapterModel.sync().then((res) => {
            console.log(`BookChapterModel 同步成功`, res);
        });
        BookArticleModel.sync().then((res) => {
            console.log(`BookArticleModel 同步成功`, res);
        });
    }

    init() {
        this.getTasks({});
    }

    start() {
        //在每小时的30分运行定时任务
        /**
        * 如果仅仅设置了hour，定时任务并不会如期望的一样在每小时的0分时运行，而是每分钟都会运行！！！
        * 因此，如果你希望在每小时的固定分钟运行，就一定要设置minute！！！
        */
        //通过数组在多个时刻运行
        //rule.minute = [10,20,30];
        const time = utils.getRandomNum(0, 59);
        this.RULE = this.__getScheduleJobRule(time, time);
        schedule.scheduleJob(this.RULE, () => {
            console.log('定时抓取新浪微博的热搜词:' + new Date());
            this.RULE = this.__getScheduleJobRule(time, time);
        });
    }

    /**
    * 获取规则
    * @param {*} min
    * @param {*} sec
    */
    __getScheduleJobRule(min = 2, sec = 4) {
        let rule = new schedule.RecurrenceRule();
        rule.hour = [];
        for (let h = 0; h < 24; h++) {
            if (h % 2) {
                rule.hour.push(h);
            }
        }
        rule.second = sec;
        rule.minute = min;
        return rule;
    }

    /**
     * 获取请求头
     * @param {*} host
     */
    __getRequestHeaders(host) {
        return {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Cache-Control': 'max-age=0',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': userAgents,
            'Host': host
        };
    }

    /**
     * 获取任务列表
     * @param {*} param0 page 第1页，每次2条
     */
    async getTasks({ page = 1, limit = 2 }) {
        let queryData = {
            where: { isDelete: false, status: 1 },
            order: [
                ['createdTime', 'ASC']
            ],
            attributes: { exclude: ['isDelete'] }
        };
        //分页
        if (page && limit) {
            queryData.offset = Number((page - 1) * limit); //开始的数据索引
            queryData.limit = Number(limit); //每页限制返回的数据条数
        };
        try {
            const { rows, count } = await TasksModel.findAndCountAll(queryData);
            const taskCount = rows.length;
            if (taskCount) {
                logger.info(`本次执行任务:${taskCount}条,总任务:${count}条`);
                Promise.all(rows.map((task) => {
                    return this.getTaskAndConfig(task);
                })).then((res) => {
                    const success = res.filter(item => item).length;
                    const failed = res.filter(item => !item).length;
                    logger.info(`本次执行的任务:${res.length}条,成功:${success}条,失败:${failed}条`, JSON.stringify(rows));
                });
            } else {
                logger.warn(`没有需要执行的任务列表:`, rows);
            }
        } catch (error) {
            logger.error(`任务执行出错:${JSON.stringify(error)}`);
        }
    }

    /**
     * 获取任务信息和配置信息
     * @param page
     */
    async getTaskAndConfig(task) {
        try {
            //优先读取缓存
            const ccb = await redis.getData(task.configId);
            if (ccb) return await this.getBookInfo(task, ccb.conf);
            //再次读取数据库
            const cb = await ConfigBaseModel.findOne({ where: { isDelete: false, configId: task.configId } });
            if (cb) {
                redis.setData(task.configId, cb);
                return await this.getBookInfo(task, cb.conf);
            };
            logger.error(`没有相关的配置项`);
        } catch (error) {
            logger.error(`抓取站点的分类信息出错:`, JSON.stringify(error));
        }
        return null;
    }

    /**
    * 获取书籍的详情信息
    * @param {*} baseURL
    * @param {*} param1
    * @description 这里需要采集书籍的基本信息和章节信息 不包含章节的内容
    * 1.脏数据类最后在来统一剔除，如内容中包含"内容简介："等文字
    */
    async getBookInfo(task, { base, info }) {
        const headers = this.__getRequestHeaders(base.host); //获取请求头
        try {
            TasksModel.update({ status: 2 }, { where: { taskId: task.taskId } });
            logger.info(`============================================抓取开始 ${task.name}-${task.url} BEGIN================================================`);
            const { status, text } = await http.get(`${task.url}`).set(headers).timeout(base.timeout).charset(base.charset).buffer(true);
            let book = null;
            if (status == 200) {
                const $ = cheerio.load(text, { decodeEntities: false }); //decodeEntities 设置了某些站点不会出现乱码
                //抓取书籍的详情
                const title = $(info.titleSelector).text().trim(); //书本名称
                const author = $(info.authorSelector).text().trim(); //作者名
                const brief = $(info.briefSelector).text().replace(new RegExp('内容简介：'), '').trim(); //书本简介
                const image = $(info.imageSelector).attr('src') || null;//图片地址
                const type = task.name.split(']-[')[1]; //书本分类
                const pinyin = tr.slugify(type).replace(/-/g, ''); //书本分类拼音
                const letterCount = 0; //总字数
                const chapterCount = 0; //总章节数
                const readCount = 0; //阅读总数
                const tags = type; //小说标签
                const status = 2; //状态 1完本 2连载 3已下架(默认都为)
                const sourceName = base.title; //来源名称
                const sourceUrl = task.url; //来源地址
                const remark = `初次抓取${task.name}-${task.url}`;
                book = { title, author, brief, type, pinyin, letterCount, chapterCount, readCount, tags, status, sourceName, sourceUrl, image, remark };
                const bookId = await this.saveBookInfoData(book, task);
                if (bookId) { //如果书籍是新抓取的就进行章节抓取
                    console.log(bookId);
                    const chapterList = [];
                    $(info.chapterListSelector).find(info.itemSelector).each((index, el) => {
                        const t = $(el).find(info.chapterNameSelector).text().split('章');
                        chapterList.push({
                            bookId,
                            title: t.length > 1 ? `第${index + 1}章 ${t[1].trim()}` : $(el).find(info.chapterNameSelector).text(), //获取章节标题   new RegExp(`[第(.*?)章|第(.*?)回|第(.*?)集|第(.*?)卷|第(.*?)部|第(.*?)篇|第(.*?)节|第(.*?)季]`, 'g')
                            url: $(el).find(info.contentUrlSelector).attr('href').trim(), //获取章节内容采集地址链接
                            type: 1, //任务采集类型 1分类 2书籍 3章节 4内容
                            status: 2, //状态 1已完成内容抓取  2未完成内容抓取 3抓取内容失败
                            remark: `初次抓取章节`
                        });
                    });
                    if (chapterList.length) {
                        this.saveBookChapterData(chapterList, bookId, task);
                    } else {
                        logger.info(`未抓取到相关章节!,${task.url}`);
                    }
                }
            }
            logger.info(`============================================抓取结束 ${task.name}-${task.url} END================================================`);
            return book;
        } catch (error) {
            TasksModel.update({ status: 3 }, { where: { taskId: task.taskId } });
            logger.error(`${task.name}-${task.url}抓取错误!`, JSON.stringify(error));
            return null;
        }
    }

    /**
     * 保存数据
     * @param {*} list
     */
    async saveBookInfoData(book) {
        let bookId = null;
        try {
            const count = await BookBaseModel.count({
                where: { title: book.title, author: book.author, isDelete: false }
            });
            if (count) { //查询数据库已有的数据
                logger.info(`书籍:${book.title}已存在`);
            } else {
                const res = await BookBaseModel.create(book);
                logger.info(`本次保存书籍:${book.title}`);
                bookId = res && res.bookId;
            }
        } catch (error) {
            logger.error(`保存书籍出错:${book.title}出错,${JSON.stringify(error)}`);
        }
        return bookId;
    }

    /**
     * 保存章节数据
     * @param {*} list
     */
    async saveBookChapterData(list, bookId, task) {
        try {
            const datas = await BookChapterModel.findAll({
                where: { bookId, isDelete: false }
            });
            if (datas && datas.length) { //查询数据库已有的数据
                for (let i in datas) {
                    for (let j in list) {
                        if (datas[i].title === list[j].title) { //检测任务是否重复
                            list.splice(j, 1); //删除数组中的重复数据
                        }
                    }
                }
            }
            if (list && list.length) {
                const res = await BookChapterModel.bulkCreate(list);
                logger.info(`本次保存: ${res.length} 条章节`);
                //只有完成了章节抓取的才算完成了任务
                TasksModel.update({ status: 4 }, { where: { taskId: task.taskId } });
            }
            return true;
        } catch (error) {
            logger.error(`章节数据保存出错:${JSON.stringify(error)}`);
            return false;
        }
    }
};
