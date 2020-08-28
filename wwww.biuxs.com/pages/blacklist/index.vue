<template>
    <div class="app-container app-child-page">
        <div class="app-content">
            <AppBreadcrumb :navs="navs" />
            <div class="app-blacklist-content">
                <div class="app-form">
                    <div class="blacklist-title">
                        {{ type ? '公司曝光' : '公司查询' }}
                    </div>
                    <form @submit.prevent="submit()">
                        <biu-input v-model="sendData.name" placeholder="请输入被曝光公司的名称(请您输入公司的全称)" :error-msg="rule.nameMsg" />
                        <template v-if="type">
                            <biu-input v-model="sendData.reason" placeholder="请输入因为何事要曝光此公司" :error-msg="rule.reasonMsg" />
                            <biu-input v-model="sendData.address" placeholder="请输入曝光公司的所在地址" :error-msg="rule.addressMsg" />
                            <biu-input v-model="sendData.content" type="textarea" placeholder="请输入曝光的详情内容" />
                            <biu-input v-model="sendData.from" placeholder="请输入您的邮箱E-mail(此项不对外展示)" :error-msg="rule.fromMsg">
                                <template slot="append">
                                    <span class="send" @click="postEmail(sendData.from)">{{ emailMsg }}</span>
                                </template>
                            </biu-input>
                            <biu-input v-model="sendData.ecode" placeholder="请输入邮件验证码" :error-msg="rule.ecodeMsg" />
                        </template>
                        <template v-else>
                            <biu-input v-model="sendData.code" placeholder="请输入图片验证码(不区分大小写)" :error-msg="rule.codeMsg">
                                <template slot="append">
                                    <span title="看不清?换一张" class="img-code" @click="getImgCode()" v-html="validataImg" />
                                </template>
                            </biu-input>
                        </template>
                        <!-- 提交 -->
                        <div class="form-item">
                            <button class="form-item-submit" type="submit">
                                {{ type ? '提交' : '查询' }}
                            </button>
                        </div>
                        <div class="form-item">
                            <span class="link-label">
                                <a href="#" @click="changeForm(type ? 0 : 1)">{{ type ? '我要查询' : '我要曝光' }}</a>
                            </span>
                        </div>
                    </form>
                </div>
                <div class="app-blacklist-tips">
                    <template v-if="isQuery">
                        <h5 class="tips-title">
                            查询结果:
                        </h5>
                        <ul v-if="blist && blist.length" class="blist-list">
                            <template v-for="item in blist">
                                <li :key="item.id" class="item">
                                    <div class="item-info">
                                        <span class="info-label">公司名:</span>
                                        <p class="info-value">
                                            {{ item.company }}
                                        </p>
                                    </div>
                                    <div class="item-info">
                                        <span class="info-label">公司地址:</span>
                                        <p class="info-value">
                                            {{ item.address }}
                                        </p>
                                    </div>
                                    <div class="item-info">
                                        <span class="info-label">起因:</span>
                                        <p class="info-value">
                                            {{ item.reason }}
                                        </p>
                                    </div>
                                    <div class="item-info">
                                        <span class="info-label">详情:</span>
                                        <p class="info-value">
                                            {{ item.content }}
                                        </p>
                                    </div>
                                </li>
                            </template>
                        </ul>
                        <div v-else class="no-search">
                            暂无数据
                        </div>
                    </template>
                    <template v-else>
                        <h5 class="tips-title">
                            站长留言:
                        </h5>
                        <p>1、为了避免恶意搜索,需要您输入公司的全称。</p>
                        <p>2、为了避免恶意调用API,需要再麻烦您输入验证码。</p>
                        <p>3、为了避免恶意提交给他人带来不必要的麻烦,需要验证您的邮箱。</p>
                        <p>4、为了互联网的文明,法治社会,请文明用语。</p>
                        <p class="blacklist-ps">
                            系统记录的数据均源于网友上报,数据内容仅仅作为参考,不作为任何依据。
                        </p>
                        <p class="blacklist-ps">
                            如果您需要消除已记录的公司,请直接发送邮件到
                            <font color="#f00">
                                admin@biunav.com
                            </font>。
                        </p>
                        <p class="blacklist-ps">
                            格式: 公司名称 + 主题 + 消除原因。
                        </p>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import util from '@/lib/util';
import { sendEmailValidateCode, addBlacklistCompanyByWeb, getImgValidate, getCompanyBlacklist } from '@/http';
export default {
    name: 'Blacklist',
    layout: 'child',
    data() {
        return {
            navs: [{
                label: '主页',
                link: '/'
            },
            {
                label: '公司查询'
            }],
            imgView: null,
            types: [],
            sendData: {},
            initData: {
                name: null,
                address: null,
                reason: null,
                content: null,
                from: null,
                ecode: null,
                code: null
            },
            validataImg: null,
            rule: {
                nameMsg: null,
                addressMsg: null,
                reasonMsg: null,
                contentMsg: null,
                fromMsg: null,
                ecodeMsg: null,
                codeMsg: null
            },
            type: 0, // 0查询 1举报
            emailMsg: '发送邮件',
            blist: [], //黑名单公司
            isQuery: false
        };
    },
    created() {
        this.init();
        this.getImgCode();
    },
    methods: {
        async init() {
            try {
                this.sendData = util.deepCloneObject(this.initData);
            } catch (error) {
                console.error(`init出错:`, error);
            }
        },

        /**
         * 表单切换
         */
        changeForm(type) {
            this.type = type;
            this.isQuery = false;
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
         * 邮件验证码
         */
        async postEmail(email) {
            try {
                if (!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(email)) {
                    this.rule.emailMsg = `请输入正确的邮箱`;
                    return this.$message.error(this.rule.emailMsg);
                }
                this.rule.emailMsg = null;
                let res = await this.$axios[sendEmailValidateCode.method](sendEmailValidateCode.url, { email, type: 'blacklist' });
                if (res && res.code == 200) {
                    this.$message.success('发送邮件成功,请注意查收!');
                    this.emailMsg = '重新发送';
                }
            } catch (error) {
                this.emailMsg = '重新发送';
                console.error(`发送邮件出错:`, error);
            }
        },

        /**
         * 提交
         */
        async submit() {
            try {
                const msg = this.validate(this.type);
                console.log(msg);
                if (msg !== 'success') return this.$message.error(msg || '');
                if (this.type) {
                    const { code } = await this.$axios[addBlacklistCompanyByWeb.method](addBlacklistCompanyByWeb.url, this.sendData);
                    if (code == 200) {
                        this.$message.success('提交成功');
                        this.sendData = util.deepCloneObject(this.initData);
                    } else {
                        this.getImgCode();
                    }
                } else {
                    const { name, code } = this.sendData;
                    const res = await this.$axios[getCompanyBlacklist.method](getCompanyBlacklist.url, {
                        params: { company: name, code }
                    });
                    if (res && res.code == 200) {
                        this.blist = res.data.list || [];
                        if (!this.blist.length) {
                            this.$message.info(`未查询到此公司`);
                        }
                    } else {
                        this.getImgCode();
                    }
                    this.isQuery = true;
                }
            } catch (error) {
                if (this.type) {
                    console.error(`提交出错:`, error);
                } else {
                    console.error(`查询出错:`, error);
                }
            }
        },

        /**
         * 提交验证
         */
        validate(type) {
            const success = 'success';
            const accountTest = (v) => /^.{1,50}/.test(v);
            const emailTest = (v) => /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(v);
            if (!this.sendData.name) {
                this.rule.nameMsg = `请输入公司名称`;
                return this.rule.nameMsg;
            } else if (!accountTest(this.sendData.name)) {
                this.rule.nameMsg = `公司名称不正确`;
                return this.rule.nameMsg;
            } else {
                this.rule.nameMsg = null;
            }

            if (type) {
                if (!this.sendData.address) {
                    this.rule.addressMsg = `请输入公司地址`;
                    return this.rule.addressMsg;
                } else {
                    this.rule.addressMsg = null;
                }
                if (!this.sendData.reason) {
                    this.rule.reasonMsg = `请输入曝光此公司的起因`;
                    return this.rule.reasonMsg;
                } else {
                    this.rule.reasonMsg = null;
                }

                if (!this.sendData.contentMsg) {
                    this.rule.contactMsg = `请输入曝光的详情内容`;
                    return this.rule.contentMsg;
                } else {
                    this.rule.contentMsg = null;
                }

                if (!this.sendData.from) {
                    this.rule.fromMsg = `你可以放心的输入您的邮箱此项不会对外公开`;
                    return this.rule.fromMsg;
                } else if (!emailTest(this.sendData.from)) {
                    this.rule.fromMsg = `您的邮箱格式不对呀`;
                    return this.rule.fromMsg;
                } else {
                    this.rule.fromMsg = null;
                }
            } else {
                if (!this.sendData.code) {
                    this.rule.codeMsg = `请输入验证码`;
                    return this.rule.codeMsg;
                } else {
                    this.rule.codeMsg = null;
                }
            }
            return success;
        }
    }
};
</script>
<style lang="less" scoped>
@import url('~@/assets/styles/common/constant');
html{
    height: 100%;
}
.app-content{
    min-height: 800px;
    .blacklist-title{
        text-align: center;
        padding: 20px;
        font-size: 18px;
        color: #61d5ff;
    }
    .app-blacklist-content{
        padding: 20px;
        display: flex;
        background: #fff;
        border-radius: 4px;
        min-height: 500px;
        margin-bottom: 20px;
        .app-form{
            width: 400px;
            .form-item{
                display: flex;
                align-items: center;
                position: relative;
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
                    transition: all .2s ease-in;
                    &:hover{
                        opacity: 1;
                    }
                }
                .submit-plan{
                    background: none;
                    color: @app-theme-color;
                    &:hover{
                        background: @app-theme-color;
                        color: #fff;
                    }
                }
                .link-label{
                    font-size: .875rem;
                    color: #828282;
                    margin: 0 auto;
                    a{
                        color: @app-theme-color;
                        &:hover{
                            color: #f00;
                        }
                    }
                }
            }
        }
        .app-blacklist-tips{
            flex: 1;
            margin-left: 40px;
            background-color: #f8feff;
            padding: 20px;
            color: @app-theme-color;
            .no-search{
                font-size: 16px;
                padding: 20px 0;
            }
            .blist-list{
                margin: 0;
                margin-top: 20px;
                max-height: 500px;
                overflow: auto;
                .item{
                    padding: 20px 20px 0 0;
                    border-top: 1px dashed  @app-theme-color;
                    border-bottom: 1px dashed  @app-theme-color;
                    margin-bottom: 20px;
                    .item-info{
                        font-size: 16px;
                        .info-label{
                            font-weight: bold;
                        }
                        .info-value{
                            margin-top: 4px;
                            margin-bottom: 20px;
                            line-height: 1.6;
                        }
                    }
                }
            }
            .tips-title{
                font-weight: bold;
                font-size: 18px;
            }
            p{
                margin-top: 20px;
            }
            .blacklist-ps{
                font-weight: bold;
            }
        }
    }
}
</style>
