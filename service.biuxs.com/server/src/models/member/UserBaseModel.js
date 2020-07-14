
/**
 * Biu会员基础表数据模型
 * @param {*} sequelize
 * @param {*} dataTypes
 * 此模型仅限关系型数据库使用
 */
const { getTimeStampUUID } = require(':lib/Utils');
module.exports = (sequelize, dataTypes) => {
    return sequelize.define('UserBase', {
        userId: {
            type: dataTypes.STRING(50),
            allowNull: false,
            primaryKey: true,
            defaultValue: () => getTimeStampUUID(),
            comment: '用户ID'
        },

        account: {
            type: dataTypes.STRING(50),
            allowNull: true,
            comment: '账号'
        },

        phone: {
            type: dataTypes.STRING(30),
            allowNull: true,
            comment: '手机号(1)'
        },

        password: {
            type: dataTypes.STRING(32),
            allowNull: true,
            comment: '登录密码'
        },

        email: {
            type: dataTypes.STRING(50),
            allowNull: true,
            comment: '邮箱 (1)'
        },

        avatar: {
            type: dataTypes.STRING(200),
            allowNull: true,
            comment: '头像'
        },

        nickname: {
            type: dataTypes.STRING(50),
            allowNull: true,
            comment: '昵称'
        },

        brief: {
            type: dataTypes.STRING(255),
            allowNull: true,
            comment: '个人简介'
        },

        company: {
            type: dataTypes.STRING(255),
            allowNull: true,
            comment: '公司'
        },

        qq: {
            type: dataTypes.STRING(20),
            allowNull: true,
            comment: 'QQ'
        },

        qqOpendId: {
            type: dataTypes.STRING(50),
            allowNull: true,
            comment: 'QQOpenID(1)'
        },

        wechat: {
            type: dataTypes.STRING(30),
            allowNull: true,
            comment: '微信'
        },

        opendId: {
            type: dataTypes.STRING(50),
            allowNull: true,
            comment: '微信OpenID(1)'
        },

        profession: {
            type: dataTypes.STRING(50),
            allowNull: true,
            comment: '职业'
        },

        authType: {
            type: dataTypes.STRING(4),
            allowNull: true,
            comment: '认证类型(根据手机、邮箱、qqOpenId、微信OpenId进行8421编码,为0位未认证 )'
        },

        homePage: {
            type: dataTypes.STRING(200),
            allowNull: true,
            comment: '个人主页'
        },

        sign: {
            type: dataTypes.STRING(200),
            allowNull: true,
            comment: '个性签名'
        },

        status: {
            type: dataTypes.INTEGER(4),
            allowNull: true,
            defaultValue: () => 1,
            comment: '状态(1正常 3审核中 4为禁用)'
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
        tableName: 'biu_user_base'
    });
};
