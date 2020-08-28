<template>
    <div class="app-top-bar">
        <!-- :class="{'is-fixe-top':isFixedTop}" -->
        <div class="app-content app-flex app-flex-between user-info">
            <div class="top-l">
                <span>
                    <nuxt-link title="设为主页" to="/setHome">
                        设为主页
                    </nuxt-link>
                </span>
                <i>|</i>
                <span @click="addStar()">加入收藏</span>
                <i>|</i>
                <span @click="showDialog({type:'custom'})">个性化</span>
                <custom-form ref="CustomForm" />
                <!-- <i>|</i>
                    <span>宽屏版</span> -->
            </div>
            <!-- <div class="top-c">
                这里是中间的通知
            </div> -->
            <div class="top-r">
                <template v-if="userInfo">
                    <img v-if="userInfo.avatar" class="avatar-img" :src="`${$IMAGE_PATH}${userInfo.avatar}`" alt="avatar">
                    <label v-else class="avatar">
                        {{ userInfo.nickname && userInfo.nickname.substr(0,1) }}
                    </label>
                    <nuxt-link title="进入个人中心" to="/member/user">
                        {{ userInfo.nickname }}
                    </nuxt-link>
                    <i>|</i>
                    <span @click="logout()">退出</span>
                </template>
                <template v-else>
                    <span @click="showDialog({type:'login'})">登录</span>
                    <i>|</i>
                    <span @click="showDialog({type:'register'})">注册</span>
                    <!-- <i>|</i>
                    <span>个性设置</span>
                    <i>|</i>
                    <span>意见反馈</span>-->
                    <user-form ref="UserForm" @refresh="refresh" />
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import util from '@/lib/util';
import conf from '@/base/config';
// import isFixedTop from '@/mixins/isFixedTop';
import UserForm from './UserForm';
import CustomForm from './CustomForm';
import { getUserInfoBySelf, userLogout } from '@/http';
export default {
    name: 'AppTopBar',
    components: { UserForm, CustomForm },
    // mixins: [isFixedTop(50)],
    computed: {
        userInfo() {
            return this.$store.state.user.userInfo;
        }
    },
    created() {
        this.init();
    },
    methods: {
        async init() {
            try {
                if (util.getCookie(conf.COOKIE_JWT_KEY)) {
                    const { data } = await this.$axios[getUserInfoBySelf.method](getUserInfoBySelf.url);
                    this.$store.dispatch('user/setUserInfo', data);
                }
            } catch (error) {
                console.error(`获取用户信息出错:`, error);
            }
        },

        /**
	     * 弹出层控制
	     */
        showDialog ({ type, data }) {
            if (type === 'login') {
                this.$refs.UserForm.init({ type });
            } else if (type === 'register') {
                this.$refs.UserForm.init({ type });
            } else if (type === 'custom') {
                this.$refs.CustomForm.init();
            }
        },

        /**
         * 退出登录
         */
        logout() {
            this.$dialog.confirm({
                title: this.$biuxs.DIALOG_CONFIRM_TITLE,
                body: '您确定要退出登录吗?'
            }).then(async(dialog) => {
                const { code } = await this.$axios[userLogout.method](userLogout.url);
                if (code == 200) {
                    this.$store.dispatch('user/setUserInfo', null);
                    localStorage.removeItem(conf.USER_INFO_KEY);
                    util.clearCookie(conf.COOKIE_JWT_KEY);
                    this.$message.success('注销成功');
                    this.$router.replace('/');
                    dialog.close();
                }
            }).catch(() => { });
        },

        /**
         * 刷新
         */
        refresh() {
            this.init();
        },

        /**
         * 加入收藏
         */
        addStar(sTitle = document.title, sURL = window.location) {
            try {
                window.sidebar.addPanel(sTitle, sURL, '');
            } catch (e) {
                let msg = ` <h4 style="margin-bottom:20px;">如何加入收藏?</h4>
                        <div>Windows 系统 [Ctrl + D]</div><br />
                        <div>Mac 系统 [Command + D]</div>`;
                this.$dialog.alert(msg).then((dialog) => {
                    dialog.close();
                });
            }
        },

        /**
         * 手机版
         */
        goH5() {
            this.$dialog.alert(`即将上线,敬请期待!`).then((dialog) => {
                dialog.close();
            });
        }
    }
};
</script>
<style lang="less" scoped>
@import url('~@/assets/styles/common/constant');
@avatar-size: 30px;
.app-top-bar{
    // border-bottom: 1px solid @app-theme-boder;
    font-size: 12px;
    background: rgba(255, 255, 255, 0.25);
    color: #fff;
    .app-content{
        .app-content();
    }
    .user-info{
        .top-r{
            display: flex;
            align-items: center;
            .avatar-img{
                display: inline-block;
                width: @avatar-size - 6;
                height: @avatar-size - 6;
                border-radius: @avatar-size * 2;
                margin-right: 10px;
            }
            .avatar{
                display: inline-block;
                width: @avatar-size - 6;
                height: @avatar-size - 6;
                line-height: @avatar-size - 6;
                text-align: center;
                background-color: @app-theme-boder;
                color: #fff;
                border-radius: @avatar-size * 2;
                margin-right: 10px;
                font-size: 12px;
                font-weight: bold;
            }
        }
    }
    .top-l,
    .top-r{
        span,
        a{
            display: inline-block;
            cursor: pointer;
            transition: color .2s ease-in;
            height: @avatar-size;
            line-height: @avatar-size;
            color: #fff;
            &:hover{
                color: #14d1ff;
            }
        }
        i{
            margin: 0 5px;
            font: inherit;
        }
    }
}
.is-fixe-top{
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 99;
}
</style>
