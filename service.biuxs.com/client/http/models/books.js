import { API_SERVER } from './types';
export default {

    /**
     * 管理员获取书籍列表
     * @param {*} data
     */
    getBookListByAdmin: {
        url: `${API_SERVER}/books/book/getBookListByAdmin`,
        method: 'get'
    },

    /**
     * 管理员删除书籍
     * @param {*} data
     */
    delBookAdminByIds: {
        url: `${API_SERVER}/books/book/delBookAdminByIds`,
        method: 'delete'
    },

    /**
     * 管理员修改书籍
     * @param {*} data
     */
    updateBookAdmin: {
        url: `${API_SERVER}/books/book/updateBookAdmin`,
        method: 'put'
    },

    /**
     * 管理员获取书籍章节列表
     * @param {*} data
     */
    getBookChapterListByAdmin: {
        url: `${API_SERVER}/books/book/getBookChapterListByAdmin`,
        method: 'get'
    },

    /**
     * 管理员删除书籍章节
     * @param {*} data
     */
    delBookChapterAdminByIds: {
        url: `${API_SERVER}/books/book/delBookChapterAdminByIds`,
        method: 'delete'
    },

    /**
     * 管理员修改书籍章节
     * @param {*} data
     */
    updateBookChapterAdmin: {
        url: `${API_SERVER}/books/book/updateBookChapterAdmin`,
        method: 'put'
    }

};
