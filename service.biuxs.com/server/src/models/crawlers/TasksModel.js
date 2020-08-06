/**
 * 采集任务数据模型
 * @param {*} sequelize
 * @param {*} dataTypes
 * 此模型仅限关系型数据库使用
 */
const { getTimeStampUUID } = require(':lib/Utils');
module.exports = (sequelize, dataTypes) => {
    return sequelize.define('Tasks', {

        taskId: {
            type: dataTypes.STRING(),
            allowNull: false,
            primaryKey: true,
            defaultValue: () => getTimeStampUUID(),
            comment: '任务ID'
        },

        name: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: '任务名称'
        },

        website: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: '站点名称'
        },

        domain: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: '域名地址'
        },

        type: {
            type: dataTypes.INTEGER(3),
            allowNull: true,
            comment: '任务采集类型 1分类 2书籍 3章节 4内容'
        },

        url: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: '采集地址'
        },

        status: {
            type: dataTypes.INTEGER(2),
            allowNull: true,
            comment: '状态(1未开始 2未完成 3已完成)'
        },

        remark: {
            type: dataTypes.STRING(255),
            allowNull: true,
            comment: '备注'
        },

        isDelete: {
            type: dataTypes.BOOLEAN(),
            allowNull: true,
            defaultValue: () => false,
            comment: '是否删除 true是 false否'
        },

        createdTime: {
            type: dataTypes.INTEGER(),
            allowNull: true,
            defaultValue: () => (Date.parse(new Date()) / 1000),
            comment: '创建时间'
        },

        updatedTime: {
            type: dataTypes.INTEGER(),
            allowNull: true,
            defaultValue: () => (Date.parse(new Date()) / 1000),
            set(val) {
                this.setDataValue('updatedTime', (Date.parse(new Date()) / 1000));
            },
            comment: '修改时间'
        }
    }, {
        freezeTableName: true,
        tableName: 'biu_tasks',
        timestamps: false //是否需要增加createdAt、updatedAt、deletedAt字段
    });
};
