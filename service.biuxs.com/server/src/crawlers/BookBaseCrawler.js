/**
 * 书籍的基本信息采集爬虫
 */
const http = require('superagent');
const tr = require('transliteration'); //分类拼音
// const redis = require(':lib/redis'); //redis
const utils = require(':lib/Utils');
require('superagent-proxy')(http);
require('superagent-charset')(http);
const cheerio = require('cheerio');
const schedule = require('node-schedule');
const userAgents = require(':lib/userAgents');
const { MODELS_PATH } = require(':lib/Utils');
const { BiuDB } = require(':lib/sequelize');
const TasksModel = BiuDB.import(`${MODELS_PATH}/crawlers/TasksModel`);
module.exports = class BookBaseCrawler {
    constructor(pathname, typeId) {
        TasksModel.sync().then((res) => {
            console.log(`TasksModel 同步成功`, res);
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
                        name: '.s2 > a:nth-child(1)', //书名名选择
                        href: '.s2 > a:nth-child(1)' //详情链接
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
                        name: '.s2 > a:nth-child(1)', //书名名选择
                        href: '.s2 > a:nth-child(1)' //详情链接
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
                        name: '.s2 > a:nth-child(1)', //书名名选择
                        href: '.s2 > a:nth-child(1)' //详情链接
                    }
                ],
                info: { //详情采集配置
                    titleSelector: '', //书本名称
                    authorSelector: '', //作者名
                    briefSelector: '', //书本简介
                    letterCountSelector: '', //书本总字数
                    chapterCountSelector: '', //书本总章节数
                    sourceUrlCountSelector: '', //书本来源地址
                    imageSelector: '', //图片封面选择器
                    chapterListSelector: '#content .item-con', //章节列表容器选择器
                    itemSelector: 'li', //章节列表
                    chapterNameSelector: 'li', //章节名称
                    contentUrlSelector: '', //内容详情地址
                    contentSelector: '' //内容详情
                }
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
    * @description 1抓取后存入任务表,进行异步抓取
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
                    const url = $(el).find(config.href).attr('href').trim(); //获取分类链接
                    list.push({
                        title: config.title, //分类标题
                        pingyin: tr.slugify(config.title).replace(/-/g, ''), //拼音
                        name: $(el).find(config.name).text().trim(), //获取书籍名
                        url: url
                    });
                });
            }
            console.info(`=============================================抓取结束 ${baseURL}-${config.title} END=================================================`);
            if (list.length) {
                console.log(list);
                await this.saveData(config, list);
                page++;
                //抓取间隔
                const time = utils.getRandomNum(500, 2000);
                console.log(`抓取间隔 ${time} ms`);
                setTimeout(() => {
                    this.getBookTypeBase(config, page);
                }, time);
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
    async saveData(config, list) {
        try {
            const datas = await TasksModel.findAll({
                where: { title: config.title, status: 1, isDelete: false }
            });
            if (datas && datas.length) { //查询数据库已有的数据
                for (let i in datas) {
                    //大于24小时的全部从IP池移除
                    for (let j in list) {
                        if (datas[i].ip === list[j].ip) { //检测ip是否重复
                            list.splice(j, 1); //删除数组中的重复数据
                        }
                    }
                }
            }
            if (list && list.length) {
                await TasksModel.bulkCreate(list); //创建或者更新
                const length = list.length;
                this.count += length;
                console.log(`本次保存IP: ${length} 条,本次共计保存: ${this.count} 条`);
            }
            return true;
        } catch (error) {
            console.log(`ip 数据保存出错`, error);
            return false;
        }
    }
};
