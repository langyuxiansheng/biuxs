<template>
    <div class="sidebar-menu" :class="{'sidebar-width': !isCollapse}">
        <h3 :title="isCollapse ? '点击展开' : '点击收起'" class="title" @click="isCollapse = !isCollapse">
            <template v-if="isCollapse">
                BSA
            </template>
            <template v-else>
                {{ $store.state.config.name }}
            </template>
            <p class="version">
                {{ $store.state.config.version }}
            </p>
        </h3>
        <el-menu :collapse-transition="false" :collapse="isCollapse" background-color="rgba(0,0,0,0)" text-color="#fff" active-text-color="#ffcb04" :default-active="$route.path" unique-opened router>
            <template v-for="(menu,k) in sideMenus">
                <el-submenu :key="k" :index="menu.permissionId" popper-class="sidebar-submenu">
                    <template slot="title">
                        <i :class="menu.icon" />
                        <span>{{ menu.title }}</span>
                    </template>
                    <template v-if="menu.children">
                        <template v-for="item in menu.children">
                            <el-menu-item v-if="item.type == 1 && systems.includes(item.path) && user.isAdmin" :key="item.permissionId" :index="`${menu.path}/${item.path}`">
                                <span class="sidebar-menu-item" @click="setPermission(item.children || [])">
                                    {{ item.title }}
                                </span>
                            </el-menu-item>
                            <el-menu-item v-else-if="item.type == 1 && !systems.includes(item.path)" :key="item.permissionId" :index="`${menu.path}/${item.path}`">
                                <span class="sidebar-menu-item" @click="setPermission(item.children || [])">
                                    {{ item.title }}
                                </span>
                            </el-menu-item>
                        </template>
                    </template>
                </el-submenu>
            </template>
        </el-menu>
    </div>
</template>
<script type="text/ecmascript-6">
import { getSysRoleMenusToTree } from '@/http';
export default {
    name: 'Sidebar',
    data() {
        return {
            isCollapse: false,
            sideMenus: [],
            systems: ['PermissionManage', 'AdminManage', 'RolesManage']
        };
    },
    computed: {
        user() {
            if (window && window.localStorage) {
                const user = window.localStorage.getItem(`BIU-SERVER-ADMIN-INFO`);
                return typeof user === 'string' ? JSON.parse(user) : user || {};
            }
            return {};
        }
    },
    created() {
        this.init();
    },
    methods: {
        async init() {
            const { data } = await this.$axios[getSysRoleMenusToTree.method](getSysRoleMenusToTree.url);
            let arr = [{
                'permissionId': '6A7715BE30B7E36F239081784C91A1DB',
                'title': '首页',
                'path': '/Home',
                'name': 'Home',
                'icon': 'iconfont iconicon_work',
                'children': [
                    {
                        'permissionId': '94147C10163735F7BC8848C9586342F9',
                        'type': 1,
                        'title': '欢迎页',
                        'path': 'Welcome',
                        'name': 'Welcome'
                    }
                ]
            }];
            this.sideMenus = arr.concat(data) || [];
        },

        /**
         * 设置权限
         */
        setPermission(list) {
            console.log(list);
            this.$store.dispatch('setPermission', list.map(v => v.name));
        }
    }
};
</script>
<style lang="less" scoped>
@import '~@/assets/styles/common/constant.less';
.sidebar-menu {
    background: linear-gradient(160deg, #7faadc, @app-theme-color 66%);
    height: 100%;
    .title {
        padding: 20px 0;
        text-align: center;
        font-size: 20px;
        color: #fff;
        font-weight: bold;
        cursor: pointer;
        transition: color .2s ease-in;
        border-bottom: 1px solid @app-boder-color;
        &:hover{
            color: #faad14;
        }
        .version{
            font-size: 12px;
            margin-top: 10px;
        }
    }
    & /deep/ .el-menu {
        border-right: 0;
        .sidebar-menu-item {
            padding-left: 20px;
        }
        .el-submenu__title i{
            color: inherit;
        }
    }
    .sidebar-submenu {
        background: #ccc;
    }
}
.sidebar-width{
    width: 240px;
}
</style>
