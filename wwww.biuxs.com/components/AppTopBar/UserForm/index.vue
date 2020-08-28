<template>
    <app-dialog class="app-user-form" :show.sync="dialogConf.isShow" :width="dialogConf.width" :btns="dialogConf.btns">
        <h5 class="form-title">
            <i class="iconfont iconbiulogo" />
            <span>{{ type |formType }}</span>
        </h5>
        <div class="app-form">
            <form @submit.prevent="submit()">
                <!-- 登录 -->
                <template v-if="type == 'login'">
                    <biu-input v-model="sendData.account" placeholder="账号/已验证邮箱/用户名" :error-msg="rule.accountMsg" />
                    <biu-input v-model="sendData.pwd" type="password" placeholder="请输入密码" :error-msg="rule.pwdMsg" />
                    <biu-check-box v-model="sendData.is15NoLogin">
                        <span>15天内自动登录</span>
                        <a class="reset-pwd" href="javascript:void(0);" @click="changeForm('resetpwd')">忘记密码?</a>
                    </biu-check-box>
                </template>
                <!-- 新用户注册 -->
                <template v-else-if="type == 'register'">
                    <biu-input v-model="sendData.nickname" placeholder="用户昵称(独一无二的)" :error-msg="rule.nicknameMsg" />
                    <biu-input v-model="sendData.email" placeholder="邮箱(E-mail)" :error-msg="rule.emailMsg">
                        <template slot="append">
                            <span class="send" @click="postEmail(sendData.email)">{{ emailMsg }}</span>
                        </template>
                    </biu-input>
                    <biu-input v-model="sendData.ecode" placeholder="邮箱验证码" :error-msg="rule.ecodeMsg" />
                    <biu-input v-model="sendData.pwd" type="password" placeholder="用户密码" :error-msg="rule.pwdMsg" />
                    <biu-input v-model="sendData.checkPwd" type="password" placeholder="确认密码" :error-msg="rule.checkPwdMsg" />
                    <biu-check-box v-model="sendData.isRead" :error-msg="rule.isReadMsg">
                        <span>我已阅读</span>
                        <nuxt-link to="/member/agreement">
                            《用户协议》
                        </nuxt-link>
                    </biu-check-box>
                </template>
                <!-- 找回密码 -->
                <template v-else-if="type == 'resetpwd'">
                    <biu-input v-model="sendData.email" placeholder="邮箱(E-mail)" :error-msg="rule.emailMsg">
                        <template slot="append">
                            <span class="send" @click="postEmail(sendData.email)">{{ emailMsg }}</span>
                        </template>
                    </biu-input>
                    <biu-input v-model="sendData.ecode" placeholder="验证码" :error-msg="rule.ecodeMsg" />
                    <biu-input v-model="sendData.pwd" type="password" placeholder="新密码" :error-msg="rule.newPwdMsg" />
                    <biu-input v-model="sendData.checkPwd" type="password" placeholder="确认新密码" :error-msg="rule.checkNewPwdMsg" />
                </template>
                <!-- 提交 -->
                <div class="form-item">
                    <button class="form-item-submit" type="submit">
                        {{ type | submitType }}
                    </button>
                </div>
                <div class="form-item">
                    <span class="link-label">
                        <a href="#" @click="changeForm(type == 'login' ? 'register' : 'login')">{{ type == 'login' ? '没有账号?极速注册!':'已有账号?马上登录!' }}</a>
                    </span>
                </div>
                <!-- 第三方账号登录 -->
                <other-auth v-show="false" />
            </form>
        </div>
    </app-dialog>
</template>
<script>
import { userRegister, sendUserRegisterEmailCode, userLogin, userResetPwd, sendUserResetPwdEmailCode } from '@/http';
import OtherAuth from './OtherAuth';
import util from '@/lib/util';
import config from '@/base/config';
export default {
    name: 'UserForm',
    components: { OtherAuth },
    filters: {
        formType(v) {
            switch (v) {
            case 'login':
                return '快速登录';
            case 'register':
                return '极速注册';
            default:
                return '重置密码';
            }
        },
        submitType(v) {
            switch (v) {
            case 'login':
                return '登 录';
            case 'register':
                return '注 册';
            default:
                return '提 交';
            }
        }
    },
    data() {
        return {
            dialogConf: {
                width: '420px',
                isShow: false,
                btns: false
            },
            type: 'login',
            sendData: {
                account: null, //登录账户
                nickname: null, //昵称
                email: null, //邮箱
                ecode: null, //邮箱验证
                pwd: null, //密码
                checkPwd: null, //重复密码
                is15NoLogin: false, //15天内不用登录
                isRead: false //是否阅读协议
            },
            rule: {
                emailMsg: null, //邮箱
                accountMsg: null, //登录账户
                nicknameMsg: null, //昵称
                ecodeMsg: null, //邮箱验证
                pwdMsg: null, //密码
                checkPwdMsg: null, //重复密码
                isReadMsg: null, //是否阅读协议
                newPwdMsg: null, //新密码
                checkNewPwdMsg: null //重复新密码
            },
            emailMsg: '发送邮件'
        };
    },
    methods: {
        /**
		 * 初始化
		 */
        async init ({ type, title, data }) {
            this.dialogConf.isShow = true;
            this.type = type;
        },

        /**
         * 每次切换都清空表单
         */
        changeForm(type) {
            this.type = type;
            // for (const key in this.sendData) {
            //     if (typeof this.sendData[key] === 'boolean') {
            //         this.$set(this.sendData, key, false);
            //     } else {
            //         this.$set(this.sendData, key, null);
            //     }
            // }
            console.log(this.sendData);
        },

        /**
         * 邮件验证码
         */
        async postEmail(email) {
            try {
                if (!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(email)) {
                    this.rule.emailMsg = `请输入正确的邮箱`;
                    return this.$message.error(this.rule.emailMsg);
                }
                this.rule.emailMsg = null;
                let res = null;
                if (this.type == 'register') {
                    res = await this.$axios[sendUserRegisterEmailCode.method](sendUserRegisterEmailCode.url, { email });
                } else {
                    res = await this.$axios[sendUserResetPwdEmailCode.method](sendUserResetPwdEmailCode.url, { email });
                }
                if (res && res.code == 200) {
                    this.$message.success('发送邮件成功,请注意查收!');
                    this.emailMsg = '重新发送';
                }
            } catch (error) {
                console.error(`发送邮件出错:`, error);
            }
        },

        /**
         * 提交
         */
        async submit() {
            try {
                const msg = this.validate(this.type);
                if (msg !== 'success') {
                    return this.$message.error(msg || '');
                }
                let res = null;
                const { nickname, email, ecode, pwd, account, is15NoLogin } = this.sendData;
                if (this.type === 'register') {
                    res = await this.$axios[userRegister.method](userRegister.url, { nickname, code: ecode, email, password: util.getMD5UC(pwd) });
                } else if (this.type === 'login') {
                    let acc = account;
                    const tem = (v) => /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(v);
                    const tel = (v) => /^[1][34578]\\d{9}$/.test(v);
                    if (!(tem(account) || tel(account))) { //登录
                        acc = `biunav${account}`;
                    }
                    res = await this.$axios[userLogin.method](userLogin.url, { account: acc, password: util.getMD5UC(pwd) });
                } else {
                    res = await this.$axios[userResetPwd.method](userResetPwd.url, { email, code: ecode, type: 1, password: util.getMD5UC(pwd) });
                }
                if (res && res.code == 200) {
                    if (this.type === 'login') {
                        const { jwt, user } = res.data;
                        const is15 = is15NoLogin ? 15 : 7;
                        util.setCookie(config.COOKIE_JWT_KEY, jwt, is15);
                        window.localStorage.setItem(config.USER_INFO_KEY, JSON.stringify(user));
                        this.$message.success('登录成功');
                        this.dialogConf.isShow = false;
                        this.$emit('refresh');
                    } else if (this.type == 'register') {
                        this.$message.success('注册成功');
                        this.changeForm('login');
                    } else {
                        this.$message.success('找回密码成功');
                        this.changeForm('login');
                    }
                }
            } catch (error) {
                console.error(`提交出错：`, error);
            }
        },

        /**
         * 提交验证
         */
        validate(type) {
            const success = 'success';
            const accountTest = (v) => /^.{1,16}/.test(v);
            const pwdTest = (v) => /^.{6,16}$/.test(v);
            const emailTest = (v) => /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(v);
            if (type === 'login') {
                if (!this.sendData.account) {
                    this.rule.accountMsg = `请输入登录的账号/用户名/邮箱`;
                    return this.rule.accountMsg;
                } else if (!accountTest(this.sendData.account)) {
                    this.rule.accountMsg = `登录的账户格式不正确`;
                    return this.rule.accountMsg;
                } else {
                    this.rule.accountMsg = null;
                }

                if (!this.sendData.pwd) {
                    this.rule.pwdMsg = `请输入登录密码`;
                    return this.rule.pwdMsg;
                } else if (!pwdTest(this.sendData.pwd)) {
                    this.rule.pwdMsg = `请输入正确的登录密码`;
                    return this.rule.pwdMsg;
                } else {
                    this.rule.pwdMsg = null;
                }
            } else if (type === 'register') {
                if (!this.sendData.nickname) {
                    this.rule.nicknameMsg = `您可以给自己取一个独一无二的昵称哟`;
                    return this.rule.nicknameMsg;
                } else if (!accountTest(this.sendData.nickname)) {
                    this.rule.nicknameMsg = `您输入的昵称长度超过限制啦`;
                    return this.rule.nicknameMsg;
                } else {
                    this.rule.nicknameMsg = null;
                }

                if (!this.sendData.email) {
                    this.rule.emailMsg = `你可以输入您的邮箱做为登录账号`;
                    return this.rule.emailMsg;
                } else if (!emailTest(this.sendData.email)) {
                    this.rule.emailMsg = `您的邮箱格式不对呀`;
                    return this.rule.emailMsg;
                } else {
                    this.rule.emailMsg = null;
                }

                if (!this.sendData.pwd) {
                    this.rule.pwdMsg = `请设置一个登录密码呢`;
                    return this.rule.pwdMsg;
                } else if (!pwdTest(this.sendData.pwd)) {
                    this.rule.pwdMsg = `您可以输入一个6-16位的字符作为登录密码`;
                    return this.rule.pwdMsg;
                } else {
                    this.rule.pwdMsg = null;
                }

                if (!this.sendData.checkPwd) {
                    this.rule.checkPwdMsg = `请再输入您刚刚输入的登录密码呢`;
                    return this.rule.checkPwdMsg;
                } else if (this.sendData.pwd !== this.sendData.checkPwd) {
                    this.rule.checkPwdMsg = `您输入的登录密码和刚刚输入的不一致呢`;
                    return this.rule.checkPwdMsg;
                } else {
                    this.rule.checkPwdMsg = null;
                }

                if (!this.sendData.ecode) {
                    this.rule.ecodeMsg = `请再输入您收到的验证码呢`;
                    return this.rule.ecodeMsg;
                } else if (!/^[\d]{6}$/.test(this.sendData.ecode)) {
                    this.rule.ecodeMsg = `您输入的验证码格式不对呢`;
                    return this.rule.ecodeMsg;
                } else {
                    this.rule.ecodeMsg = null;
                }

                if (!this.sendData.isRead) {
                    this.rule.isReadMsg = `请勾选我已阅读《用户协议》`;
                    return this.rule.isReadMsg;
                } else {
                    this.rule.isReadMsg = null;
                }
            } else if (type === 'resetpwd') {
                if (!this.sendData.email) {
                    this.rule.emailMsg = `请输入您注册时用的邮箱账号`;
                    return this.rule.emailMsg;
                } else if (!emailTest(this.sendData.email)) {
                    this.rule.emailMsg = `您的邮箱格式不对呀`;
                    return this.rule.emailMsg;
                } else {
                    this.rule.emailMsg = null;
                }

                if (!this.sendData.pwd) {
                    this.rule.pwdMsg = `请设置一个新的登录密码呢`;
                    return this.rule.pwdMsg;
                } else if (!pwdTest(this.sendData.pwd)) {
                    this.rule.pwdMsg = `您可以输入一个6-16位的字符作为登录密码`;
                    return this.rule.pwdMsg;
                } else {
                    this.rule.pwdMsg = null;
                }

                if (!this.sendData.checkPwd) {
                    this.rule.checkPwdMsg = `请再输入您刚才设置的新密码呢`;
                    return this.rule.checkPwdMsg;
                } else if (this.sendData.pwd !== this.sendData.checkPwd) {
                    this.rule.checkPwdMsg = `您输入的密码和刚才输入的不一致`;
                    return this.rule.checkPwdMsg;
                } else {
                    this.rule.checkPwdMsg = null;
                }

                if (!this.sendData.ecode) {
                    this.rule.ecodeMsg = `请再输入您收到的验证码呢`;
                    return this.rule.ecodeMsg;
                } else if (!/^[\d]{6}$/.test(this.sendData.ecode)) {
                    this.rule.ecodeMsg = `您输入的验证码格式不对呢`;
                    return this.rule.ecodeMsg;
                } else {
                    this.rule.ecodeMsg = null;
                }
            }
            return success;
        }
    }
};
</script>
<style lang="less" scoped>
@import url('~@/assets/styles/common/constant');
.app-user-form{
    color: @app-theme-color;
    .form-title{
        margin-bottom: 40px;
        text-align: center;
        font-size: 24px;
        .iconfont{
            font-size: 24px;
        }
    }
    .app-form{
        .form-item{
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            .send{
                width: 80px;
                position: absolute;
                right: 1px;
                bottom: 1px;
                display: inline-block;
                background: #3acbff;
                color: #fff;
                height: 38px;
                line-height: 38px;
                text-align: center;
                cursor: pointer;
                opacity: .8;
                font-size: 14px;
                &:hover{
                    opacity: 1;
                }
            }
            .form-item-submit{
                display: block;
                width: 100%;
                height: 40px;
                line-height: 40px;
                border: 1px solid @app-theme-color;
                color: #fff;
                background: @app-theme-color;
                border-radius: 3px;
                cursor: pointer;
                opacity: .8;
                font-size: 18px;
                outline: none;
                &:hover{
                    opacity: 1;
                }
            }
            .link-label{
                font-size: .875rem;
                color: #828282;
                a{
                    color: @app-theme-color;
                    &:hover{
                        color: #f00;
                    }
                }
            }
        }
    }
}
</style>
