<template>
    <app-dialog class="app-folder-dialog" :show.sync="dialogConf.isShow" :width="dialogConf.width" :btns="dialogConf.btns">
        <div class="form-title">
            {{ dialogConf.title }}
        </div>
        <div class="app-form">
            <form @submit.prevent="submit()">
                <biu-input v-model="sendData.url" placeholder="请输入链接地址" :error-msg="rule.urlMsg" @blur="getWebSiteBase(type)">
                    <template v-if="type == 'updateBookmark'" slot="append">
                        <span class="append-btn" @click="getWebSiteBase('addBookmark')">重新抓取</span>
                    </template>
                </biu-input>
                <biu-input v-model="sendData.title" placeholder="请输入链接名称" :error-msg="rule.titleMsg" />
                <biu-select v-model="sendData.folderId" :list="folders" placeholder="选择网站的分类" :error-msg="rule.folderMsg" />
                <biu-input v-model="sendData.keywords" type="textarea" placeholder="请输入关键字" />
                <biu-input v-model="sendData.brief" type="textarea" placeholder="请输入简介" />
                <!-- 提交 -->
                <div class="form-item form-item-btns">
                    <button class="form-item-submit" type="submit">
                        确认
                    </button>
                    <button class="form-item-cancel" type="button" @click="reset()">
                        取消
                    </button>
                </div>
            </form>
        </div>
    </app-dialog>
</template>
<script>
import util from '@/lib/util';
import { userAddBookmarkLink, userUpdateBookmarkLink, getCraWebSiteBase } from '@/http';
export default {
    name: 'BookmarkForm',
    data() {
        return {
            dialogConf: {
                title: '添加分类',
                width: '420px',
                isShow: false,
                btns: false
            },
            type: 'addBookmark',
            sendData: {},
            initData: {
                userId: null,
                folderId: null,
                bookmarkId: null,
                keywords: null,
                title: null,
                url: null,
                brief: null
            },
            rule: {
                titleMsg: null,
                urlMsg: null,
                folderMsg: null
            },
            folders: []
        };
    },
    methods: {
        /**
		 * 初始化
		 */
        async init ({ type, title, data, folders, tab }) {
            this.dialogConf.isShow = true;
            this.dialogConf.title = title;
            this.type = type;
            this.folders = folders && folders.map(item => ({ label: item.name, value: item.folderId })) || [];
            this.sendData = util.deepCloneObject(this.initData);
            for (const key in this.sendData) {
                this.sendData[key] = null;
                if (type == 'updateBookmark' && data) {
                    this.sendData[key] = data[key];
                }
            }
            if (type == 'addBookmark') {
                this.sendData.folderId = tab && tab.folderId;
            }
        },

        /**
         * 提交
         */
        async submit() {
            try {
                const msg = this.validate(this.type);
                if (msg !== 'success') return this.$message.error(msg || '');
                let res = null;
                if (this.type == 'addBookmark') {
                    res = await this.$axios[userAddBookmarkLink.method](userAddBookmarkLink.url, this.sendData);
                } else {
                    res = await this.$axios[userUpdateBookmarkLink.method](userUpdateBookmarkLink.url, this.sendData);
                }
                if (res && res.code == 200) {
                    this.$message.success(this.type == 'addBookmark' ? '创建成功' : '修改成功');
                    this.dialogConf.isShow = false;
                    this.$emit('refresh', this.sendData);
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
            const accountTest = (v) => /^.{1,50}/.test(v);

            if (!this.sendData.url) {
                this.rule.urlMsg = `请输入链接地址`;
                return this.rule.urlMsg;
            } else if (!accountTest(this.sendData.url)) {
                this.rule.urlMsg = `链接地址不正确`;
                return this.rule.urlMsg;
            } else {
                this.rule.urlMsg = null;
            }

            if (!this.sendData.title) {
                this.rule.titleMsg = `请输入链接名称`;
                return this.rule.titleMsg;
            } else if (!accountTest(this.sendData.title)) {
                this.rule.titleMsg = `链接名称不正确`;
                return this.rule.titleMsg;
            } else {
                this.rule.titleMsg = null;
            }

            if (!this.sendData.folderId) {
                this.rule.folderMsg = `请选择一个分类`;
                return this.rule.folderMsg;
            } else {
                this.rule.folderMsg = null;
            }
            return success;
        },

        /**
         * 重置表单
         */
        reset() {
            this.dialogConf.isShow = false;
        },

        /**
         * 获取输入链接的详情
         */
        async getWebSiteBase(type) {
            if (type === 'addBookmark' && this.sendData.url) {
                this.$message.loading({ message: `正在获取网站信息`, duration: 0 });
                try {
                    const { data: { title, keywords, desc, logo } } = await this.$axios[getCraWebSiteBase.method](getCraWebSiteBase.url, {
                        params: { url: this.sendData.url }
                    });
                    if (title) this.sendData.title = title;
                    if (keywords) this.sendData.keywords = keywords;
                    if (desc) this.sendData.brief = desc;
                    if (logo) this.sendData.logo = logo;
                } catch (error) {
                    console.error(`提交出错：`, error);
                }
                this.$message.closeAll();
            }
        }
    }
};
</script>
<style lang="less" scoped>
@import url('~@/assets/styles/common/constant');
.app-folder-dialog{
    color: @app-theme-color;
    .form-title{
        margin-bottom: 40px;
        text-align: center;
        font-size: 16px;
    }
    .app-form{
        .form-item{
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            .form-item-submit,
            .form-item-cancel{
                display: block;
                padding: 5px 30px;
                border: 1px solid @app-theme-color;
                color: #fff;
                background: @app-theme-color;
                border-radius: 3px;
                cursor: pointer;
                opacity: .8;
                font-size: 14px;
                outline: none;
                margin: 0 20px;
                &:hover{
                    opacity: 1;
                }
            }
            .form-item-cancel{
                color:  @app-theme-color;
                background: none;
                &:hover{
                    color: #fff;
                    background: @app-theme-color;
                }
            }
        }
        .form-item-btns{
            justify-content: center;
        }
    }
}
</style>
