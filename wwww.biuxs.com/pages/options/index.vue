<template>
    <div class="app-nav-types app-content">
        <app-card-container title="意见反馈" icon="iconliuyan" size="18px">
            <div class="app-message-content">
                <div class="app-form">
                    <form @submit.prevent="submit()">
                        <biu-input v-model="sendData.title" placeholder="请写个标题吧" :error-msg="rule.titlelMsg" />
                        <biu-input v-model="sendData.content" type="textarea" placeholder="请在这里留下您的宝贵内容" :error-msg="rule.contentMsg" />
                        <biu-input v-model="sendData.contact" placeholder="请留个联系方式吧 如 QQ、E-mail等" :error-msg="rule.contactMsg" />
                        <biu-select v-model="sendData.type" :list="types" placeholder="请选一个分类吧" :error-msg="rule.typeMsg" />
                        <biu-input v-model="sendData.code" placeholder="图片验证码(不区分大小写)" :error-msg="rule.codetMsg">
                            <template slot="append">
                                <span title="看不清?换一张" class="img-code" @click="getImgCode()" v-html="validataImg" />
                            </template>
                        </biu-input>
                        <!-- 提交 -->
                        <div class="form-item">
                            <button class="form-item-submit" type="submit">
                                提交信息
                            </button>
                        </div>
                    </form>
                </div>
                <div class="app-message-tips">
                    <h5 class="tips-title">
                        留言规范:
                    </h5>
                    <p>1、请不要提交非法的信息，网络上也要做一个文明的人。</p>
                    <p>2、内容清晰明了，不要水文。</p>
                    <p class="included-ps">
                        站长留言：相逢即是缘、祝您生活愉快！
                    </p>
                </div>
            </div>
        </app-card-container>
    </div>
</template>
<script>
import { getImgValidate, addOptionMsg } from '@/http';
export default {
    name: 'Options',
    layout: 'child',
    data() {
        return {
            sendData: {
                title: null,
                contact: null,
                content: null,
                code: null,
                type: null
            },
            validataImg: null,
            rule: {
                titlelMsg: null,
                contactMsg: null,
                contentMsg: null,
                typeMsg: null,
                codetMsg: null
            },
            types: [
                {
                    label: 'Bug提交',
                    value: '1'
                },
                {
                    label: '留言信息',
                    value: '2'
                },
                {
                    label: '意见反馈',
                    value: '3'
                },
                {
                    label: '产品建议',
                    value: '4'
                },
                {
                    label: '其它信息',
                    value: '5'
                }
            ]
        };
    },
    created() {
        this.getImgCode();
    },
    methods: {
        /**
         * 获取图片验证码
         */
        async getImgCode() {
            try {
                const { data: { img } } = await this.$axios[getImgValidate.method](getImgValidate.url, { params: { h: 40 } });
                this.validataImg = img;
                this.sendData.code = null;
            } catch (error) {
                console.error(`获取网站分类出错:`, error);
            }
        },

        /**
         * 提交
         */
        async submit() {
            try {
                const msg = this.validate(this.type);
                if (msg !== 'success') return this.$message.error(msg || '');
                const { code } = await this.$axios[addOptionMsg.method](addOptionMsg.url, this.sendData);
                if (code == 200) {
                    this.$message.success('提交成功');
                    for (const key in this.sendData) {
                        this.sendData[key] = null;
                    }
                } else {
                    this.getImgCode();
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
            if (!this.sendData.title) {
                this.rule.titlelMsg = `请写一个标题吧`;
                return this.rule.titlelMsg;
            } else {
                this.rule.titlelMsg = null;
            }

            if (!this.sendData.content) {
                this.rule.contentMsg = `请写一点内容吧`;
                return this.rule.contentMsg;
            } else {
                this.rule.contentMsg = null;
            }

            if (!this.sendData.contact) {
                this.rule.contactMsg = `请留下一个联系方式吧`;
                return this.rule.contactMsg;
            } else {
                this.rule.contactMsg = null;
            }

            if (!this.sendData.type) {
                this.rule.typeMsg = `请选择一个分类吧`;
                return this.rule.typeMsg;
            } else {
                this.rule.typeMsg = null;
            }

            if (!this.sendData.code) {
                this.rule.codetMsg = `请输入验证码`;
                return this.rule.codetMsg;
            } else {
                this.rule.codetMsg = null;
            }
            return success;
        }
    }
};
</script>
<style lang="less" scoped>
@import url('~@/assets/styles/common/constant');
.app-message-content{
    padding: 20px;
    display: flex;
    .app-form{
        width: 400px;
        .form-item{
            .img-code{
                position: absolute;
                right: 0;
                top: 0;
                height: 100%;
                cursor: pointer;
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
        }
    }
    .app-message-tips{
        flex: 1;
        margin-left: 40px;
        background-color: #f8feff;
        padding: 20px;
        color: @app-theme-color;
        .tips-title{
            font-weight: bold;
            font-size: 18px;
        }
        p{
            margin-top: 20px;
        }
        .included-ps{
            font-weight: bold;
        }
    }
}

</style>
