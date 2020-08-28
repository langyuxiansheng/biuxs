<template>
    <div class="app-content">
        <app-card-container title="链接提交" icon="iconshoulu" size="18px">
            <div class="app-included-content">
                <div class="app-form">
                    <form @submit.prevent="submit()">
                        <biu-input v-model="sendData.title" placeholder="网站标题名称: 如 笔优网址导航" :error-msg="rule.titlelMsg" />
                        <biu-input v-model="sendData.url" placeholder="网站链接: 如 https://www.biunav.com" :error-msg="rule.urllMsg" />
                        <biu-input v-model="sendData.admin" placeholder="网站站长: 如 小浪先森" :error-msg="rule.adminlMsg" />
                        <biu-input v-model="sendData.contact" placeholder="站长联系方式: 如 QQ、E-mail、微信等" :error-msg="rule.contactMsg" />
                        <biu-select v-model="sendData.typeId" :list="types" placeholder="选择网站的分类" />
                        <biu-input v-model="sendData.brief" placeholder="网站简介: 如 你的网站是做什么的、特色等" :error-msg="rule.contactMsg" />
                        <biu-input v-model="sendData.code" placeholder="图片验证码(不区分大小写)" :error-msg="rule.contactMsg">
                            <template slot="append">
                                <span title="看不清?换一张" class="img-code" @click="getImgCode()" v-html="validataImg" />
                            </template>
                        </biu-input>
                        <!-- 提交 -->
                        <div class="form-item">
                            <button class="form-item-submit" type="submit">
                                申请收录
                            </button>
                        </div>
                    </form>
                </div>
                <div class="app-included-tips">
                    <h5 class="tips-title">
                        收录条件:
                    </h5>
                    <p>1、网站内容完整，稳定运行1年及以上的正规网站。</p>
                    <p>2、有域名、https协议、绝对正规不违反法律的网站。</p>
                    <p>3、百度权重3以上，日流量3000IP以上。</p>
                    <p>4、有营养内容、技术分享、内容主题鲜明、技术教程、资源和素材类网站优先。</p>
                    <p>5、添加本站（https://www.biunav.com）为友情链接优先。</p>
                    <p class="included-ps">
                        注意：如果发现您的网站存在非发的内容，我们有权直接下架您的链接，并加入非法网站黑名单。
                    </p>
                </div>
            </div>
        </app-card-container>
    </div>
</template>
<script>
import { getWebsiteTypes, addIncludeLink, getImgValidate } from '@/http';
export default {
    name: 'Included',
    layout: 'child',
    data() {
        return {
            imgView: null,
            types: [],
            sendData: {
                title: null,
                url: null,
                contact: null,
                admin: null,
                brief: null,
                code: null,
                typeId: null
            },
            validataImg: null,
            rule: {
                titlelMsg: null,
                urllMsg: null,
                adminMsg: null,
                contactMsg: null,
                typeMsg: null,
                briefMsg: null,
                codetMsg: null
            }
        };
    },
    created() {
        this.init();
        this.getImgCode();
    },
    methods: {
        async init() {
            try {
                const { data } = await this.$axios[getWebsiteTypes.method](getWebsiteTypes.url);
                this.types = data && data.map((item) => {
                    return {
                        label: item.name,
                        value: item.id
                    };
                }) || [];
            } catch (error) {
                console.error(`获取网站分类出错:`, error);
            }
        },

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
                const { code } = await this.$axios[addIncludeLink.method](addIncludeLink.url, this.sendData);
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
            const accountTest = (v) => /^.{1,50}/.test(v);
            if (!this.sendData.title) {
                this.rule.titlelMsg = `请输入标题名称`;
                return this.rule.titlelMsg;
            } else if (!accountTest(this.sendData.title)) {
                this.rule.titlelMsg = `分类名称不正确`;
                return this.rule.titlelMsg;
            } else {
                this.rule.titlelMsg = null;
            }

            if (!this.sendData.url) {
                this.rule.urllMsg = `请输入网站域名`;
                return this.rule.urllMsg;
            } else {
                this.rule.urllMsg = null;
            }

            if (!this.sendData.admin) {
                this.rule.adminMsg = `请输入网站站长`;
                return this.rule.adminMsg;
            } else {
                this.rule.adminMsg = null;
            }

            if (!this.sendData.contact) {
                this.rule.contactMsg = `请输入站长联系方式`;
                return this.rule.contactMsg;
            } else {
                this.rule.contactMsg = null;
            }

            if (!this.sendData.typeId) {
                this.rule.typeMsg = `请选择网站分类`;
                return this.rule.typeMsg;
            } else {
                this.rule.typeMsg = null;
            }

            if (!this.sendData.brief) {
                this.rule.briefMsg = `请输入网站简介`;
                return this.rule.briefMsg;
            } else {
                this.rule.briefMsg = null;
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
.app-included-content{
    padding: 20px;
    display: flex;
    .app-form{
        width: 400px;
        .form-item{
            display: flex;
            align-items: center;
            position: relative;
            .img-code{
                position: absolute;
                right: 0;
                top: 0;
                height: 100%;
                cursor: pointer;
            }
            & + .form-item{
                margin-top: 20px;
            }
            .img-view{
                position: absolute;
                right: 10px;
                top: 4px;
            }
            .upload-text{
                position: absolute;
                right: 50px;
                top: 14px;
                color: @app-theme-color;
                font-size: 12px;
            }
            .form-upload-label{
                position: absolute;
                left: 15px;
                top: 13px;
                color: #7a7a7a;
            }

            .form-item-input[type="textarea"]{
                border: 1px solid @app-theme-color;
                padding: 10px 15px;
                flex: 1;
                border-radius: 3px;
                height: 80px;
                line-height: 1;
                outline: none;
                color: @app-theme-color;
                font-size: 14px;
            }
            .form-item-input[type="file"]{
                border: 1px solid @app-theme-color;
                padding: 10px 15px 10px 80px;
                flex: 1;
                border-radius: 3px;
                outline: none;
                color: #7a7a7a;
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
    .app-included-tips{
        flex: 1;
        margin-left: 40px;
        // background-color: #fffaf8;
        background-color: @app-bg-color;
        padding: 20px;
        // color: #0f6af4;
        // color: #fd6b27;
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
