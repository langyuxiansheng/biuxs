import { API_SERVER } from './types';
export default {
    /**
     * 获取网站富文本列表(无需token)
     */
    getWebpageBaseByMenu: {
        url: `${API_SERVER}/biunav/site/getWebpageBaseByMenu`,
        method: 'get'
    },

    /**
     * 获取首页数据
     */
    getSiteHomeData: {
        url: `${API_SERVER}/biunav/site/getHomeData`,
        method: 'get'
    },

    /**
     * 获取网站分类列表(无需token)
     */
    getWebsiteTypes: {
        url: `${API_SERVER}/biunav/site/getWebsiteTypes`,
        method: 'get'
    },

    /**
     * 用户提交收录链接（无需token）
     */
    addIncludeLink: {
        url: `${API_SERVER}/biunav/site/addIncludeLink`,
        method: 'post'
    },

    /**
     * 用户留言反馈（无需token）
     */
    addOptionMsg: {
        url: `${API_SERVER}/biunav/site/addOptionMsg`,
        method: 'post'
    },

    /**
     * 根据分类的拼音名获取分类及其下面的链接（无需token）
     */
    getLinksByType: {
        url: `${API_SERVER}/biunav/site/getLinksByType`,
        method: 'get'
    },

    /**
     * 抓取新浪微博的热搜词（无需token）
     */
    getHotSearchKeywords: {
        url: `${API_SERVER}/biunav/site/getHotSearchKeywords`,
        method: 'get'
    },

    /**
     * 公众举报公司（无需token）
     */
    addBlacklistCompanyByWeb: {
        url: `${API_SERVER}/biunav/site/addBlacklistCompanyByWeb`,
        method: 'post'
    },

    /**
     * 查询黑名单公司（无需token）
     */
    getCompanyBlacklist: {
        url: `${API_SERVER}/biunav/site/getCompanyBlacklist`,
        method: 'get'
    },

    /**
     * 获取背景图库（无需token）
     */
    getBackgroundLibs: {
        url: `${API_SERVER}/biunav/site/getBackgroundLibs`,
        method: 'get'
    }

};
