import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _aeba66c6 = () => interopDefault(import('..\\client\\pages\\Login\\index.vue' /* webpackChunkName: "pages/Login/index" */))
const _a1e599d6 = () => interopDefault(import('..\\client\\pages\\Books\\BookList\\index.vue' /* webpackChunkName: "pages/Books/BookList/index" */))
const _e65a6d62 = () => interopDefault(import('..\\client\\pages\\Crawlers\\ConfigList\\index.vue' /* webpackChunkName: "pages/Crawlers/ConfigList/index" */))
const _72805603 = () => interopDefault(import('..\\client\\pages\\Home\\Welcome\\index.vue' /* webpackChunkName: "pages/Home/Welcome/index" */))
const _64bf3d0a = () => interopDefault(import('..\\client\\pages\\Login\\LoginForm\\index.vue' /* webpackChunkName: "pages/Login/LoginForm/index" */))
const _7f8a5f50 = () => interopDefault(import('..\\client\\pages\\Member\\Users\\index.vue' /* webpackChunkName: "pages/Member/Users/index" */))
const _2be9e161 = () => interopDefault(import('..\\client\\pages\\System\\AdminManage\\index.vue' /* webpackChunkName: "pages/System/AdminManage/index" */))
const _77dd418e = () => interopDefault(import('..\\client\\pages\\System\\FilesManage\\index.vue' /* webpackChunkName: "pages/System/FilesManage/index" */))
const _2eda048b = () => interopDefault(import('..\\client\\pages\\System\\LogsManage\\index.vue' /* webpackChunkName: "pages/System/LogsManage/index" */))
const _1cd8b6aa = () => interopDefault(import('..\\client\\pages\\System\\PermissionManage\\index.vue' /* webpackChunkName: "pages/System/PermissionManage/index" */))
const _5debdfb3 = () => interopDefault(import('..\\client\\pages\\System\\RolesManage\\index.vue' /* webpackChunkName: "pages/System/RolesManage/index" */))
const _38a3aa58 = () => interopDefault(import('..\\client\\pages\\Website\\Bglibs\\index.vue' /* webpackChunkName: "pages/Website/Bglibs/index" */))
const _285abb3a = () => interopDefault(import('..\\client\\pages\\Website\\IncludeLinks\\index.vue' /* webpackChunkName: "pages/Website/IncludeLinks/index" */))
const _aa731fea = () => interopDefault(import('..\\client\\pages\\Website\\Options\\index.vue' /* webpackChunkName: "pages/Website/Options/index" */))
const _088ecf70 = () => interopDefault(import('..\\client\\pages\\Website\\Settings\\index.vue' /* webpackChunkName: "pages/Website/Settings/index" */))
const _9fc0a0c6 = () => interopDefault(import('..\\client\\pages\\Website\\Sites\\index.vue' /* webpackChunkName: "pages/Website/Sites/index" */))
const _b01de9e0 = () => interopDefault(import('..\\client\\pages\\Website\\Types\\index.vue' /* webpackChunkName: "pages/Website/Types/index" */))
const _a0be9734 = () => interopDefault(import('..\\client\\pages\\Website\\WebContent\\index.vue' /* webpackChunkName: "pages/Website/WebContent/index" */))
const _2c848448 = () => interopDefault(import('..\\client\\pages\\Books\\BookList\\BookForm\\index.vue' /* webpackChunkName: "pages/Books/BookList/BookForm/index" */))
const _0d5fe749 = () => interopDefault(import('..\\client\\pages\\Crawlers\\ConfigList\\ConfigForm\\index.vue' /* webpackChunkName: "pages/Crawlers/ConfigList/ConfigForm/index" */))
const _752b2920 = () => interopDefault(import('..\\client\\pages\\System\\AdminManage\\AdminForm\\index.vue' /* webpackChunkName: "pages/System/AdminManage/AdminForm/index" */))
const _145b312c = () => interopDefault(import('..\\client\\pages\\System\\AdminManage\\BindRoleForm\\index.vue' /* webpackChunkName: "pages/System/AdminManage/BindRoleForm/index" */))
const _6b404079 = () => interopDefault(import('..\\client\\pages\\System\\FilesManage\\FileForm\\index.vue' /* webpackChunkName: "pages/System/FilesManage/FileForm/index" */))
const _5ae4075a = () => interopDefault(import('..\\client\\pages\\System\\LogsManage\\ReadLogDialog\\index.vue' /* webpackChunkName: "pages/System/LogsManage/ReadLogDialog/index" */))
const _45e7dc10 = () => interopDefault(import('..\\client\\pages\\System\\PermissionManage\\PermissionForm\\index.vue' /* webpackChunkName: "pages/System/PermissionManage/PermissionForm/index" */))
const _eb405b8e = () => interopDefault(import('..\\client\\pages\\System\\RolesManage\\RoleForm\\index.vue' /* webpackChunkName: "pages/System/RolesManage/RoleForm/index" */))
const _6dfbeb22 = () => interopDefault(import('..\\client\\pages\\Website\\Bglibs\\BgForm\\index.vue' /* webpackChunkName: "pages/Website/Bglibs/BgForm/index" */))
const _20bd4bd4 = () => interopDefault(import('..\\client\\pages\\Website\\IncludeLinks\\IncludeLinkForm\\index.vue' /* webpackChunkName: "pages/Website/IncludeLinks/IncludeLinkForm/index" */))
const _ba863b1c = () => interopDefault(import('..\\client\\pages\\Website\\Options\\OptionForm\\index.vue' /* webpackChunkName: "pages/Website/Options/OptionForm/index" */))
const _94136a9c = () => interopDefault(import('..\\client\\pages\\Website\\Sites\\SiteForm\\index.vue' /* webpackChunkName: "pages/Website/Sites/SiteForm/index" */))
const _422183dc = () => interopDefault(import('..\\client\\pages\\Website\\Types\\TypeForm\\index.vue' /* webpackChunkName: "pages/Website/Types/TypeForm/index" */))
const _e061a4de = () => interopDefault(import('..\\client\\pages\\Website\\WebContent\\ContentForm\\index.vue' /* webpackChunkName: "pages/Website/WebContent/ContentForm/index" */))
const _5ebb0a68 = () => interopDefault(import('..\\client\\pages\\Website\\IncludeLinks\\IncludeLinkForm\\UploadLogo\\index.vue' /* webpackChunkName: "pages/Website/IncludeLinks/IncludeLinkForm/UploadLogo/index" */))
const _93f2a774 = () => interopDefault(import('..\\client\\pages\\Website\\Sites\\SiteForm\\UploadLogo\\index.vue' /* webpackChunkName: "pages/Website/Sites/SiteForm/UploadLogo/index" */))
const _19a5b805 = () => interopDefault(import('..\\client\\pages\\Books\\BookList\\ChapterList\\_bookId.vue' /* webpackChunkName: "pages/Books/BookList/ChapterList/_bookId" */))
const _51ed9b38 = () => interopDefault(import('..\\client\\pages\\System\\RolesManage\\Settings\\_id.vue' /* webpackChunkName: "pages/System/RolesManage/Settings/_id" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/Login",
    component: _aeba66c6,
    name: "Login"
  }, {
    path: "/Books/BookList",
    component: _a1e599d6,
    name: "Books-BookList"
  }, {
    path: "/Crawlers/ConfigList",
    component: _e65a6d62,
    name: "Crawlers-ConfigList"
  }, {
    path: "/Home/Welcome",
    component: _72805603,
    name: "Home-Welcome"
  }, {
    path: "/Login/LoginForm",
    component: _64bf3d0a,
    name: "Login-LoginForm"
  }, {
    path: "/Member/Users",
    component: _7f8a5f50,
    name: "Member-Users"
  }, {
    path: "/System/AdminManage",
    component: _2be9e161,
    name: "System-AdminManage"
  }, {
    path: "/System/FilesManage",
    component: _77dd418e,
    name: "System-FilesManage"
  }, {
    path: "/System/LogsManage",
    component: _2eda048b,
    name: "System-LogsManage"
  }, {
    path: "/System/PermissionManage",
    component: _1cd8b6aa,
    name: "System-PermissionManage"
  }, {
    path: "/System/RolesManage",
    component: _5debdfb3,
    name: "System-RolesManage"
  }, {
    path: "/Website/Bglibs",
    component: _38a3aa58,
    name: "Website-Bglibs"
  }, {
    path: "/Website/IncludeLinks",
    component: _285abb3a,
    name: "Website-IncludeLinks"
  }, {
    path: "/Website/Options",
    component: _aa731fea,
    name: "Website-Options"
  }, {
    path: "/Website/Settings",
    component: _088ecf70,
    name: "Website-Settings"
  }, {
    path: "/Website/Sites",
    component: _9fc0a0c6,
    name: "Website-Sites"
  }, {
    path: "/Website/Types",
    component: _b01de9e0,
    name: "Website-Types"
  }, {
    path: "/Website/WebContent",
    component: _a0be9734,
    name: "Website-WebContent"
  }, {
    path: "/Books/BookList/BookForm",
    component: _2c848448,
    name: "Books-BookList-BookForm"
  }, {
    path: "/Crawlers/ConfigList/ConfigForm",
    component: _0d5fe749,
    name: "Crawlers-ConfigList-ConfigForm"
  }, {
    path: "/System/AdminManage/AdminForm",
    component: _752b2920,
    name: "System-AdminManage-AdminForm"
  }, {
    path: "/System/AdminManage/BindRoleForm",
    component: _145b312c,
    name: "System-AdminManage-BindRoleForm"
  }, {
    path: "/System/FilesManage/FileForm",
    component: _6b404079,
    name: "System-FilesManage-FileForm"
  }, {
    path: "/System/LogsManage/ReadLogDialog",
    component: _5ae4075a,
    name: "System-LogsManage-ReadLogDialog"
  }, {
    path: "/System/PermissionManage/PermissionForm",
    component: _45e7dc10,
    name: "System-PermissionManage-PermissionForm"
  }, {
    path: "/System/RolesManage/RoleForm",
    component: _eb405b8e,
    name: "System-RolesManage-RoleForm"
  }, {
    path: "/Website/Bglibs/BgForm",
    component: _6dfbeb22,
    name: "Website-Bglibs-BgForm"
  }, {
    path: "/Website/IncludeLinks/IncludeLinkForm",
    component: _20bd4bd4,
    name: "Website-IncludeLinks-IncludeLinkForm"
  }, {
    path: "/Website/Options/OptionForm",
    component: _ba863b1c,
    name: "Website-Options-OptionForm"
  }, {
    path: "/Website/Sites/SiteForm",
    component: _94136a9c,
    name: "Website-Sites-SiteForm"
  }, {
    path: "/Website/Types/TypeForm",
    component: _422183dc,
    name: "Website-Types-TypeForm"
  }, {
    path: "/Website/WebContent/ContentForm",
    component: _e061a4de,
    name: "Website-WebContent-ContentForm"
  }, {
    path: "/Website/IncludeLinks/IncludeLinkForm/UploadLogo",
    component: _5ebb0a68,
    name: "Website-IncludeLinks-IncludeLinkForm-UploadLogo"
  }, {
    path: "/Website/Sites/SiteForm/UploadLogo",
    component: _93f2a774,
    name: "Website-Sites-SiteForm-UploadLogo"
  }, {
    path: "/Books/BookList/ChapterList/:bookId?",
    component: _19a5b805,
    name: "Books-BookList-ChapterList-bookId"
  }, {
    path: "/System/RolesManage/Settings/:id?",
    component: _51ed9b38,
    name: "System-RolesManage-Settings-id"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
