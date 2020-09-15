const fs = require('fs');
const path = require('path');
const request = require('request');
const crypto = require('crypto');
const config = require(':config/server.base.config'); //配置文件
const { taskLog, systemLogger } = require(':lib/logger4'); //日志系统
const { MODELS_PATH, getFileNameUUID32, getExtname, getTimeStampUUID, getYearMonthDay } = require(':lib/Utils');
const userAgents = require(':lib/userAgents');
const { BiuDB } = require(':lib/sequelize');
const FilesBaseModel = BiuDB.import(`${MODELS_PATH}/common/FilesBaseModel`);

/**
 * 文件操作工具类
 */
const FileUtils = {

    /**
     * 下载图片到本地且返回地址
     * @param {*} imageUrl
     * @param {*} encoding
     */
    downloadImageToLocal({ imageUrl, encoding, proxyIP }) {
        taskLog.info(`正在下载:${imageUrl},代理IP为: ${proxyIP || '无代理IP'}`);
        return new Promise(async(resolve, reject) => {
            try {
                const headers = { 'User-Agent': userAgents };
                const options = { pool: false, headers };
                if (proxyIP) options.proxy = proxyIP;
                //创建文件夹;
                const time = getYearMonthDay(); //获取时间
                let uploadPath = path.join(config.staticPath, `/books/`, time.replace(/-/g, '')); //文件上传存放路径
                const existsSync = await this.isDirExists(uploadPath, true); //判断文件夹是否存在,不存在就创建
                if (existsSync) { //确认成功之后再进行操作
                    const suffix = getExtname(imageUrl);
                    const fileName = getFileNameUUID32(suffix); //重名名后的文件
                    const fileSavePath = path.join(uploadPath, fileName).replace(/\\/g, '/'); //合成路径 + 时间 + 文件名
                    const httpRequest = request(imageUrl, options);
                    //创建数据库存储数据
                    const data = {
                        userId: '84A94F76FFA345E2509FFBAE5195FBBA', //上传者id
                        userName: '爬虫自动抓取', //上传者名称
                        fileId: null,
                        size: 0, //文件大小
                        type: 'image/jpeg', //文件类型
                        fileMD5: null, //文件指纹
                        fileName: imageUrl, //获取原文件名
                        suffix: suffix, //获取文件后缀名
                        path: fileSavePath.split('public')[1], //存储完整路径,文件路径
                        aliasName: fileName, //文件别名
                        status: 1,
                        remark: '爬虫自动抓取图片'
                    };
                    //读取文件流
                    httpRequest.on('response', (res) => {
                        data.type = res.headers['content-type'];
                        data.size = res.headers['content-length'];
                    });
                    httpRequest.on('data', (chunk) => {
                        data.fileMD5 = crypto.createHash('md5').update(chunk).digest('hex').toUpperCase(); //创建文件指纹读取对象
                    });
                    httpRequest.on('error', (err) => { //监听报错信息
                        console.error(err);
                        taskLog.info(`下载文件出错:`, new Error(err));
                        reject(new Error({ status: 400, msg: err }));
                    });
                    //写入文件到本地
                    httpRequest.pipe(fs.createWriteStream(fileSavePath, {
                        'encoding': encoding || 'utf8'
                    })).on('close', async() => {
                        try {
                            data.fileId = getTimeStampUUID();
                            const file = await FilesBaseModel.findOne({ where: { fileMD5: data.fileMD5, isDelete: false } });
                            if (file) {
                                taskLog.info(`文件已存在:${file.path}`);
                                //重新创建一个文件存储对象
                                data.path = file.path;
                                await this.deleteFile(fileSavePath);
                                resolve(file);
                            } else {
                            //保存文件到数据库
                                const res = await FilesBaseModel.create(data);
                                taskLog.info(`已下载文件:${fileSavePath}`);
                                resolve(res);
                            }
                        } catch (error) {
                            console.error(error);
                            taskLog.info(`保存文件出错:${new Error(error)}`);
                            reject(new Error({ status: 400, msg: error }));
                        }
                    });
                }
            } catch (error) {
                console.error(error);
                taskLog.info(`请求文件出错:${new Error(error)}`);
                reject(new Error({ status: 400, msg: error }));
            }
        });
    },

    /**
     * 获取日志文件列表
     * @param {*} filePath
     */
    getLogsFileList(logsPath) {
        return new Promise(async(resolve, reject) => {
            try {
                const filePaths = await FileUtils.readdir(logsPath);
                const files = await Promise.all(filePaths.map(async(filePath) => {
                    //获取当前日志文件的文件夹绝对路径
                    const filedir = path.join(logsPath, filePath);
                    const logs = await FileUtils.readdir(filedir);
                    if (logs && logs.length) {
                        for (const file in logs) {
                            const logdir = path.join(filedir, logs[file]);
                            const stat = await FileUtils.getfileStat(logdir);
                            if (stat.isFile) {
                                const subPath = logdir.split('src')[1]; //文件路径
                                const name = logdir.split(path.join(filePath, '/'))[1]; //获取log文件名
                                return { path: subPath, name, size: stat.size };
                            }
                        }
                    } else {
                        return null;
                    }
                }));
                resolve(files);
            } catch (error) {
                reject(error);
            }
        });
    },

    /**
     * 读取目录
     * @param {*} path
     */
    readdir(readPath) {
        return new Promise((resolve, reject) => {
            fs.readdir(readPath, (err, files) => {
                if (err) {
                    systemLogger.error(`获取文件列表失败`);
                    reject(err);
                } else {
                    resolve(files);
                }
            });
        });
    },

    /**
     * 获取文件信息
     * @param {*} path
     */
    getfileStat(filepath) {
        return new Promise((resolve, reject) => {
            fs.stat(filepath, (eror, stats) => {
                if (eror) {
                    systemLogger.error(`获取文件stats失败`);
                    reject(eror);
                } else {
                    if (stats.isFile()) { //是文件
                        resolve({ isFile: true, filepath, ...stats });
                    } else if (stats.isDirectory()) {
                        resolve({ isFile: false, filepath, ...stats });
                    } else {
                        reject(new Error(`未知类型!`));
                    }
                }
            });
        });
    },

    /**
     * 读取文件内容
     * @param {*} path
     * @param encode 编码格式
     * @returns { code,data}
     */
    readerFile(fileFullPath, encode) {
        return new Promise((resolve, reject) => {
            fs.readFile(fileFullPath, (err, data) => {
                if (err) {
                    systemLogger.error(`读取文件:${fileFullPath}内容失败,${err}`);
                    reject(err);
                } else if (encode) {
                    systemLogger.info(`读取文件:${fileFullPath}成功！`);
                    resolve({ code: 200, data: data.toString(encode || 'utf-8') });
                } else {
                    resolve({ code: 200, data });
                }
            });
        });
    },

    /**
     * 创建文件夹
     * @param {*} filepath
     * @returns Boolean
     */
    createDir(filepath) {
        return new Promise((resolve, reject) => {
            fs.mkdir(filepath, (err) => {
                if (err) {
                    systemLogger.error(`创建文件夹:${filepath}失败！`);
                    reject(err);
                } else {
                    systemLogger.info(`创建文件夹:${filepath}成功！`);
                    resolve(true);
                }
            });
        });
    },

    /**
     * 判断一个文件夹是否存在
     * @param {*} dirpath 文件夹路径
     * @param {*} isCreateDir  如果不存在就创建
     */
    isDirExists(dirpath, isCreateDir) {
        return new Promise(async (resolve, reject) => {
            if (!fs.existsSync(dirpath)) { //判断文件夹是否存在
                if (isCreateDir) {
                    const res = await FileUtils.createDir(dirpath);
                    if (res) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                } else {
                    resolve(false);
                }
            } else {
                resolve(true);
            }
        });
    },

    /**
     * 删除文件
     * @param {*} fileFullPath 文件的路径
     * @returns {code }
     */
    deleteFile(fileFullPath) {
        return new Promise((resolve, reject) => {
            fs.unlink(fileFullPath, (err) => { //上传成功后删除临时文件
                if (err) {
                    systemLogger.error(`删除文件:${fileFullPath}异常!`);
                    reject(err);
                } else {
                    systemLogger.info(`删除文件:${fileFullPath}成功！`);
                    resolve({ code: 200, path: fileFullPath });
                }
            });
        });
    },

    /**
     * 写内容到文件
     * @param {*} path
     * @param encode 编码格式
     * @returns { code,data}
     */
    writeFile(fileFullPath, content) {
        return new Promise((resolve, reject) => {
            fs.writeFile(fileFullPath, content, (err, data) => {
                if (err) {
                    systemLogger.error(`写入文件:${fileFullPath}内容失败,${err}`);
                    reject(err);
                } else if (content) {
                    systemLogger.info(`写入文件:${fileFullPath}成功！`);
                    resolve({ code: 200, data: data.toString(content || 'utf-8') });
                } else {
                    resolve({ code: 200, data });
                }
            });
        });
    }
};
module.exports = FileUtils;
