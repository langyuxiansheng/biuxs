/**
 * 书籍与标签中间表数据模型
 * @param {*} sequelize
 * @param {*} dataTypes
 * 此模型仅限关系型数据库使用
 */
module.exports = (sequelize, dataTypes) => {
    return sequelize.define('BookRelTag', {

        tagId: {
            type: dataTypes.STRING(),
            allowNull: false,
            primaryKey: true,
            comment: '分类ID'
        },

        bookId: {
            type: dataTypes.STRING(),
            allowNull: false,
            primaryKey: true,
            comment: '书籍id'
        },

        status: {
            type: dataTypes.INTEGER(2),
            allowNull: true,
            comment: '状态'
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
        tableName: 'biu_book_rel_tag'
    });
};
