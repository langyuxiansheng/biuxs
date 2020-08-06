/**
 * 书籍的基本信息采集爬虫
 */
const http = require('superagent');
const tr = require('transliteration'); //分类拼音
const redis = require(':lib/redis'); //redis
const utils = require(':lib/Utils');
require('superagent-proxy')(http);
require('superagent-charset')(http);
const cheerio = require('cheerio');
const schedule = require('node-schedule');
const userAgents = require(':lib/userAgents');
const { MODELS_PATH } = require(':lib/Utils');
const { BiuDB } = require(':lib/sequelize');
const BookTypeTasksModel = BiuDB.import(`${MODELS_PATH}/crawlers/BookTypeTasksModel`);
module.exports = class BookBaseCrawler {
    constructor(pathname, typeId) {
        BookTypeTasksModel.sync().then((res) => {
            console.log(`UserBaseModel 同步成功`, res);
        });
    }

    init() {

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
            this.getSinaWeibo();
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
     * 抓取站点的分类信息
     * @param page
     */
    async getBookTypes(page = 1) {
        try {
            const crawlerConfig = {
                title: '全本小说网', //站点名
                types: [//分类的采集器配置
                    {
                        title: '玄幻小说', //分类标题
                        protocol: 'https://', //协议
                        host: 'www.quanben.net', //采集的域名
                        params: '/list/1_[page].html', //参数
                        charset: 'utf-8', //编码
                        timeout: 1000 * 10, //超时
                        listSelector: '#content .item-con', //列表选择器
                        itemSelector: 'li', //列表选择器
                        name: '.s2 a:nth-child(1)', //书名名选择
                        href: '.s2 a:first-child' //详情链接
                    },
                    {
                        title: '修真小说', //分类标题
                        protocol: 'https://', //协议
                        host: 'www.quanben.net', //采集的域名
                        params: '/list/2_[page].html', //参数
                        charset: 'utf-8', //编码
                        timeout: 1000 * 10, //超时
                        listSelector: '#content .item-con', //列表选择器
                        itemSelector: 'li', //列表选择器
                        name: '.s2 a:nth-child(0)', //书名名选择
                        href: '.s2 a:first-child' //详情链接
                    },
                    {
                        title: '言情小说', //分类标题
                        protocol: 'https://', //协议
                        host: 'www.quanben.net', //采集的域名
                        params: '/list/2_[page].html', //参数
                        charset: 'utf-8', //编码
                        timeout: 1000 * 10, //超时
                        listSelector: '#content .item-con', //列表选择器
                        itemSelector: 'li', //列表选择器
                        name: '.s2 a:nth-child(1)', //书名名选择
                        href: '.s2 a:first-child' //详情链接
                    }
                ]
            };

            //创建异步同时抓取多个分类
            const crawlers = crawlerConfig.types.map((config) => {
                return this.getBookTypeBase(config);
            });
            Promise.all(crawlers).then((res) => {
                console.log(`抓取完成!`, res);
            });
        } catch (error) {
            console.log(`抓取错误!`, error);
            return error;
        }
    }

    /**
    * 分类抓取
    * @param {*} config 配置项
    * @param {*} page 开始页数
    */
    async getBookTypeBase(config, page = 1) {
        const headers = this.__getRequestHeaders(config.host); //获取请求头
        const params = config.params.replace('[page]', page); //替换url中的分页参数
        const baseURL = `${config.protocol}${config.host}${params}`;
        try {
            console.info(`============================================抓取开始 ${baseURL}-${config.title} BEGIN================================================`);
            const { status, text } = await http.get(`${baseURL}`).set(headers).timeout(config.timeout).charset(config.charset).buffer(true);
            const list = [];
            if (status == 200) {
                const $ = cheerio.load(text, { decodeEntities: false }); //decodeEntities 设置了某些站点不会出现乱码
                $(config.listSelector).find(config.itemSelector).each((index, el) => {
                    console.log($(el).find(config.name));
                    list.push({
                        title: config.title, //分类标题
                        pingyin: tr.slugify(config.title).replace(/-/g, ''), //拼音
                        name: $(el).find(config.name).text().trim(), //获取书籍名
                        url: $(el).find(config.href).attr('href').trim() //获取分类链接
                    });
                });
            }
            console.info(`=============================================抓取结束 ${baseURL}-${config.title} END=================================================`);
            if (list.length) {
                console.log(list);
                redis.setData(`${baseURL}_${page}`, list);
                page++;
                this.getBookTypeBase(config, page);
                // this.saveData(list);
            }
        } catch (error) {
            console.log(`${baseURL}-${config.title}抓取错误!`, error);
            return null;
        }
    }

    /**
     * 保存数据
     * @param {*} list
     */
    async saveData(list) {
        try {
            //查询否存在
            const datas = await redis.getData(`${redis.key.GET_SEARCH_HOT_KEYWORDS}SINAWEIBO`);
            if (datas) {
                for (const i in datas) {
                    for (const j in list) {
                        if (datas[i].text === list[j].text) { //检测是否重复
                            console.log(`关键字:${datas[i].text} 已存在`);
                            list.splice(j, 1); //删除数组中的重复数据
                        }
                    }
                }
                await redis.setData(`${redis.key.GET_SEARCH_HOT_KEYWORDS}SINAWEIBO`, datas.concat(list), 60 * 60 * 12);
            } else {
                await redis.setData(`${redis.key.GET_SEARCH_HOT_KEYWORDS}SINAWEIBO`, list, 60 * 60 * 12);
            }
            return true;
        } catch (error) {
            console.log(`ip 数据保存出错`, error);
            return false;
        }
    }
};
