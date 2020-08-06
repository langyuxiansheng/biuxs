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
    }
};
