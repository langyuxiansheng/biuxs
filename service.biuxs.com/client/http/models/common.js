import { API_SERVER } from './types';
export default {

    /**
     * 获取图片验证码
     * @param {*} data
     */
    getImgValidate: {
        url: `${API_SERVER}/common/utils/getImgValidate`,
        method: 'get'
    },

    /**
     * 系统用户登录
     * @param {*} data
     */
    userLoginForSysAdmin: {
        url: `${API_SERVER}/common/login/userLoginForSysAdmin`,
        method: 'post'
    },

    /**
     * 文件上传
     * @param {*} data
     */
    uploadFile: {
        url: `${API_SERVER}/common/files/uploadFile`,
        method: 'post'
    },

    /**
     * 添加轮播图
     * @param {*} data
     */
    addBanner: {
        url: `${API_SERVER}/common/banner/addBanner`,
        method: 'post'
    },

    /**
     * 获取轮播图列表
     * @param {*} data
     */
    getBannerList: {
        url: `${API_SERVER}/common/banner/getBannerList`,
        method: 'get'
    },

    /**
     * 编辑轮播图
     * @param {*} data
     */
    updateBanner: {
        url: `${API_SERVER}/common/banner/updateBanner`,
        method: 'put'
    },

    /**
     * 删除轮播图
     * @param {*} data
     */
    delBannerByIds: {
        url: `${API_SERVER}/common/banner/delBannerByIds`,
        method: 'delete'
    }
};
