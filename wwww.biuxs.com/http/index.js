import apis from './wrapper';
export const {
    getWebpageBaseByMenu,
    getWebsiteTypes,
    getImgValidate,
    sendEmailValidateCode,
    addOptionMsg,
    getLinksByType,
    getHotSearchKeywords,
    //====
    uploadFile,
    deleteFiles,
    userRegister,
    sendUserRegisterEmailCode,
    userLogin,
    getUserInfoBySelf,
    userLogout,
    sendUserResetPwdEmailCode,
    userResetPwd,
    userUpdatePwd,
    userUpdateBaseInfo,
    userUpdateAvatar,
    addIncludeLink,
    userAddBookmarkFolder,
    getUserBookmarkFolders,
    userUpdateBookmarkFolder,
    userSortBookmarkFolder,
    delUserBookmarkFolderByIds,
    userAddBookmarkLink,
    getUserFolderBookmarkLinks,
    userUpdateBookmarkLink,
    userSortBookmarkLink,
    delUserBookmarkLinkByIds,
    getUserBookmarkHomeData,
    //===
    getCraWebSiteBase,
    addBlacklistCompanyByWeb,
    getCompanyBlacklist,
    getBackgroundLibs,

    //移动端首页
    getHomeMobileData,
    getBookDetailData,
    getBookChapterListData

} = apis;
