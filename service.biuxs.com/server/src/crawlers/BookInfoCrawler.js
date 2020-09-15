/**
 * 书籍的详情信息采集爬虫
 */
const http = require('superagent');
const tr = require('transliteration'); //分类拼音
const { taskLog } = require(':lib/logger4'); //日志系统
const redis = require(':lib/redis'); //redis
require('superagent-proxy')(http);
require('superagent-charset')(http);
const cheerio = require('cheerio');
const userAgents = require(':lib/userAgents');
const FileUtils = require(':lib/FileUtils');
const { MODELS_PATH } = require(':lib/Utils');
const { BiuDB } = require(':lib/sequelize');
const TasksModel = BiuDB.import(`${MODELS_PATH}/crawlers/TasksModel`);
const ConfigBaseModel = BiuDB.import(`${MODELS_PATH}/common/ConfigBaseModel`);
const BookBaseModel = BiuDB.import(`${MODELS_PATH}/books/BookBaseModel`);
const BookChapterModel = BiuDB.import(`${MODELS_PATH}/books/BookChapterModel`);
const BookArticleModel = BiuDB.import(`${MODELS_PATH}/books/BookArticleModel`);
module.exports = class BookBaseCrawler {
    constructor(pathname, typeId) {
        this.count = 0;
        BookBaseModel.sync().then((res) => {
            console.log(`BookBaseModel 同步成功`, res);
        });
        BookChapterModel.sync().then((res) => {
            console.log(`BookChapterModel 同步成功`, res);
        });
        BookArticleModel.sync().then((res) => {
            console.log(`BookArticleModel 同步成功`, res);
        });
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
     * @param {*} param0 page 第1页，每次2条 status = 任务类型和状态
     */
    async getTasks({ page = 1, limit = 5, status = 1 }) {
        let queryData = {
            where: { isDelete: false, status },
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
                taskLog.info(`本次执行任务:${taskCount}条,总任务:${count}条`);
                return Promise.all(rows.map((task) => {
                    return this.runTask(task);
                })).then((res) => {
                    const success = res.filter(item => item).length;
                    const failed = res.filter(item => !item).length;
                    taskLog.info(`本次执行的任务:${res.length}条,成功:${success}条,失败:${failed}条`, JSON.stringify(rows));
                });
            } else {
                taskLog.warn(`没有需要执行的任务列表:`, rows);
            }
        } catch (error) {
            taskLog.error(`任务执行出错:${new Error(error)}`);
        }
    }

    /**
     * 运行基础任务抓取书籍的基本信息
     * @param page
     */
    async runTask(task) {
        try {
            const config = await this.getConfigById(task);
            if (config) return await this.getBookInfo(task, config.conf);
            taskLog.error(`没有相关的配置项`);
        } catch (error) {
            taskLog.error(`抓取站点的分类信息出错:`, new Error(error));
        }
        return null;
    }

    /**
     * 运行抓取章节内容任务
     * @param page
     */
    async runArticleTask(chapter) {
        try {
            const config = await this.getConfigById(chapter);
            if (config) return await this.getChapterArticle(chapter, config.conf);
            taskLog.error(`没有相关的配置项`);
        } catch (error) {
            taskLog.error(`抓取章节内容出错:`, new Error(error));
        }
        return null;
    }

    /**
     * 获取配置项
     * @param page
     */
    async getConfigById({ configId }) {
        let config = null;
        try {
            //优先读取缓存
            config = await redis.getData(configId);
            if (config) return config;
            //再次读取数据库
            config = await ConfigBaseModel.findOne({ where: { isDelete: false, configId } });
            if (config) {
                redis.setData(configId, config);
                return config;
            };
            taskLog.error(`没有相关的配置项`);
        } catch (error) {
            taskLog.error(`获取配置项出错:`, new Error(error));
        }
        return config;
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
            taskLog.info(`============================================抓取开始 ${task.name}-${task.url} BEGIN================================================`);
            const { status, text } = await http.get(`${task.url}`).set(headers).timeout(base.timeout).charset(base.charset).buffer(true);
            let book = null;
            if (status == 200) {
                const $ = cheerio.load(text, { decodeEntities: false }); //decodeEntities 设置了某些站点不会出现乱码
                //抓取书籍的详情
                const title = task.name.split('-')[2].replace(/[/[|\]]/g, '') || $(info.titleSelector).text(); //书本名称
                const author = $(info.authorSelector).text(); //作者名
                const brief = $(info.briefSelector).text(); //书本简介
                const image = $(info.imageSelector).attr('src') || null;//图片地址
                const type = task.name.split(']-[')[1]; //书本分类
                const pinyin = tr.slugify(type).replace(/-/g, ''); //书本分类拼音
                const letterCount = 0; //总字数
                const chapterCount = 0; //总章节数
                const readCount = 0; //阅读总数
                const tags = type; //小说标签
                const configId = task.configId;
                const status = 2; //状态 1完本 2连载 3已下架(默认都为)
                const sourceName = base.title; //来源名称
                const sourceUrl = task.url; //来源地址
                const remark = `初次抓取${task.name}-${task.url}`;
                book = {
                    title: title && title.trim() || null,
                    author: author && author.replace(new RegExp(`作者：|(作者)`, 'g'), '').trim() || null,
                    brief: brief && brief.replace(new RegExp(`内容简介：`, 'g'), '').trim() || null,
                    sourceImage: image && image.indexOf('http') != -1 ? image : `${base.protocol}${base.host}${image}`,
                    type,
                    pinyin,
                    letterCount,
                    chapterCount,
                    readCount,
                    tags,
                    status,
                    configId,
                    sourceName,
                    sourceUrl,
                    remark
                };
                const bookInfo = await this.saveBookInfoData(book, task);
                if (bookInfo) { //如果书籍是新抓取的就进行章节抓取
                    const { image, bookId } = bookInfo;
                    if (!image) {
                        FileUtils.downloadImageToLocal({ imageUrl: book.sourceImage }).then((file) => {
                            //更新图片
                            file && BookBaseModel.update({ image: file.path }, { where: { bookId } });
                        }).catch((err) => {
                            taskLog.error(`${book.title}-${task.url}图片下载错误!`, new Error(err));
                        });
                    }
                    //获取章节列表
                    this.getBookChapterList($, { bookId, configId, base, info }).then((res) => {
                        //只有完成了章节抓取的才算完成了任务
                        res && TasksModel.update({ status: 4, remark: `抓取章节内容` }, { where: { taskId: task.taskId } });
                    }).catch((error) => {
                        taskLog.error(`抓取章节列表错误!`, new Error(error));
                    });
                }
            }
            taskLog.info(`============================================抓取结束 ${task.name}-${task.url} END================================================`);
            return book;
        } catch (error) {
            TasksModel.update({ status: 3 }, { where: { taskId: task.taskId } });
            taskLog.error(`${task.name}-${task.url}抓取错误!`, new Error(error));
            return null;
        }
    }

    /**
    * 更新章节
    * @param {*} baseURL
    * @param {*} param1
    * @description 这里只采集书籍章节列表
    */
    async refreshBookChapterList({ title, bookId, sourceUrl, configId }) {
        let res = 0;
        try {
            const { conf: { base, info } } = await this.getConfigById({ configId });
            const headers = this.__getRequestHeaders(base.host); //获取请求头
            taskLog.info(`============================================更新抓取开始 ${title}-${sourceUrl} BEGIN================================================`);
            const { status, text } = await http.get(`${sourceUrl}`).set(headers).timeout(base.timeout).charset(base.charset).buffer(true);
            if (status == 200) {
                const $ = cheerio.load(text, { decodeEntities: false }); //decodeEntities 设置了某些站点不会出现乱码
                res = await this.getBookChapterList($, { bookId, configId, base, info });
            }
            taskLog.info(`============================================更新抓取结束 ${title}-${sourceUrl} END================================================`);
        } catch (error) {
            taskLog.error(`${title}-${sourceUrl}抓取错误!`, new Error(error));
        }
        return res;
    }

    /**
     * 抓取章节列表
     * @param {*} $
     * @param {*} param1
     */
    async getBookChapterList($, { bookId, configId, base, info }) {
        let res = 0;
        try {
            const replaceRule = `、|(.*章：)|(.\\d：)|\\d|\\.|(第.*章)|（(.*)?）`;
            const chapterList = [];
            $(info.chapterListSelector).find(info.itemSelector).each((index, el) => {
                const t = $(el).find(info.chapterNameSelector).text();
                const url = $(el).find(info.contentUrlSelector).attr('href');
                if (t && url) {
                    chapterList.push({
                        bookId,
                        configId,
                        index: index + 1,
                        title: t && t.replace(new RegExp(replaceRule, 'g'), '').trim() || null, //获取章节标题
                        url: url && url.indexOf('http') != -1 ? url.trim() : `${base.protocol}${base.host}${url}`.trim(), //获取章节内容采集地址链接
                        type: 1, //任务采集类型 1分类 2书籍 3章节 4内容
                        status: 2, //1已完成内容抓取  2未完成内容抓取 3抓取内容失败
                        remark: `初次抓取章节`
                    });
                } else {
                    taskLog.info(`检测到空章节!`);
                }
            });
            if (chapterList.length) {
                res = await this.saveBookChapterData(chapterList, bookId);
            } else {
                taskLog.info(`未抓取到相关章节!`);
            }
        } catch (error) {
            taskLog.error(`抓取章节列表错误!`, new Error(error));
        }
        return res;
    }

    /**
    * 获取章节的详情内容信息
    * @param {*} chapter 章节对象
    * @param {*} { base, info } 配置信息
    * @description 这里需要采集章节的内容部分
    */
    async getChapterArticle(chapter, { base, info }) {
        const headers = this.__getRequestHeaders(base.host); //获取请求头
        let article = null;
        try {
            taskLog.info(`============================================抓取开始 ${chapter.title}-${chapter.url} BEGIN================================================`);
            const { status, text } = await http.get(`${chapter.url}`).set(headers).timeout(base.timeout).charset(base.charset).buffer(true);
            if (status == 200) {
                const $ = cheerio.load(text, { decodeEntities: false }); //decodeEntities 设置了某些站点不会出现乱码
                const articleId = chapter.chapterId; //内容id同章节id
                const bookId = chapter.bookId; //书籍id
                //抓取章节的内容详情
                const title = chapter.title; //书本名称
                const content = $(info.contentSelector).text().trim();
                const letterCount = content && content.length; //总字数
                const status = 1; //状态 1正常(默认都为)
                const remark = `初次抓取${title}-${chapter.url}`;
                article = await this.saveChapterArticleData({
                    articleId,
                    title,
                    content,
                    // content content ? content.replace(new RegExp(info.contentReplace,'g'),'') : content,
                    letterCount,
                    status,
                    bookId,
                    remark
                });
            }
            taskLog.info(`============================================抓取结束 ${chapter.title}-${chapter.url} END================================================`);
        } catch (error) {
            taskLog.error(`${chapter.title}-${chapter.url}抓取错误!`, new Error(error));
        }
        return article;
    }

    /**
     * 保存数据
     * @param {*} list
     */
    async saveBookInfoData(book) {
        let bookInfo = null;
        try {
            bookInfo = await BookBaseModel.findOne({
                where: { title: book.title, author: book.author, isDelete: false }
            });
            if (bookInfo) { //查询数据库已有的数据
                taskLog.info(`书籍:${book.title}已存在`);
                return bookInfo;
            } else {
                bookInfo = await BookBaseModel.create(book);
                taskLog.info(`本次保存书籍:${book.title}`);
            }
        } catch (error) {
            taskLog.error(`保存书籍出错:${book.title}出错,${new Error(error)}`);
        }
        return bookInfo;
    }

    /**
     * 保存章节数据
     * @param {*} list
     * @returns 本地保存的章节数
     */
    async saveBookChapterData(list, bookId) {
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
                BiuDB.transaction(async(t) => {
                    const res = await BookChapterModel.bulkCreate(list, { transaction: t });
                    taskLog.info(`本次保存: ${res.length} 条章节`);
                    //同步更新书籍基本信息的章节总数
                    const chapterCount = await BookChapterModel.count({ where: { bookId, isDelete: false }, transaction: t });
                    //计算总字数
                    const letterCount = await BookArticleModel.count({ where: { bookId, isDelete: false }, col: ['letterCount'], transaction: t });
                    return BookBaseModel.update({ chapterCount, letterCount }, { where: { bookId }, transaction: t });
                });
            }
            return list.length;
        } catch (error) {
            taskLog.error(`章节数据保存出错:${new Error(error)}`);
            return 0;
        }
    }

    /**
     * 保存内容数据
     * @param {*} content
     */
    async saveChapterArticleData(article) {
        try {
            const res = await BookArticleModel.create(article);
            if (res && res.articleId) {
                taskLog.info(`本次保存: ${article}-${article.content}`);
                await BookChapterModel.update({ status: 1 }, { where: { chapterId: res.articleId } });
            }
            return res;
        } catch (error) {
            taskLog.error(`章节内容数据保存出错:${new Error(error)}`);
            return null;
        }
    }
};
