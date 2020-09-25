/**
 * 书籍章节数据模型
 * @param {*} sequelize
 * @param {*} dataTypes
 * 此模型仅限关系型数据库使用
 */
const { getTimeStampUUID } = require(':lib/Utils');
module.exports = (sequelize, dataTypes) => {
    return sequelize.define('BookChapter', {

        chapterId: {
            type: dataTypes.STRING(),
            allowNull: false,
            primaryKey: true,
            defaultValue: () => getTimeStampUUID(),
            comment: '章节ID'
        },

        index: {
            type: dataTypes.INTEGER(),
            allowNull: true,
            comment: '章节索引'
        },

        title: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: '章节名称'
        },

        url: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: 'URL(内容详情地址)'
        },

        bookId: {
            type: dataTypes.STRING(),
            allowNull: false,
            comment: '书籍ID'
        },

        status: {
            type: dataTypes.INTEGER(2),
            allowNull: true,
            comment: '状态 1已完成内容抓取  2未完成内容抓取 3抓取内容失败'
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
        tableName: 'biu_book_chapter',
        indexes: [
            {
                unique: true,
                fields: [ 'chapterId' ]
            },
            {
                index: true,
                fields: [ 'bookId' ]
            }
        ]
    });
};
