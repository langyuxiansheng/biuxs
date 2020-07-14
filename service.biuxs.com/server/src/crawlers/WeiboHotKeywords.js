/**
 * 微博热搜词爬虫
 */
const http = require('superagent');
const redis = require(':lib/redis'); //redis
const utils = require(':lib/Utils'); //redis
require('superagent-proxy')(http);
require('superagent-charset')(http);
const cheerio = require('cheerio');
const schedule = require('node-schedule');
const userAgents = require(':lib/userAgents');

module.exports = class WeiboHotKeywords {
    // constructor(pathname, typeId) {
    //     this.baseURL = `http://www.hao123.com`;
    //     this.pathname = pathname;
    //     this.typeId = typeId;
    // }

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
     * 抓取新浪微博的热搜词
     */
    async getSinaWeibo() {
        const baseURL = `https://s.weibo.com/top/summary`;
        try {
            const headers = {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Cache-Control': 'max-age=0',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': userAgents,
                'Host': 's.weibo.com'
            };
            const response = await http.get(`${baseURL}`)
                .set(headers) //设置请求头
                .timeout(1000 * 10)
                .charset('utf-8')
                .buffer(true);
            const { status, text } = response;
            const list = [];
            if (status == 200) {
                console.info(`============================================抓取开始 BEGIN================================================`);
                const $ = cheerio.load(text, { decodeEntities: false });
                // let chinese = /[\u4e00-\u9fa5]/g;
                $('#pl_top_realtimehot tbody').find('tr').each((i, tr) => {
                    const kw = $(tr).find('.td-02 a').text();
                    list.push({ text: kw, date: utils.getYearMonthDayAndHMI() });
                });
                if (list.length) {
                    console.log(list);
                    this.saveData(list);
                }
                console.info(`=============================================抓取结束 END=================================================`);
            }
            return list;
        } catch (error) {
            console.log(`error`, error);
            console.log(`${baseURL} 抓取错误! 正在重试!`);
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
