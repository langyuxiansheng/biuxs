import { API_SERVER } from './types';
export default {
    /**
     * 获取首页数据
     */
    getiteHomeData: {
        url: `${API_SERVER}/biunav/site/getHomeData`,
        method: 'get'
    },

    /**
     * 文件上传
     * @param {*} data
     */
    uploadFile: {
        url: `${API_SERVER}/common/uploadFile`,
        method: 'post'
    },

    /**
     * 文件删除
     * @param {*} data
     */
    deleteFiles: {
        url: `${API_SERVER}/common/deleteFiles`,
        method: 'post'
    },

    /**
     * 获取图片验证码
     * @param {*} data
     */
    getImgValidate: {
        url: `${API_SERVER}/common/getImgValidate`,
        method: 'get'
    },

    /**
     * 获取邮件验证码
     * @param {*} data
     */
    sendEmailValidateCode: {
        url: `${API_SERVER}/common/sendEmailValidateCode`,
        method: 'post'
    }

};
