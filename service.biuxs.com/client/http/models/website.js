import { API_SERVER } from './types';
export default {

    /**
     * 管理员添加网站分类
     * @param {*} data
     */
    addWebsiteType: {
        url: `${API_SERVER}/website/site/addWebsiteType`,
        method: 'post'
    },

    /**
     * 管理员获取网站分类列表
     * @param {*} data
     */
    getWebsiteTypeList: {
        url: `${API_SERVER}/website/getWebsiteTypeList`,
        method: 'get'
    },

    /**
     * 获取网站分类列表(无需token)
     * @param {*} data
     */
    getWebsiteTypes: {
        url: `${API_SERVER}/biunav/site/getWebsiteTypes`,
        method: 'get'
    },

    /**
     * 管理员编辑网站分类
     * @param {*} data
     */
    updateWebsiteType: {
        url: `${API_SERVER}/website/updateWebsiteType`,
        method: 'put'
    },

    /**
     * 管理员删除网站分类
     * @param {*} data
     */
    delWebsiteTypByIds: {
        url: `${API_SERVER}/website/delWebsiteTypByIds`,
        method: 'delete'
    },

    /**
     * 管理员添加网站基础信息
     * @param {*} data
     */
    addWebsiteByAdmin: {
        url: `${API_SERVER}/website/addWebsiteByAdmin`,
        method: 'post'
    },

    /**
     * 管理员获取网站列表
     * @param {*} data
     */
    getWebsiteBaseList: {
        url: `${API_SERVER}/website/getWebsiteBaseList`,
        method: 'get'
    },

    /**
     * 管理员编辑网站
     * @param {*} data
     */
    updateWebsiteBase: {
        url: `${API_SERVER}/website/updateWebsiteBase`,
        method: 'put'
    },

    /**
     * 管理员删除网站
     * @param {*} data
     */
    delWebsiteBaseByIds: {
        url: `${API_SERVER}/website/delWebsiteBaseByIds`,
        method: 'delete'
    },

    /**
     * 管理员获取网站留言列表
     * @param {*} data
     */
    getOptionMsgList: {
        url: `${API_SERVER}/website/getOptionMsgList`,
        method: 'get'
    },

    /**
     * 管理员删除网站留言列表
     * @param {*} data
     */
    delOptionMsgByIds: {
        url: `${API_SERVER}/website/delOptionMsgByIds`,
        method: 'put'
    },

    /**
     * 管理员设置网站富文本页面
     * @param {*} data
     */
    setWebpageBaseByAdmin: {
        url: `${API_SERVER}/website/setWebpageBaseByAdmin`,
        method: 'put'
    },

    /**
     * 管理员获取网站富文本列表
     * @param {*} data
     */
    getWebpageBaseList: {
        url: `${API_SERVER}/website/getWebpageBaseList`,
        method: 'get'
    },

    /**
     * 删除富文本
     * @param {*} data
     */
    delWebpageBaseByIds: {
        url: `${API_SERVER}/website/delWebpageBaseByIds`,
        method: 'delete'
    },

    /**
     * 管理员获网站的会员列表
     * @param {*} data
     */
    getUserBaseList: {
        url: `${API_SERVER}/member/getUserBaseList`,
        method: 'get'
    },

    /**
     * 管理员获取申请收录的链接列表
     * @param {*} data
     */
    getIncludeLinkList: {
        url: `${API_SERVER}/website/getIncludeLinkList`,
        method: 'get'
    },

    /**
     * 管理员编辑申请收录的链接
     * @param {*} data
     */
    updateIncludeLink: {
        url: `${API_SERVER}/website/updateIncludeLink`,
        method: 'put'
    },

    /**
     * 管理员删除申请收录的链接
     * @param {*} data
     */
    delIncludeLinkByIds: {
        url: `${API_SERVER}/website/delIncludeLinkByIds`,
        method: 'delete'
    },

    /**
     * 管理员获取网站搜索分类列表
     * @param {*} data
     */
    getSearchTypeList: {
        url: `${API_SERVER}/website/search/getSearchTypeList`,
        method: 'get'
    },

    /**
     * 管理员删除网站搜索分类
     * @param {*} data
     */
    delSearchTypeByIds: {
        url: `${API_SERVER}/website/search/delSearchTypeByIds`,
        method: 'delete'
    },

    /**
     * 管理员添加网站搜索分类
     * @param {*} data
     */
    addSearchType: {
        url: `${API_SERVER}/website/search/addSearchType`,
        method: 'post'
    },

    /**
     * 管理员编辑网站搜索分类
     * @param {*} data
     */
    updateSearchType: {
        url: `${API_SERVER}/website/search/updateSearchType`,
        method: 'post'
    },

    /**
     * 管理员获取网站分类标签链接列表
     * @param {*} data
     */
    getSearchTagList: {
        url: `${API_SERVER}/website/search/getSearchTagList`,
        method: 'get'
    },

    /**
     * 管理员删除网站分类标签链接
     * @param {*} data
     */
    delSearchTagByIds: {
        url: `${API_SERVER}/website/search/delSearchTagByIds`,
        method: 'delete'
    },

    /**
     * 管理员添加网站分类标签链接
     * @param {*} data
     */
    addSearchTagByAdmin: {
        url: `${API_SERVER}/website/search/addSearchTagByAdmin`,
        method: 'post'
    },

    /**
     * 管理员编辑网站分类标签链接
     * @param {*} data
     */
    updateSearchTag: {
        url: `${API_SERVER}/website/search/updateSearchTag`,
        method: 'put'
    },

    /**
     * 管理员获取网站背景图列表
     * @param {*} data
     */
    getWebsiteBglibList: {
        url: `${API_SERVER}/website/getWebsiteBglibList`,
        method: 'get'
    },

    /**
     * 管理员删除网站背景图
     * @param {*} data
     */
    delWebsiteBglibByIds: {
        url: `${API_SERVER}/website/delWebsiteBglibByIds`,
        method: 'delete'
    },

    /**
     * 管理员添加网站背景图
     * @param {*} data
     */
    addWebsiteBglibs: {
        url: `${API_SERVER}/website/addWebsiteBglibs`,
        method: 'post'
    },

    /**
     * 管理员编辑网站背景图
     * @param {*} data
     */
    updateWebsiteBglib: {
        url: `${API_SERVER}/website/updateWebsiteBglib`,
        method: 'put'
    }

};
