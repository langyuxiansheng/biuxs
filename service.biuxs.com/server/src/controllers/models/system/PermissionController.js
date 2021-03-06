/**
 * 系统管理员管理
 */
const KoaRouter = require('koa-router');
const PermissionService = require(':services/system/PermissionService');
const controller = new KoaRouter({ prefix: '/prem' });
const service = new PermissionService();

//添加权限菜单
controller.post('/addSysPermission', async(ctx) => {
    ctx.body = await service.addSysPermission(ctx.request.body, ctx.state.user);
});

//查询权限菜单
controller.get('/getSysPermissionList', async(ctx) => {
    ctx.body = await service.getSysPermissionList(ctx.request.query, ctx.state.user);
});

//删除权限菜单
controller.delete('/delSysPermissionByIds', async(ctx) => {
    ctx.body = await service.delSysPermissionByIds(ctx.request.body, ctx.state.user);
});

//更新权限菜单
controller.put('/updateSysPermission', async(ctx) => {
    ctx.body = await service.updateSysPermission(ctx.request.body, ctx.state.user);
});

//权限菜单树形
controller.get('/getSysPermissionListToTree', async(ctx) => {
    ctx.body = await service.getSysPermissionListToTree(ctx.request.query, ctx.state.user);
});

//获取角色的权限
controller.get('/getSysRolePermissionListToTree', async(ctx) => {
    ctx.body = await service.getSysRolePermissionListToTree(ctx.request.query, ctx.state.user);
});

//设置角色权限
controller.put('/setSysRolePermission', async(ctx) => {
    ctx.body = await service.setSysRolePermission(ctx.request.body, ctx.state.user);
});

//清除角色的所有权限
controller.delete('/clearSysRoleAllPermission', async(ctx) => {
    ctx.body = await service.clearSysRoleAllPermission(ctx.request.body, ctx.state.user);
});

//获取角色的树形菜单
controller.get('/getSysRoleMenusToTree', async(ctx) => {
    ctx.body = await service.getSysRoleMenusToTree(ctx.state.user);
});

module.exports = controller;
