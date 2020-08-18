<template>
    <div class="user-content">
        <div class="app-form app-form-pwd">
            <form @submit.prevent="submit()">
                <biu-input v-model="sendData.oldPwd" type="password" placeholder="您的旧密码" :error-msg="rule.oldPwdMsg" />
                <biu-input v-model="sendData.newPwd" type="password" placeholder="您的新密码" :error-msg="rule.newPwdMsg" />
                <biu-input v-model="sendData.checkPwd" type="password" placeholder="您的确认新密码" :error-msg="rule.checkPwdMsg" />
                <biu-button type="submit">
                    确认修改
                </biu-button>
            </form>
        </div>
    </div>
</template>
<script>
import { userUpdatePwd } from '@/http';
import util from '@/lib/util';
export default {
    name: 'UpdatePwdForm',
    data() {
        return {
            sendData: {
                oldPwd: null,
                newPwd: null,
                checkPwd: null
            },
            rule: {
                oldPwdMsg: null,
                newPwdMsg: null,
                checkPwdMsg: null
            }
        };
    },

    methods: {

        /**
         * 提交
         */
        async submit() {
            try {
                const msg = this.validate(this.type);
                if (msg !== 'success') return this.$message.error(msg || '');
                const { oldPwd, newPwd } = this.sendData;
                const { code } = await this.$axios[userUpdatePwd.method](userUpdatePwd.url, { oldPwd: util.getMD5UC(oldPwd), newPwd: util.getMD5UC(newPwd) });
                if (code == 200) {
                    this.$message.success('修改成功,请使用新密码登录');
                    for (const key in this.sendData) {
                        this.sendData[key] = null;
                    }
                    this.$router.push('/');
                }
            } catch (error) {
                console.error(`提交成功出错:`, error);
            }
        },

        /**
         * 提交验证
         */
        validate(type) {
            const success = 'success';
            const pwdTest = (v) => /^.{6,16}$/.test(v);
            if (!this.sendData.oldPwd) {
                this.rule.oldPwdMsg = `请输入您的旧密码`;
                return this.rule.oldPwdMsg;
            } else {
                this.rule.oldPwdMsg = null;
            }

            if (!this.sendData.newPwd) {
                this.rule.newPwdMsg = `请设置一个新的登录密码`;
                return this.rule.newPwdMsg;
            } else if (!pwdTest(this.sendData.newPwd)) {
                this.rule.newPwdMsg = `您可以输入一个6-16位的字符作为新的登录密码`;
                return this.rule.newPwdMsg;
            } else {
                this.rule.newPwdMsg = null;
            }

            if (!this.sendData.checkPwd) {
                this.rule.checkPwdMsg = `请再输入您刚刚输入的新密码`;
                return this.rule.checkPwdMsg;
            } else if (this.sendData.newPwd !== this.sendData.checkPwd) {
                this.rule.checkPwdMsg = `您输入的确认新密码和刚刚输入的新密码不一致`;
                return this.rule.checkPwdMsg;
            } else {
                this.rule.checkPwdMsg = null;
            }
            return success;
        }
    }
};
</script>
<style lang="less" scoped>
.user-content{
    .app-form-pwd{
        width: 360px;
    }
}
</style>
