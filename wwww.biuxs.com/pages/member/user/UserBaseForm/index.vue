<template>
    <div class="user-content">
        <ul class="user-items">
            <li>
                <span class="item-label">账号:</span>
                <input v-if="isEdit" v-model="user.copyacc" maxlength="30" placeholder="您可以输入一个您喜欢的号码作为登录账户(仅可设置一次)" :disabled="!!user.copyacc" class="item-input" type="text">
                <span v-else class="item-value">{{ user.copyacc || `暂未设置账户` }}</span>
            </li>
            <li>
                <span class="item-label">邮箱:</span>
                <input v-if="isEdit" v-model="user.email" disabled maxlength="50" class="item-input" type="text">
                <template v-else>
                    <span class="item-value">{{ user.email }}</span>
                    <i v-if="formatAuthType(user.authType, 1)" class="iconfont iconrenzheng" title="已验证" />
                </template>
            </li>
            <li v-if="isEdit">
                <span class="item-label">昵称:</span>
                <input v-model="user.nickname" maxlength="20" class="item-input" type="text">
            </li>
            <li>
                <span class="item-label">手机号:</span>
                <input v-if="isEdit" v-model="user.phone" maxlength="20" class="item-input" type="text">
                <template v-else>
                    <span class="item-value">{{ user.phone || '暂未设置' }}</span>
                    <!-- <i v-if="formatAuthType(user.authType, 0)" class="iconfont iconrenzheng" /> -->
                </template>
            </li>
            <li>
                <span class="item-label">QQ:</span>
                <input v-if="isEdit" v-model="user.qq" maxlength="20" class="item-input" type="text">
                <template v-else>
                    <span class="item-value">{{ user.qq || '暂未设置' }}</span>
                    <i v-if="user.qqOpendId" class="iconfont iconyiyanzheng" />
                </template>
            </li>
            <li>
                <span class="item-label">微信:</span>
                <input v-if="isEdit" v-model="user.wechat" maxlength="20" class="item-input" type="text">
                <template v-else>
                    <span class="item-value">{{ user.wechat || '暂未设置' }}</span>
                    <i v-if="user.opendId" class="iconfont iconrenzheng" title="已验证" />
                </template>
            </li>
            <!-- 以上资料修改时需要认证 -->
            <li>
                <span class="item-label">公司:</span>
                <input v-if="isEdit" v-model="user.company" class="item-input" type="text">
                <span v-else class="item-value">{{ user.company || '暂未设置' }}</span>
            </li>
            <li>
                <span class="item-label">职业:</span>
                <input v-if="isEdit" v-model="user.profession" class="item-input" type="text">
                <span v-else class="item-value">{{ user.profession || '暂未设置' }}</span>
            </li>
            <li>
                <span class="item-label">个性签名:</span>
                <input v-if="isEdit" v-model="user.sign" class="item-input" type="text">
                <span v-else class="item-value">{{ user.sign || '暂未设置' }}</span>
            </li>
            <li>
                <span class="item-label">个人简介:</span>
                <input v-if="isEdit" v-model="user.brief" class="item-input" type="text">
                <span v-else class="item-value">{{ user.brief || '暂未设置' }}</span>
            </li>
            <li>
                <span class="item-label">个人主页:</span>
                <input v-if="isEdit" v-model="user.homePage" class="item-input" type="text">
                <span v-else class="item-value">{{ user.homePage || '暂未设置' }}</span>
            </li>
            <li>
                <div class="user-btns">
                    <template v-if="isEdit">
                        <button class="save-user" @click="submitUserInfo">
                            保存
                        </button>
                        <button class="cancel-user" @click="handleIsEdit(false)">
                            取消
                        </button>
                    </template>
                    <button v-else class="update-user" @click="handleIsEdit(true)">
                        编辑资料
                    </button>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import { userUpdateBaseInfo } from '@/http';
import util from '@/lib/util';
export default {
    name: 'UserBaseForm',
    props: {
        userInfo: {
            requered: true,
            type: [Object],
            default: () => {}
        }
    },
    data() {
        return {
            navs: [{
                label: '用户中心',
                link: '/member/user'
            },
            {
                label: '个人资料'
            }],
            isEdit: false,
            user: {}
        };
    },
    watch: {
        userInfo(v) {
            this.user = util.deepCloneObject(v) || {};
        }
    },
    created() {
        this.user = util.deepCloneObject(this.userInfo) || {};
    },

    methods: {

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
                    this.$emit('refresh');
                }
            } catch (error) {
                console.error(`修改资料出错:`, error);
            }
        }
    }
};
</script>
<style lang="less" scoped>
@import url('~@/assets/styles/common/constant');
.user-content{
    .user-items{
        margin: 0;
        li{
            display: flex;
            align-items: center;
            font-size: 16px;
            height: 40px;
            .iconfont{
                margin-left: 4px;
                font-size: 24px;
                color: @app-theme-color;
            }
            .item-label{
                display: inline-block;
                margin-right: 10px;
                text-align: right;
                min-width: 68px;
            }
            .item-value{
                display: inline-block;
                height: 36px;
                line-height: 36px;
            }
            .item-input{
                // display: none;
                min-width: 620px;
                padding: 4px 16px;
                outline: none;
                border: 1px solid #eee;
                height: 36px;
                font-size: 16px;
                color: #2f2f2f;
                font-weight: 300;
                &:focus{
                    border-color: @app-theme-boder;
                }
            }
            .user-btns{
                padding: 0 14px;
                button{
                    cursor: pointer;
                    outline: none;
                    background: @app-theme-color;
                    color: #fff;
                    border: 1px solid @app-theme-color;
                    padding: 6px 14px;
                    min-width: 80px;
                    border-radius: 2px;
                    opacity: 0.8;
                    transition: all .2s ease-in;
                    &:hover{
                        opacity: 1;
                    }
                }
                .cancel-user{
                    margin-left: 20px;
                    color: #2f2f2f;
                    background: #dcdcdc;
                    border: 1px solid #dcdcdc;
                }
                .update-user{
                    background-color: #fff;
                    color: @app-theme-color;
                    border: 1px solid @app-theme-color;
                    &:hover{
                        color: #fff;
                        background: @app-theme-color;
                    }
                }
            }
        }
    }
}
</style>
