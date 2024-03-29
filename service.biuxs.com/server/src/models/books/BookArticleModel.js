/**
 * 书籍文章数据模型
 * @param {*} sequelize
 * @param {*} dataTypes
 * 此模型仅限关系型数据库使用
 */
module.exports = (sequelize, dataTypes) => {
    return sequelize.define('BookArticle', {

        articleId: {
            type: dataTypes.STRING(),
            allowNull: false,
            primaryKey: true,
            comment: '文章ID => 同章节id'
        },

        index: {
            type: dataTypes.INTEGER(),
            allowNull: true,
            comment: '章节索引'
        },

        title: {
            type: dataTypes.STRING(),
            allowNull: true,
            comment: '文章标题'
        },

        content: {
            type: dataTypes.TEXT('long'),
            allowNull: true,
            comment: '章节内容'
        },

        letterCount: {
            type: dataTypes.INTEGER(),
            allowNull: true,
            comment: '本章节总字数'
        },

        status: {
            type: dataTypes.INTEGER(2),
            allowNull: true,
            comment: '状态'
        },

        bookId: {
            type: dataTypes.STRING(),
            allowNull: false,
            comment: '书籍ID 方便统计与删除'
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
        tableName: 'biu_book_article',
        indexes: [
            {
                unique: true,
                fields: [ 'articleId' ]
            }
        ]
    });
};
