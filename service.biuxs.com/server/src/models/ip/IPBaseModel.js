/**
 * ip池数据模型
 * @param {*} sequelize
 * @param {*} dataTypes
 * 此模型仅限关系型数据库使用
 * @description http://ip.kxdaili.com/
 */
const { getTimeStampUUID } = require(':lib/Utils');
module.exports = (sequelize, dataTypes) => {
    return sequelize.define('IPBase', {

        ipId: {
            type: dataTypes.STRING(),
            allowNull: false,
            primaryKey: true,
            defaultValue: () => getTimeStampUUID(),
            comment: 'ID'
        },

        ip: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: 'ip'
        },

        port: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: '端口'
        },

        address: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: '地址'
        },

        type: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: '类型'
        },

        from: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: '来自'
        },

        fromHref: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: '来源地址'
        },

        responseTime: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: '响应时间',
            defaultValue: () => '未知'
        },

        protocol: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: '请求类型 http https'
        },

        validateTime: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: '最后一次的验证时间'
        },

        status: {
            type: dataTypes.INTEGER(2),
            allowNull: true,
            comment: '状态( 1可用 2不可用 3未知 4无效)'
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
        tableName: 'biu_ip_base',
        indexs: [
            {
                unique: true,
                fields: [ 'ipId' ]
            }
        ]
    });
};
