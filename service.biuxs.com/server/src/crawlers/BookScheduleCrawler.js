/**
 * 书籍定时任务采集采集爬虫
 */
const http = require('superagent');
const { taskLog } = require(':lib/logger4'); //日志系统
const utils = require(':lib/Utils');
require('superagent-proxy')(http);
require('superagent-charset')(http);
const schedule = require('node-schedule');
const { MODELS_PATH } = require(':lib/Utils');
const { BiuDB } = require(':lib/sequelize');
const BookInfoCrawler = require('./BookInfoCrawler');
const TasksModel = BiuDB.import(`${MODELS_PATH}/crawlers/TasksModel`);
module.exports = class BookBaseCrawler extends BookInfoCrawler {
    constructor(pathname, typeId) {
        super(pathname, typeId);
        this.count = 0;
    }

    /**
     * 在每小时的30分运行定时任务
     * 如果仅仅设置了hour，定时任务并不会如期望的一样在每小时的0分时运行，而是每分钟都会运行！！！
     * 因此，如果你希望在每小时的固定分钟运行，就一定要设置minute！！！
     */
    start() {
        const time = utils.getRandomNum(0, 59);
        this.RULE = this.__getScheduleJobRule(time, time);
        schedule.scheduleJob(this.RULE, () => {
            console.log('定时抓取:' + new Date());
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
     * 迭代运行任务
     * @param {*} param0 page 第1页，每次2条 status = 任务类型和状态
     */
    async iterationRunTask({ page = 1, limit = 5, status = 1 }) {
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
                taskLog.info(`本次执行任务:${taskCount}条,总任务剩余:${count}条`);
                Promise.all(rows.map((task) => {
                    return this.runTask(task);
                })).then((res) => {
                    const success = res.filter(item => item).length;
                    const failed = res.filter(item => !item).length;
                    taskLog.info(`本次执行的任务:${res.length}条,成功:${success}条,失败:${failed}条`, JSON.stringify(rows));
                    this.iterationRunTask({ page, limit, status });
                });
            } else {
                taskLog.warn(`没有需要执行的任务列表:`, rows);
            }
        } catch (error) {
            taskLog.error(`任务执行出错:${new Error(error)}`);
        }
    }
};
