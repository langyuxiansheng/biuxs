import apis from './wrapper';
export const {
    userLoginForSysAdmin,
    getImgValidate,
    uploadFile,
    //系统设置
    getSysAdminList,
    addSysAdmin,
    delSysAdminByIds,
    updateSysAdmin,
    getSysRoleList,
    addSysRole,
    delSysRoleByIds,
    updateSysRole,
    getSysPermissionList,
    addSysPermission,
    delSysPermissionByIds,
    updateSysPermission,
    getSysPermissionListToTree,
    getSysRolePermissionListToTree,
    setSysRolePermission,
    bindSysAdminRole,
    clearSysRoleAllPermission,
    getSysAdminBaseInfo,
    getSysRoleMenusToTree,
    updateSysPassword,
    getFiles,
    readeFileContent,
    deleteFiles,
    getSysLogList,
    getSysLogContent,
    delSysLogByPaths,
    //网站管理
    addWebsiteType,
    getWebsiteTypeList,
    getWebsiteTypes,
    updateWebsiteType,
    delWebsiteTypByIds,
    addWebsiteByAdmin,
    getWebsiteBaseList,
    updateWebsiteBase,
    delWebsiteBaseByIds,
    getOptionMsgList,
    delOptionMsgByIds,
    setWebpageBaseByAdmin,
    getWebpageBaseList,
    delWebpageBaseByIds,
    getUserBaseList,
    getIncludeLinkList,
    updateIncludeLink,
    delIncludeLinkByIds,
    getWebsiteBglibList,
    delWebsiteBglibByIds,
    addWebsiteBglibs,
    updateWebsiteBglib,
    //书籍管理
    getBookListByAdmin,
    delBookAdminByIds,
    updateBookAdmin,
    getBookChapterListByAdmin,
    delBookChapterAdminByIds,
    updateBookChapterAdmin,
    //配置项管理
    addConfig,
    getConfigList,
    getConfigByCode,
    updateConfig,
    delConfigByIds,
    runTaskByConfigId
} = apis;
