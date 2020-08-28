<template>
    <div class="app-user-center app-content">
        <AppBreadcrumb :navs="navs" />
        <div v-if="user" class="u-container">
            <div class="u-info">
                <div class="avatar-c">
                    <span class="avatar-tips" @click="showDialog ({ type:'avatar' }) ">更换头像</span>
                    <img v-if="user.avatar" class="avatar-img" :src="`${$IMAGE_PATH}${user.avatar}`" alt="avatar">
                    <img v-else class="avatar-img" :src="require('@/assets/images/default-avatar.png')" alt="avatar">
                </div>
                <div class="u-items">
                    <p class="u-nickname">
                        {{ user.nickname || '无名大侠' }}
                    </p>
                    <p class="u-line-text">
                        <i class="iconfont icongongsi" />
                        <span class="u-label">公司:</span>
                        <span>{{ user.company || '这家伙很懒,什么也没留下' }}</span>
                        <span v-if="user.profession">︳{{ user.profession }}</span>
                    </p>
                    <p class="u-line-text">
                        <i class="iconfont icongexingqianming1" />
                        <span class="u-label">签名:</span>
                        <span>{{ user.sign || '这家伙很懒,什么也没留下' }}</span>
                    </p>
                    <p class="u-line-text">
                        <i class="iconfont iconjianjie" />
                        <span class="u-label">简介:</span>
                        <span>{{ user.brief || '这家伙很懒,什么也没留下' }}</span>
                    </p>
                    <p class="u-line-text">
                        <i class="iconfont iconicon13" />
                        <span class="u-label">主页:</span>
                        <a v-if="user.homePage" :href="user.homePage" target="_blank" rel="noopener noreferrer">
                            {{ user.homePage }}
                        </a>
                        <span v-else>这家伙很懒,什么也没留下</span>
                    </p>
                </div>
            </div>
            <ul class="user-tabs">
                <template v-for="(item,k) in tabs">
                    <li :key="k" class="tab">
                        <a :class="{'active':activeComponent == item.value}" href="javascript:void(0)" @click="handleTabs(item)">
                            {{ item.title }}
                        </a>
                    </li>
                </template>
            </ul>
            <div class="user-tab-content">
                <component :is="activeComponent" :user-info="user" @refresh="refresh()" />
            </div>
        </div>
        <upload-avatar ref="UploadAvatar" @refresh="refresh()" />
    </div>
</template>
<script>
import util from '@/lib/util';
import conf from '@/base/config';
import { userUpdateBaseInfo, getUserInfoBySelf } from '@/http';
import UserBaseForm from './UserBaseForm';
import MyBookmark from './MyBookmark';
import UploadAvatar from './UploadAvatar';
import UpdatePwdForm from './UpdatePwdForm';
export default {
    name: 'User',
    layout: 'child-nosearch',
    components: {
        UserBaseForm,
        MyBookmark,
        UploadAvatar,
        UpdatePwdForm
    },
    data() {
        return {
            user: null,
            navs: [
                {
                    label: '主页',
                    link: '/'
                },
                {
                    label: '用户中心',
                    link: '/member/user'
                },
                {
                    label: '基本资料'
                }
            ],
            tabs: [
                {
                    title: '基本资料',
                    value: 'UserBaseForm'
                },
                {
                    title: '我的书签',
                    value: 'MyBookmark'
                },
                {
                    title: '修改密码',
                    value: 'UpdatePwdForm'
                }
            ],
            isEdit: false,
            activeComponent: 'UserBaseForm'
        };
    },
    computed: {
        userInfo() {
            return this.$store.state.user.userInfo;
        }
    },
    watch: {
        userInfo(v) {
            if (v) {
                this.user = v;
                this.user.copyacc = v.account && v.account.split('biunav')[1];
            }
        }
    },
    mounted() {
        if (!util.getCookie(conf.COOKIE_JWT_KEY)) {
            this.$message.error(`检测到您未登录,请登录后访问!`);
        }
    },

    methods: {

        /**
	     * 弹出层控制
	     */
        showDialog ({ type, data }) {
            if (type === 'avatar') {
                this.$refs.UploadAvatar.init({ type });
            }
        },

        /**
         * 模式切换
         */
        handleIsEdit(isEdit) {
            this.isEdit = isEdit;
        },

        /**
         * 格式认证类型
         * @param auth 认证类型
         * @param type 0 手机号 1 邮箱 2 QQOpenID 3 微信OpenID
         * @description 以 8421BCD 的形式排列
         */
        formatAuthType(auth, type) {
            const res = auth ? auth.substr(type, 1) : 0;
            return res === '1';
        },

        /**
         * 提交用户修改的资料
         */
        async submitUserInfo() {
            try {
                console.log(JSON.stringify(this.user));
                if (this.user.copyacc) {
                    this.user.account = `biunav${this.user.copyacc || ''}`;
                }
                const { code } = await this.$axios[userUpdateBaseInfo.method](userUpdateBaseInfo.url, this.user);
                if (code == 200) {
                    this.isEdit = false;
                    this.$message.success('修改成功');
                }
            } catch (error) {
                console.error(`修改资料出错:`, error);
            }
        },

        /**
         * 标签页切换
         */
        handleTabs({ value, title }) {
            this.navs[1].label = title;
            this.activeComponent = value;
        },

        async refresh() {
            try {
                const { data } = await this.$axios[getUserInfoBySelf.method](getUserInfoBySelf.url);
                this.$store.dispatch('user/setUserInfo', data);
            } catch (error) {
                console.error(`获取用户信息出错:`, error);
            }
        }

    }
};
</script>
<style lang="less" scoped>
@import url('~@/assets/styles/common/constant');
.app-user-center{
    .u-container{
        margin: 10px auto 20px;
        .u-info{
            background: #fff;
            text-align: center;
            padding: 20px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            .avatar-c{
                width: 120px;
                height: 120px;
                border-radius: 60px;
                overflow: hidden;
                position: relative;
                background: #f9f9f9;
                .avatar-tips{
                    opacity: 0;
                    cursor: pointer;
                    display: inline-block;
                    width: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    text-align: center;
                    height: 120px;
                    line-height: 120px;
                    background: rgba(0, 0, 0, .5);
                    color: #fff;
                    transition: all .2s ease-in;
                }
                &:hover .avatar-tips{
                    opacity: 1;
                }
                .avatar-img{
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                }
            }
            .u-items{
                flex: 1;
                text-align: left;
                padding: 0 40px;
                .u-nickname{
                    font-size: 24px;
                }
                .u-line-text{
                    margin-top: 12px;
                    span,
                    a{
                        color: #72777b;
                    }
                    .u-label{
                        display: inline-block;
                        margin-right: 4px;
                    }
                    a{
                        transition: all .2s ease-in;
                        &:hover{
                            color: @app-theme-color;
                        }
                    }
                }
            }
        }
        .user-tabs{
            margin: 0;
            display: flex;
            margin-top: 10px;
            background: #fff;
            text-align: center;
            border-radius: 4px;
            .tab{
                padding: 14px 20px;
                text-align: center;
                a{
                    transition: all .2s ease-in;
                }
                .active{
                    color: @app-theme-color;
                }
                &:hover{
                    background-color: @app-hover-bg;
                }
                &:hover a{
                    color: @app-theme-color;
                }
            }
        }
        .user-tab-content{
            margin-top: 2px;
            background: #fff;
            border-radius: 4px;
            padding: 20px;
        }
    }
}
</style>
