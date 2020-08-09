/**
 * 配置服务类
 */
const result = require(':lib/Result');
const redis = require(':lib/redis'); //redis
const { MODELS_PATH, checkParams, isSuperAdmin } = require(':lib/Utils');
const { BiuDB, SOP } = require(':lib/sequelize');
const ConfigBaseModel = BiuDB.import(`${MODELS_PATH}/common/ConfigBaseModel`);
module.exports = class {
    constructor() {
        ConfigBaseModel.sync().then((res) => {
            console.log(`ConfigBaseModel 同步成功`, res);
        });
    }

    /**
     * 添加配置项
     * @param {*} param0
     */
    async addConfig(data, user) {
        if (!checkParams(data, {
            name: 'string',
            code: 'string',
            conf: 'object'
        })) return result.paramsLack();
        try {
            const { code, name } = data;
            //查询昵称是否存在
            const count = await ConfigBaseModel.count({
                where: { code, isDelete: false }
            });
            if (count > 0) return result.failed(`配置项【${name}】已存在!`);
            data.status = 1;
            data.userId = user.userId;
            data.userName = user.userName;
            await ConfigBaseModel.create(data);
            return result.success();
        } catch (error) {
            console.error(error);
            return result.failed(error);
        }
    }

    /**
     * 获取配置项列表
     * @param {*} param0
     */
    async getConfigList({ name, page, limit }, user) {
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
            const { rows, count } = await ConfigBaseModel.findAndCountAll(queryData);
            return result.success(null, { list: rows, total: count });
        } catch (error) {
            console.error(error);
            return result.failed(error);
        }
    }

    /**
     *  根据唯一标识符获取配置项
     * @param {*} param0
     */
    async getConfigByCode({ code }, user) {
        if (!code) return result.paramsLack();
        try {
            let queryData = {
                where: { code, isDelete: false },
                order: [ ['createdTime', 'DESC'] ],
                attributes: { exclude: ['isDelete'] }
            };
            if (!isSuperAdmin(user)) {
                queryData.where.userId = user.userId;
            }
            const data = await ConfigBaseModel.findOne(queryData);
            return result.success(null, data);
        } catch (error) {
            console.error(error);
            return result.failed(error);
        }
    }

    /**
     *  根据ID符获取配置项
     * @param {*} param0
     */
    async getConfigById({ configId }, user) {
        if (!configId) return result.paramsLack();
        try {
            const conf = await redis.getData(configId);
            if (conf) return result.success(null, conf);
            let queryData = {
                where: { configId, isDelete: false },
                order: [ ['createdTime', 'DESC'] ],
                attributes: { exclude: ['isDelete'] }
            };
            if (!isSuperAdmin(user)) {
                queryData.where.userId = user.userId;
            }
            const data = await ConfigBaseModel.findOne(queryData);
            redis.setData(data.configId, data);
            return result.success(null, data);
        } catch (error) {
            console.error(error);
            return result.failed(error);
        }
    }

    /**
     * 编辑配置项
     * @param {*} data
     */
    async updateConfig(data, user) {
        if (!checkParams(data, {
            configId: 'string'
        })) return result.paramsLack();
        try {
            const update = { where: { configId: data.configId } };
            if (!isSuperAdmin(user)) {
                update.where.userId = user.userId;
            }
            await ConfigBaseModel.update(data, update);
            redis.delData(data.configId);
            return result.success();
        } catch (error) {
            console.error(error);
            return result.failed(error);
        }
    }

    /**
     * 删除配置项
     * @param {*} param0
     */
    async delConfigByIds({ ids, isDelete }, user) {
        if (!ids || !isDelete || !Array.isArray(ids)) return result.paramsLack();
        try {
            //批量软删除
            const del = { where: { configId: ids } };
            if (!isSuperAdmin(user)) {
                del.where.userId = user.userId;
            }
            await ConfigBaseModel.update({ isDelete }, del);
            if (ids.length == 1) {
                redis.delData(ids[0]);
            } else {
                for (const key in ids) {
                    redis.delData(ids[key]);
                }
            }
            return result.success();
        } catch (error) {
            console.error(error);
            return result.failed(error);
        }
    }
};
