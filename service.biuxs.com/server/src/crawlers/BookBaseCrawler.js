/**
 * 书籍的基本信息采集爬虫
 */
const http = require('superagent');
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
                protocol: 'https://', //协议
                host: 'www.quanben.net', //采集的域名
                params: '/list/2_[page].html', //参数
                charset: 'utf-8', //编码
                timeout: 1000 * 10, //超时
                type: { //分类的采集器配置
                    listSelector: '#header .nav ul', //列表选择器
                    itemSelector: 'li', //列表选择器
                    name: 'a', //分类名选择
                    href: 'a' //分类链接
                }
            };
            const headers = this.__getRequestHeaders(crawlerConfig.host); //获取请求头
            const params = crawlerConfig.params.replace('[page]', page); //替换url中的分页参数
            const baseURL = `${crawlerConfig.protocol}${crawlerConfig.host}${params}`;
            console.info(`============================================抓取开始 BEGIN================================================`);
            const { status, text } = await http.get(`${baseURL}`).set(headers).timeout(crawlerConfig.timeout).charset(crawlerConfig.charset).buffer(true);
            const list = [];
            if (status == 200) {
                const $ = cheerio.load(text, { decodeEntities: false }); //decodeEntities 设置了某些站点不会出现乱码
                $(crawlerConfig.type.listSelector).find(crawlerConfig.type.itemSelector).each((index, el) => {
                    list.push({
                        name: $(el).find(crawlerConfig.type.name).text().trim(), //获取分类名
                        url: $(el).find(crawlerConfig.type.href).attr('href').trim() //获取分类链接
                    });
                });
                if (list.length) {
                    console.log(list);
                    this.saveData(list);
                }
            }
            console.info(`=============================================抓取结束 END=================================================`);
            return list;
        } catch (error) {
            console.log(`抓取错误!`, error);
            return error;
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
