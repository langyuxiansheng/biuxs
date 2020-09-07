/**
 * 书籍的基本信息采集爬虫
 */
const http = require('superagent');
const result = require(':lib/Result');
// const tr = require('transliteration'); //分类拼音
const { taskLog } = require(':lib/logger4'); //日志系统
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
module.exports = class BookBaseCrawler {
    constructor(pathname, typeId) {
        this.count = 0;
        TasksModel.sync().then((res) => {
            console.log(`TasksModel 同步成功`, res);
        });
    }

    /**
     * 抓取初始化
     * @param {*} param0
     */
    async init({ code }) {
        try {
            const cb = await ConfigBaseModel.findOne({ where: { isDelete: false, code } });
            //创建异步同时抓取多个分类
            if (cb) {
                const { conf } = cb;
                const crawlers = conf.types.map((config) => {
                    config.configId = cb.configId;
                    return this.getBookTypeBase(conf.base, config, config.page);
                });
                Promise.all(crawlers).then((res) => {
                    console.log(`抓取完成!`, res);
                });
            } else {
                taskLog.error(`没有相关的配置项`);
            }
        } catch (error) {
            taskLog.error(`抓取站点的分类信息出错:`, new Error(error));
        }
    }

    /**
     * 运行任务
     * @param {*} param0
     */
    async runTaskByConfigId({ configId }) {
        try {
            const isRunTask = await redis.getData(`${redis.key.RUN_TASK_BY_CONFIG_ID}${configId}`);
            if (isRunTask) {
                taskLog.error(`任务:${configId}进行中!`);
                return result.failed('任务进行中!');
            }
            const cb = await ConfigBaseModel.findOne({ where: { isDelete: false, configId } });
            //创建异步同时抓取多个分类
            if (cb) {
                redis.setData(`${redis.key.RUN_TASK_BY_CONFIG_ID}${configId}`, true, 60 * 60 * 2);
                const { conf } = cb;
                const crawlers = conf.types.map((config) => {
                    config.configId = cb.configId;
                    return this.getBookTypeBase(conf.base, config, config.page);
                });
                Promise.all(crawlers).then((res) => {
                    console.log(`抓取完成!`, res);
                    redis.delData(`${redis.key.RUN_TASK_BY_CONFIG_ID}${configId}`);
                });
            } else {
                taskLog.error(`没有相关的配置项`);
            }
        } catch (error) {
            taskLog.error(`抓取站点的分类信息出错:`, new Error(error));
            redis.delData(`${redis.key.RUN_TASK_BY_CONFIG_ID}${configId}`);
        }
        return result.success();
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
            taskLog.info(`定时抓取`, +new Date());
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
    * 分类抓取
    * @param {*} config 配置项
    * @param {*} page 开始页数
    * @description 1抓取后存入任务表,进行异步抓取
    */
    async getBookTypeBase(baseConf, config, page = 1, max = 1000) {
        const headers = this.__getRequestHeaders(baseConf.host); //获取请求头
        const params = config.params.replace('[page]', page); //替换url中的分页参数
        const baseURL = `${baseConf.protocol}${baseConf.host}${params}`;
        let count = 0;
        try {
            taskLog.info(`============================================抓取开始 ${baseURL}-${baseConf.title}-${config.title}-${page}-${max} BEGIN================================================`);
            const { status, text } = await http.get(`${baseURL}`).set(headers).timeout(baseConf.timeout).charset(baseConf.charset).buffer(true);
            const list = [];
            if (status == 200) {
                const $ = cheerio.load(text, { decodeEntities: false }); //decodeEntities 设置了某些站点不会出现乱码
                $(baseConf.listSelector).find(baseConf.itemSelector).each((index, el) => {
                    const url = $(el).find(baseConf.href).attr('href').trim();
                    list.push({
                        configId: config.configId,
                        website: baseConf.title, //站点名称
                        domain: `${baseConf.protocol}${baseConf.host}`, //域名地址
                        name: `抓取[${baseConf.title}]-[${config.title}]-[${$(el).find(baseConf.name).text().trim()}]`, //任务名称
                        url: url && url.indexOf('http') != -1 ? url : `${baseConf.protocol}${baseConf.host}${url}`, //获取采集地址链接
                        type: 1, //任务采集类型 1分类 2书籍 3章节 4内容
                        status: 1, //状态(1未开始 2进行中 3未完成 4已完成)
                        remark: `建立抓取任务 ${baseURL}-${baseConf.title}-${config.title}`
                    });
                });
            }
            if (list.length && page <= max) {
                console.log(list);
                this.saveData(config, list);
                page++;
                //抓取间隔1-10S
                const time = utils.getRandomNum(1000, 10000);
                taskLog.info(`抓取间隔 ${time} ms`);
                setTimeout(() => {
                    this.getBookTypeBase(baseConf, config, page, max);
                }, time);
            }
            taskLog.info(`=============================================抓取结束 ${baseURL}-${baseConf.title}-${config.title}-${page}-${max} END=================================================`);
            return list;
        } catch (error) {
            taskLog.error(`${baseURL}-${baseConf.title}-${config.title}抓取错误!`, new Error(error));
            count++;
            if (count <= 3) {
                taskLog.error(`${baseURL}-${baseConf.title}-${config.title} 错误重试:${count}次!`, new Error(error));
                return this.getBookTypeBase(baseConf, config, page, max);
            }
        }
        return null;
    }

    /**
     * 保存数据
     * @param {*} list
     */
    async saveData(config, list) {
        try {
            const datas = await TasksModel.findAll({
                where: { configId: config.configId, isDelete: false }
            });
            if (datas && datas.length) { //查询数据库已有的数据
                for (let i in datas) {
                    for (let j in list) {
                        if (datas[i].name === list[j].name) { //检测任务是否重复
                            list.splice(j, 1); //删除数组中的重复数据
                        }
                    }
                }
            }
            if (list && list.length) {
                await TasksModel.bulkCreate(list);
                const length = list.length;
                this.count += length;
                console.log(`本次保存: ${length} 条任务,本次共计保存: ${this.count} 条任务`);
            }
            return true;
        } catch (error) {
            console.log(`任务数据保存出错`, error);
            return false;
        }
    }

    /**
     * 运行站外搜索任务
     * @param page
     */
    async runOutSiteSearchTask({ configId }, query) {
        try {
            const config = await this.getConfigById({ configId });
            if (config) return await this.search(config, query);
        } catch (error) {
            taskLog.error(`获取站外搜索配置出错:`, new Error(error));
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

    async outSiteSearch({ configId, conf: { searchs, base } }, { keyword, page }) {
        const headers = this.__getRequestHeaders(base.host); //获取请求头
        // const params = config.params.replace('[page]', page); //替换url中的分页参数
        // const baseURL = `${baseConf.protocol}${baseConf.host}${params}`;
        const search = {
            'url': 'https://www.quanben.net/s.php',
            'method': 'get',
            'body': null, //
            'params': 'keyword=[keyword]&page=[1]',
            'listSelector': '#container tbody',
            'itemSelector': 'tr:not(:first-child)',
            'nameSelector': 'td:nth-child(1) a',
            'authorSelector': 'td:nth-child(2) a',
            'typeSelector': null,
            'detailUrlSelector': 'td:nth-child(1) a'
        };
        try {
            taskLog.info(`============================================站外搜索开始 ${search.url}-${base.title}-${keyword} BEGIN================================================`);
            let res = null;
            if (search.method.toLocaleLowerCase == 'get') {
                res = await http.get(`${search.url}?${search.query}`).set(headers).timeout(base.timeout).charset(base.charset).buffer(true);
            } else {
                res = await http.post(search.url).send(search.body).set(headers).timeout(base.timeout).charset(base.charset).buffer(true);
            }
            const list = [];
            if (res && res.status == 200) {
                const $ = cheerio.load(res.text, { decodeEntities: false }); //decodeEntities 设置了某些站点不会出现乱码
                $(search.listSelector).find(search.itemSelector).each((index, el) => {
                    const url = $(el).find(search.detailUrlSelector).attr('href').trim();
                    const name = $(el).find(search.nameSelector).text().trim();
                    console.log(url, name);
                    const data = {
                        configId: configId,
                        website: base.title, //站点名称
                        domain: `${base.protocol}${base.host}`, //域名地址
                        // name: `抓取[${base.title}]-[${name}]-[${$(el).find(baseConf.name).text().trim()}]`, //任务名称
                        // url: url && url.indexOf('http') != -1 ? url : `${baseConf.protocol}${baseConf.host}${url}`, //获取采集地址链接
                        type: 1, //任务采集类型 1分类 2书籍 3章节 4内容
                        status: 1 //状态(1未开始 2进行中 3未完成 4已完成)
                        // remark: `建立抓取任务 ${baseURL}-${baseConf.title}-${config.title}`
                    };
                    //[全本小说网]-[言情小说]-[道吟]
                    list.push(data);
                });
            }
            // if (list.length) {
            //     console.log(list);
            //     this.saveData(config, list);
            //     page++;
            //     //抓取间隔1-10S
            //     const time = utils.getRandomNum(1000, 10000);
            //     taskLog.info(`抓取间隔 ${time} ms`);
            //     setTimeout(() => {
            //         this.getBookTypeBase(baseConf, config, page);
            //     }, time);
            // }
            taskLog.info(`=============================================站外搜索开始 ${search.url}-${base.title}-${keyword} BEGIN=================================================`);
            // return list;
        } catch (error) {
            // taskLog.error(`${baseURL}-${baseConf.title}-${config.title}抓取错误!`, new Error(error));
            return null;
        }
    }
};
