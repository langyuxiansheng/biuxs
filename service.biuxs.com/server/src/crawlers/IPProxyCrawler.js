/**
 * 代理IP采集爬虫
 */
const http = require('superagent');
// const utils = require(':lib/Utils');
require('superagent-proxy')(http);
require('superagent-charset')(http);
const cheerio = require('cheerio');
// const schedule = require('node-schedule');
const userAgents = require(':lib/userAgents');
const { MODELS_PATH, getRandomNum, getYearMonthDayAndHMI } = require(':lib/Utils');
const { BiuDB } = require(':lib/sequelize');
const IPBaseModel = BiuDB.import(`${MODELS_PATH}/ip/IPBaseModel`);
module.exports = class IPProxyCrawler {
    constructor(pathname, typeId) {
        IPBaseModel.sync().then((res) => {
            console.log(`IPBaseModel 同步成功`, res);
        });
    }

    start() {
        //在每小时的30分运行定时任务
        /**
        * 如果仅仅设置了hour，定时任务并不会如期望的一样在每小时的0分时运行，而是每分钟都会运行！！！
        * 因此，如果你希望在每小时的固定分钟运行，就一定要设置minute！！！
        */
        //通过数组在多个时刻运行
        //rule.minute = [10,20,30];
        // const time = utils.getRandomNum(0, 59);
        // this.RULE = this.__getScheduleJobRule(time, time);
        // schedule.scheduleJob(this.RULE, () => {
        //     console.log('定时抓取新浪微博的热搜词:' + new Date());
        //     this.getSinaWeibo();
        //     this.RULE = this.__getScheduleJobRule(time, time);
        // });

        this.getIPProxy(1);
    }

    /**
    * 获取规则
    * @param {*} min
    * @param {*} sec
    */
    // __getScheduleJobRule(min = 2, sec = 4) {
    //     let rule = new schedule.RecurrenceRule();
    //     rule.hour = [];
    //     for (let h = 0; h < 24; h++) {
    //         if (h % 2) {
    //             rule.hour.push(h);
    //         }
    //     }
    //     rule.second = sec;
    //     rule.minute = min;
    //     return rule;
    // }

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
    async getIPProxy(page = 1) {
        try {
            // const crawlerConfig = {
            //     title: '快代理', //站点名
            //     protocol: 'https://', //协议
            //     host: 'www.kuaidaili.com', //采集的域名
            //     params: '/free/inha/[page]', //参数
            //     charset: 'utf-8', //编码
            //     timeout: 1000 * 10, //超时
            //     ip: { //IP的采集器配置
            //         listSelector: '#list .table tbody', //列表选择器
            //         itemSelector: 'tr', //列表选择器
            //         ipSelector: 'td[data-title="IP"]', //ip选择器
            //         portSelector: 'td[data-title="PORT"]', //端口选择器
            //         typeSelector: 'td[data-title="匿名度"]', //类型选择器
            //         protocolSelector: 'td[data-title="类型"]', //协议选择器
            //         responseTimeSelector: 'td[data-title="响应速度"]', //响应时长选择器
            //         addressSelector: 'td[data-title="位置"]', //地址选择器
            //         validateTimeSelector: 'td[data-title="最后验证时间"]', //验证时间选择器
            //         maxTime: 5 //最大响应时长 单位s
            //     }
            // };

            const crawlerConfig = {
                title: '89免费代理', //站点名
                protocol: 'http://', //协议
                host: 'www.89ip.cn', //采集的域名
                params: '/index_[page].html', //分页参数
                charset: 'utf-8', //编码
                timeout: 1000 * 10, //超时
                ip: { //IP的采集器配置
                    listSelector: '.layui-table tbody', //列表选择器
                    itemSelector: 'tr', //列表选择器
                    ipSelector: 'td:nth-child(1)', //ip选择器
                    portSelector: 'td:nth-child(2)', //端口选择器
                    typeSelector: 'td:nth-child(4)', //类型选择器
                    protocolSelector: null, //协议选择器
                    responseTimeSelector: null, //响应时长选择器
                    addressSelector: 'td:nth-child(3)', //地址选择器
                    validateTimeSelector: null, //验证时间选择器
                    maxPage: 100 //最大抓取页面
                }
            };
            const headers = this.__getRequestHeaders(crawlerConfig.host); //获取请求头
            const params = crawlerConfig.params.replace('[page]', page); //替换url中的分页参数
            const baseURL = `${crawlerConfig.protocol}${crawlerConfig.host}${params}`;
            const { status, text } = await http.get(`${baseURL}`).set(headers).timeout(crawlerConfig.timeout).charset(crawlerConfig.charset).buffer(true);
            console.info(`============================================${crawlerConfig.title}: ${baseURL} 第 ${page} 页, 抓取开始 BEGIN================================================`);
            const list = [];
            if (status == 200) {
                const $ = cheerio.load(text, { decodeEntities: false }); //decodeEntities 设置了某些站点不会出现乱码
                $(crawlerConfig.ip.listSelector).find(crawlerConfig.ip.itemSelector).each((index, el) => {
                    const from = crawlerConfig.title; //来源站点选择器
                    const fromHref = crawlerConfig.host; //来源站点选择器
                    const ip = $(el).find(crawlerConfig.ip.ipSelector).text().trim();
                    const port = $(el).find(crawlerConfig.ip.portSelector).text().trim();
                    const type = $(el).find(crawlerConfig.ip.typeSelector).text().trim();
                    const protocol = $(el).find(crawlerConfig.ip.protocolSelector).text().trim().toLocaleLowerCase() || 'http';
                    const responseTime = $(el).find(crawlerConfig.ip.responseTimeSelector).text().trim() || '未知';
                    const address = $(el).find(crawlerConfig.ip.addressSelector).text().trim();
                    const validateTime = $(el).find(crawlerConfig.ip.validateTimeSelector).text().trim() || '未知';
                    const status = 3; //默认抓取的为待审核状态
                    list.push({ from, fromHref, ip, port, type, protocol, responseTime, address, validateTime, status });
                });
                console.info(`=============================================${crawlerConfig.title}: ${baseURL} 第 ${page} 页, 抓取结束 END=================================================`);
                if (list.length) {
                    console.log(list);
                    await this.saveData(list);
                    if (page <= crawlerConfig.ip.maxPage) { //最多抓取前N页
                        page++;
                        const time = getRandomNum(500, 2000);//抓取时间间隔
                        console.log(`下次抓取间隔:${time} ms`);
                        setTimeout(() => {
                            this.getIPProxy(page);
                        }, time);
                    }
                }
            }
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
            //查询ip否存在
            const datas = await IPBaseModel.findAll({
                where: { isDelete: false }
            });
            let delIPIds = [];
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
            if (delIPIds.length && datas.length >= 50) { //删除存留一周的数据 保存50条ip
                await IPBaseModel.destroy({ where: { ipId: delIPIds } });
            }
            if (list && list.length) {
                await IPBaseModel.bulkCreate(list); //创建或者更新
                console.log(`本次保存IP: ${list.length} 条`);
            }
            return true;
        } catch (error) {
            console.log(`ip 数据保存出错`, error);
            return false;
        }
    }

    /**
     * 验证IP可用性
     * @param {*} data
     * @description data.testIP testURL
     */
    async testIP(data) {
        try {
            const protocol = data.protocol.split(',')[0];
            const ip = `${protocol}://${data.ip}:${data.port}`.toLowerCase();
            console.log(`正则测试IP: ${ip} 是否可用?`);
            const { status } = await http.get('https://www.baidu.com/').charset('utf-8').proxy(ip).timeout(1000 * 5).buffer(true);//10s内没有返回则视为ip无效
            if (status == 200) { //响应成功则视为IP可用
                console.log(`IP: ${ip} 可用!`);
                IPBaseModel.update({ status: 1, validateTime: getYearMonthDayAndHMI() }, { where: { ipId: data.ipId } }); //删除无效的ip
            }
            return { data, active: false }; //否则视为IP无效
        } catch (error) {
            console.log(`IP: ${data.ip} 无效!`, error);
            await IPBaseModel.update({ status: 2, validateTime: getYearMonthDayAndHMI() }, { where: { ipId: data.ipId } }); //删除无效的ip
            return { data, active: false, error };
        }
    }

    /**
     * 验证IP的可用性
     * @param {*} status 默认为 未验证的ip
     */
    async validateProxyIP(status = 3) {
        try {
            //获取ip池
            const list = await IPBaseModel.findAll({ where: { isDelete: false, status } });
            if (list && list.length) {
                const ips = list.map((item) => this.testIP(item));
                Promise.all(ips).then((res) => {
                    console.log(`验证完成: 本地处理 ${res.length} 条!`);
                });
            }
        } catch (error) {
            console.log(`validateProxyIP 出错!`, error);
        }
        return null;
    }

    /**
     * 从ip池里随机获取一个ip
     */
    async getRandomIPByPools() {
        try {
            //获取ip池
            const ips = await IPBaseModel.findAll({ where: { isDelete: false } });
            if (ips && !ips.length) return null;
            const index = Number.parseInt(getRandomNum(0, ips.length));
            //从ip池里随机抽取一个ip
            return ips[index];
            // const data = ips[index];
            // const res = await this.testIP(data);
            // if (res && res.active) return data;
        } catch (error) {
            console.log(`IP抽取失败! 方法:getRandomIPByPools`, error);
        }
        return null;
    }
};
