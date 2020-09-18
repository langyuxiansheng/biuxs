/**
 * 轮播图基础表数据模型
 * @param {*} sequelize
 * @param {*} dataTypes
 * 此模型仅限关系型数据库使用
 */
// const { getTimeStampUUID } = require(':lib/Utils');
module.exports = (sequelize, dataTypes) => {
    return sequelize.define('BannerBase', {

        bannerId: {
            type: dataTypes.STRING(50),
            allowNull: false,
            primaryKey: true,
            comment: '轮播图ID'
        },

        title: {
            type: dataTypes.STRING(100),
            allowNull: true,
            comment: '标题'
        },

        image: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: '图片'
        },

        expiration: {
            type: dataTypes.INTEGER(),
            allowNull: true,
            comment: '过期时间,为空即永久有效'
        },

        type: {
            type: dataTypes.STRING(2),
            allowNull: true,
            comment: '轮播图类型:1站内链接,2站外链接,3仅展示'
        },

        link: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: '链接'
        },

        status: {
            type: dataTypes.INTEGER(2),
            allowNull: true,
            comment: '状态:1正常,2停用'
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
        tableName: 'biu_banner_base',
        indexs: [
            {
                unique: true,
                fields: [ 'fileId' ]
            }
        ]
    });
};
