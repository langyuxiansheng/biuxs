/**
 * 书籍基础表数据模型
 * @param {*} sequelize
 * @param {*} dataTypes
 * 此模型仅限关系型数据库使用
 */
const { getTimeStampUUID } = require(':lib/Utils');
module.exports = (sequelize, dataTypes) => {
    return sequelize.define('BookBase', {

        bookId: {
            type: dataTypes.STRING(),
            allowNull: false,
            primaryKey: true,
            defaultValue: () => getTimeStampUUID(),
            comment: '书本ID'
        },

        title: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: '书本名称'
        },

        brief: {
            type: dataTypes.STRING(1000),
            allowNull: true,
            comment: '书本简介'
        },

        letterCount: {
            type: dataTypes.INTEGER(),
            allowNull: true,
            comment: '总字数'
        },

        chapterCount: {
            type: dataTypes.INTEGER(),
            allowNull: true,
            comment: '总章节数'
        },

        author: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: '作者名'
        },

        readCount: {
            type: dataTypes.INTEGER(),
            allowNull: true,
            comment: '阅读总数'
        },

        type: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: '分类名称'
        },

        pinyin: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: '分类名称拼音'
        },

        tags: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: '小说标签'
        },

        sourceName: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: '来源名称'
        },

        sourceUrl: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: '来源地址'
        },

        image: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: '图片本地名'
        },

        status: {
            type: dataTypes.INTEGER(2),
            allowNull: true,
            comment: '状态 1完本 2连载 3已下架'
        },

        configId: {
            type: dataTypes.STRING(),
            allowNull: false,
            comment: '配置项ID'
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
        tableName: 'biu_book_base'
    });
};
