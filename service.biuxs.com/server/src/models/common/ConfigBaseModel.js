/**
 * 配置项基础表数据模型
 * @param {*} sequelize
 * @param {*} dataTypes
 * 此模型仅限关系型数据库使用
 */
const { getTimeStampUUID } = require(':lib/Utils');
module.exports = (sequelize, dataTypes) => {
    return sequelize.define('ConfigBase', {

        configId: {
            type: dataTypes.STRING(),
            allowNull: false,
            primaryKey: true,
            defaultValue: () => getTimeStampUUID(),
            comment: '配置项ID'
        },

        name: {
            type: dataTypes.STRING(100),
            allowNull: true,
            comment: '配置项名'
        },

        code: {
            type: dataTypes.STRING(100),
            allowNull: true,
            comment: '配置项唯一标识符'
        },

        conf: {
            type: dataTypes.TEXT(),
            allowNull: true,
            get() {
                const v = this.getDataValue('conf');
                try {
                    return JSON.parse(v);
                } catch (error) {
                    console.error(error);
                    return null;
                }
            },
            set(val) {
                const v = typeof val === 'object' ? JSON.stringify(val) : val;
                this.setDataValue('conf', v);
            },
            comment: '配置项内容对象字符串'
        },

        userId: {
            type: dataTypes.STRING(50),
            allowNull: true,
            comment: '设置人ID'
        },

        userName: {
            type: dataTypes.STRING(100),
            allowNull: true,
            comment: '设置人名称'
        },

        status: {
            type: dataTypes.INTEGER(2),
            allowNull: true,
            comment: '状态 0停用 1正常'
        },

        //备注
        remark: {
            type: dataTypes.STRING(255),
            allowNull: true
        },

        //是否删除 true是 false否
        isDelete: {
            type: dataTypes.BOOLEAN(),
            allowNull: true,
            defaultValue: () => false
        },

        //创建时间
        createdTime: {
            type: dataTypes.INTEGER(),
            allowNull: true,
            defaultValue: () => (Date.parse(new Date()) / 1000)
        },

        //修改时间
        updatedTime: {
            type: dataTypes.INTEGER(),
            allowNull: true,
            defaultValue: () => (Date.parse(new Date()) / 1000),
            set(val) {
                this.setDataValue('updatedTime', (Date.parse(new Date()) / 1000));
            }
        }
    }, {
        tableName: 'biu_config_base'
    });
};
