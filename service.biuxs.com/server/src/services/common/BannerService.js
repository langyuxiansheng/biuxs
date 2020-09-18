/**
 * 轮播图服务类
 */
const result = require(':lib/Result');
const { MODELS_PATH, checkParams, isSuperAdmin } = require(':lib/Utils');
const { BiuDB, SOP } = require(':lib/sequelize');
const BannerBaseModel = BiuDB.import(`${MODELS_PATH}/common/BannerBaseModel`);
module.exports = class {
    constructor() {
        BannerBaseModel.sync().then((res) => {
            console.log(`BannerBaseModel 同步成功`, res);
        });
    }

    /**
     * 添加轮播图
     * @param {*} param0
     */
    async addBanner(data, user) {
        if (!checkParams(data, {
            name: 'string',
            image: 'string',
            type: 'string',
            status: 'number'
        })) return result.paramsLack();
        try {
            const { title } = data;
            const banner = await BannerBaseModel.findOne({ where: { title, isDelete: false } });
            if (banner) return result.failed(`轮播图【${title}】已存在!`);
            await BannerBaseModel.create(data);
            return result.success();
        } catch (error) {
            console.error(error);
            return result.failed(error);
        }
    }

    /**
     * 获取轮播图列表
     * @param {*} param0
     */
    async getBannerList({ title, page, limit }, user) {
        //非超级管理员不可获取此菜单
        if (!isSuperAdmin(user)) return result.noAuthority();
        let queryData = {
            where: { isDelete: false },
            order: [
                ['createdTime', 'DESC']
            ],
            attributes: { exclude: ['isDelete'] }
        };
        if (title) {
            queryData.where['title'] = {
                [SOP.like]: `%${title}%`
            };
        }
        //分页
        if (page && limit) {
            queryData.offset = Number((page - 1) * limit); //开始的数据索引
            queryData.limit = Number(limit); //每页限制返回的数据条数
        };
        try {
            const { rows, count } = await BannerBaseModel.findAndCountAll(queryData);
            return result.success(null, { list: rows, total: count });
        } catch (error) {
            console.error(error);
            return result.failed(error);
        }
    }

    /**
     * 编辑轮播图
     * @param {*} data
     */
    async updateBanner(data, user) {
        if (!isSuperAdmin(user)) return result.noAuthority();
        if (!checkParams(data, {
            bannerId: 'string'
        })) return result.paramsLack();
        try {
            const update = { where: { configId: data.bannerId } };
            await BannerBaseModel.update(data, update);
            return result.success();
        } catch (error) {
            console.error(error);
            return result.failed(error);
        }
    }

    /**
     * 删除轮播图
     * @param {*} param0
     */
    async delBannerByIds({ ids, isDelete }, user) {
        if (!isSuperAdmin(user)) return result.noAuthority();
        if (!ids || !isDelete || !Array.isArray(ids)) return result.paramsLack();
        try {
            //批量软删除
            const del = { where: { bannerId: ids } };
            await BannerBaseModel.update({ isDelete }, del);
            return result.success();
        } catch (error) {
            console.error(error);
            return result.failed(error);
        }
    }
};
