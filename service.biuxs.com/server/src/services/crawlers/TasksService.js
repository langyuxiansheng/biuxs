/**
 * 爬虫系统任务服务类
 */
const result = require(':lib/Result');
// const IPProxyCrawler = require(':crawlers/IPProxyCrawler');
// const ipc = new IPProxyCrawler();
const BookInfoCrawler = require(':crawlers/BookInfoCrawler');
const bic = new BookInfoCrawler();
const { SOP, BiuDB } = require(':lib/sequelize');
const { MODELS_PATH, isSuperAdmin } = require(':lib/Utils');
const { logger } = require(':lib/logger4');
const TasksModel = BiuDB.import(`${MODELS_PATH}/crawlers/TasksModel`);
module.exports = class {
    /**
     * 获取爬虫系统任务列表
     * @param {*} param0
     */
    async getTaskList({ name, page, limit }, user) {
        //非超级管理员不可获取此菜单
        if (!isSuperAdmin(user)) return result.noAuthority();
        let queryData = {
            where: { isDelete: false },
            order: [
                ['createdTime', 'DESC']
            ],
            attributes: { exclude: ['isDelete'] }
        };
        if (name) {
            queryData.where['name'] = {
                [SOP.like]: `%${name}%`
            };
        }
        //分页
        if (page && limit) {
            queryData.offset = Number((page - 1) * limit); //开始的数据索引
            queryData.limit = Number(limit); //每页限制返回的数据条数
        };
        try {
            const { rows, count } = await TasksModel.findAndCountAll(queryData);
            return result.success(null, { list: rows, total: count });
        } catch (error) {
            logger.error(`获取爬虫系统任务列表失败:`, new Error(error));
            return result.failed(error);
        }
    }

    /**
     * 编辑爬虫系统任务
     * @param {*} data
     */
    async updateTask(data, user) {
        //非超级管理员不可获取此菜单
        if (!isSuperAdmin(user)) return result.noAuthority();
        if (!data.taskId) return result.paramsLack();
        try {
            await TasksModel.update(data, { where: { taskId: data.taskId } });
            return result.success();
        } catch (error) {
            console.error(error);
            return result.failed(error);
        }
    }

    /**
     * 运行爬虫系统任务
     * @param {*} param0
     */
    async runTaskById({ taskId }, user) {
        //非超级管理员不可获取此菜单
        if (!isSuperAdmin(user)) return result.noAuthority();
        if (!taskId) return result.paramsLack();
        try {
            const task = await TasksModel.findOne({ where: { taskId } });
            if (task && task.type == 1) {
                console.log(task);
                const book = await bic.getTaskAndConfig(task);
                return result.success(null, book);
            }
            return result.success();
        } catch (error) {
            logger.error(`运行爬虫系统任务出错:${new Error(error)}`);
            return result.failed(error);
        }
    }

    /**
     * 手动抓取测试
     * @param {*} param0
     */
    async manualTest({ page }) {
        try {
            bic.init();
            return result.success();
        } catch (error) {
            console.error(error);
            return result.failed(error);
        }
    }
};
