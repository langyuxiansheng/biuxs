import { API_SERVER } from './types';
export default {
    /**
     * 会员注册
     */
    userRegister: {
        url: `${API_SERVER}/member/userRegister`,
        method: 'post'
    },

    /**
     * 会员注册发送邮件验证码
     */
    sendUserRegisterEmailCode: {
        url: `${API_SERVER}/member/sendUserRegisterEmailCode`,
        method: 'post'
    },

    /**
     * 会员登录
     */
    userLogin: {
        url: `${API_SERVER}/member/userLogin`,
        method: 'post'
    },

    /**
     * 登录会员获取身份信息
     */
    getUserInfoBySelf: {
        url: `${API_SERVER}/member/getUserInfoBySelf`,
        method: 'get'
    },

    /**
     * 会员退出登录
     */
    userLogout: {
        url: `${API_SERVER}/member/userLogout`,
        method: 'put'
    },

    /**
     * 发送重置密码邮件验证码
     */
    sendUserResetPwdEmailCode: {
        url: `${API_SERVER}/member/sendUserResetPwdEmailCode`,
        method: 'post'
    },

    /**
     * 会员重置密码
     */
    userResetPwd: {
        url: `${API_SERVER}/member/userResetPwd`,
        method: 'post'
    },

    /**
     * 用户修改密码(修改成功后会发送邮件)
     */
    userUpdatePwd: {
        url: `${API_SERVER}/member/userUpdatePwd`,
        method: 'put'
    },

    /**
     * 用户修改个性资料
     */
    userUpdateBaseInfo: {
        url: `${API_SERVER}/member/userUpdateBaseInfo`,
        method: 'put'
    },

    /**
     * 用户修改头像
     */
    userUpdateAvatar: {
        url: `${API_SERVER}/member/userUpdateAvatar`,
        method: 'put'
    },

    /**
     * 用户新建文件夹
     */
    userAddBookmarkFolder: {
        url: `${API_SERVER}/member/bookmark/userAddBookmarkFolder`,
        method: 'post'
    },

    /**
     * 用户获取文件夹列表
     */
    getUserBookmarkFolders: {
        url: `${API_SERVER}/member/bookmark/getUserBookmarkFolders`,
        method: 'get'
    },

    /**
     * 用户修改文件夹的信息
     */
    userUpdateBookmarkFolder: {
        url: `${API_SERVER}/member/bookmark/userUpdateBookmarkFolder`,
        method: 'put'
    },

    /**
     * 用户文件夹拖拽排序
     */
    userSortBookmarkFolder: {
        url: `${API_SERVER}/member/bookmark/userSortBookmarkFolder`,
        method: 'put'
    },

    /**
     * 用户批量删除文件夹
     */
    delUserBookmarkFolderByIds: {
        url: `${API_SERVER}/member/bookmark/delUserBookmarkFolderByIds`,
        method: 'delete'
    },

    /**
     * 用户新建书签到文件夹下
     */
    userAddBookmarkLink: {
        url: `${API_SERVER}/member/bookmark/userAddBookmarkLink`,
        method: 'post'
    },

    /**
     * 用户获取文件夹下的书签
     */
    getUserFolderBookmarkLinks: {
        url: `${API_SERVER}/member/bookmark/getUserFolderBookmarkLinks`,
        method: 'get'
    },

    /**
     * 用户获取文件夹下的书签
     */
    userUpdateBookmarkLink: {
        url: `${API_SERVER}/member/bookmark/userUpdateBookmarkLink`,
        method: 'put'
    },

    /**
     * 用户书签拖拽排序
     */
    userSortBookmarkLink: {
        url: `${API_SERVER}/member/bookmark/userSortBookmarkLink`,
        method: 'put'
    },

    /**
     * 用户批量删除文件夹下的书签
     */
    delUserBookmarkLinkByIds: {
        url: `${API_SERVER}/member/bookmark/delUserBookmarkLinkByIds`,
        method: 'delete'
    },

    /**
     * 用户批量删除文件夹下的书签
     */
    getUserBookmarkHomeData: {
        url: `${API_SERVER}/member/bookmark/getUserBookmarkHomeData`,
        method: 'get'
    }

};
