/**
 * 访客记录数据模型
 * @param {*} sequelize
 * @param {*} dataTypes
 * 此模型仅限关系型数据库使用
 */
const { getTimeStampUUID } = require(':lib/Utils');
module.exports = (sequelize, dataTypes) => {
    return sequelize.define('VisitLogs', {

        visitId: {
            type: dataTypes.STRING(),
            allowNull: false,
            primaryKey: true,
            defaultValue: () => getTimeStampUUID(),
            comment: '访客ID'
        },

        location: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: '访客地址'
        },

        origin: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: '访客来源'
        },

        ip: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: '访客IP'
        },

        userAgent: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: 'userAgent'
        },

        status: {
            type: dataTypes.INTEGER(2),
            allowNull: true,
            comment: '状态 1正常 2临时禁止访问 3永久封禁'
        },

        remark: {
            type: dataTypes.TEXT(),
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
        tableName: 'sys_visit_logs'
    });
};
