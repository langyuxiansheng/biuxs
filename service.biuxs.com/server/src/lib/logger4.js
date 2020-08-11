const path = require('path');// 引入原生path模块
const log4js = require('koa-log4');// 引入koa-log4
const { SRC_PATH } = require(':lib/Utils');
log4js.configure({
    pm2: true,
    disableClustering: true, // 这里这里
    appenders: {
        // 访问日志
        access: {
            type: 'dateFile',
            pattern: '-yyyy-MM-dd.log', // 通过日期来生成文件
            alwaysIncludePattern: true, // 文件名始终以日期区分
            encoding: 'utf-8',
            filename: path.join(SRC_PATH + '/logs/access/', 'access') // 生成文件路径和文件名
        },
        // 系统日志
        application: {
            type: 'dateFile',
            pattern: '-yyyy-MM-dd.log', // 通过日期来生成文件
            alwaysIncludePattern: true, // 文件名始终以日期区分
            encoding: 'utf-8',
            filename: path.join(SRC_PATH + '/logs/application/', 'application') // 生成文件路径和文件名
        },
        accessErrorLogger: {
            type: 'dateFile',
            pattern: '-yyyy-MM-dd.log', // 通过日期来生成文件
            alwaysIncludePattern: true, // 文件名始终以日期区分
            encoding: 'utf-8',
            filename: path.join(SRC_PATH + '/logs/accessErrorLogger/', 'accessErrorLogger') // 生成文件路径和文件名
        },
        accessSimpleLogger: {
            type: 'dateFile',
            pattern: '-yyyy-MM-dd.log', // 通过日期来生成文件
            alwaysIncludePattern: true, // 文件名始终以日期区分
            encoding: 'utf-8',
            filename: path.join(SRC_PATH + '/logs/accessSimpleLogger/', 'accessSimpleLogger') // 生成文件路径和文件名
        },
        sqlLog: {
            type: 'dateFile',
            pattern: '-yyyy-MM-dd.log', // 通过日期来生成文件
            alwaysIncludePattern: true, // 文件名始终以日期区分
            encoding: 'utf-8',
            filename: path.join(SRC_PATH + '/logs/sqlLog/', 'sqlLog') // 生成文件路径和文件名
        },
        logger: {
            type: 'dateFile',
            pattern: '-yyyy-MM-dd.log', // 通过日期来生成文件
            alwaysIncludePattern: true, // 文件名始终以日期区分
            encoding: 'utf-8',
            filename: path.join(SRC_PATH + '/logs/logger/', 'logger') // 生成文件路径和文件名
        },
        taskLog: { //任务日志
            type: 'dateFile',
            pattern: '-yyyy-MM-dd.log', // 通过日期来生成文件
            alwaysIncludePattern: true, // 文件名始终以日期区分
            encoding: 'utf-8',
            filename: path.join(SRC_PATH + '/logs/taskLog/', 'task-log') // 生成文件路径和文件名
        },
        out: {
            type: 'console'
        }
    },
    categories: {
        default: { appenders: ['out'], level: 'info' },
        access: { appenders: ['access'], level: 'info' },
        application: { appenders: ['application', 'out'], level: 'WARN' },
        accessErrorLogger: { appenders: ['accessErrorLogger', 'out'], level: 'WARN' },
        accessSimpleLogger: { appenders: ['accessSimpleLogger', 'out'], level: 'WARN' },
        sqlLog: { appenders: ['sqlLog', 'out'], level: 'info' },
        logger: { appenders: ['logger', 'out'], level: 'info' },
        taskLog: { appenders: ['taskLog', 'out'], level: 'info' } //任务日志
    }
});

module.exports = {
    accessLogger: () => log4js.koaLogger(log4js.getLogger('access')), // 记录所有访问级别的日志
    systemLogger: log4js.getLogger('application'), //记录所有应用级别的日志
    accessErrorLogger: log4js.getLogger('accessErrorLogger'), //记录所有访问时报错的日志
    accessSimpleLogger: log4js.getLogger('accessSimpleLogger'), //记录所有简单访问时报错的日志
    sqlLog: log4js.getLogger('sqlLog'), //记录所有SQL的日志
    logger: log4js.getLogger('logger'), //默认的日志模块
    taskLog: log4js.getLogger('taskLog') //采集任务的日志模块
};
