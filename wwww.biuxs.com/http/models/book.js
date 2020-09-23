import { API_SERVER } from './types';
export default {
    /**
     * 获取书籍详情数据（无需token）
     */
    getBookDetailData: {
        url: `${API_SERVER}/biuxs/book/getBookDetailData`,
        method: 'get'
    },

    /**
     * 获取书籍章节列表（无需token）
     */
    getBookChapterListData: {
        url: `${API_SERVER}/biuxs/book/getBookChapterListData`,
        method: 'get'
    },

    /**
     * 获取书籍章节内容（无需token）
     */
    getBookChapterArticleData: {
        url: `${API_SERVER}/biuxs/book/getBookChapterArticleData`,
        method: 'get'
    }

};
