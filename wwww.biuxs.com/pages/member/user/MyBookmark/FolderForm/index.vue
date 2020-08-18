<template>
    <app-dialog class="app-folder-dialog" :show.sync="dialogConf.isShow" :width="dialogConf.width" :btns="dialogConf.btns">
        <div class="form-title">
            {{ dialogConf.title }}
        </div>
        <div class="app-form">
            <form @submit.prevent="submit()">
                <biu-input v-model="sendData.name" placeholder="请输入分类名称" :error-msg="rule.nameMsg" />
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
import { userAddBookmarkFolder, userUpdateBookmarkFolder } from '@/http';
export default {
    name: 'FolderForm',
    data() {
        return {
            dialogConf: {
                title: '添加分类',
                width: '420px',
                isShow: false,
                btns: false
            },
            type: 'addFolder',
            sendData: {},
            initData: {
                folderId: null,
                userId: null,
                pid: null,
                name: null,
                brief: null
            },
            rule: {
                nameMsg: null //邮箱
            }
        };
    },
    methods: {
        /**
		 * 初始化
		 */
        async init ({ type, title, data }) {
            this.dialogConf.isShow = true;
            this.dialogConf.title = title;
            this.type = type;
            this.sendData = util.deepCloneObject(this.initData);
            for (const key in this.sendData) {
                this.sendData[key] = null;
                if (type == 'updateFolder' && data) {
                    this.sendData[key] = data[key];
                }
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
                if (this.type == 'addFolder') {
                    res = await this.$axios[userAddBookmarkFolder.method](userAddBookmarkFolder.url, this.sendData);
                } else {
                    res = await this.$axios[userUpdateBookmarkFolder.method](userUpdateBookmarkFolder.url, this.sendData);
                }
                if (res && res.code == 200) {
                    this.$message.success(this.type == 'addFolder' ? '创建成功' : '修改成功');
                    this.dialogConf.isShow = false;
                    this.$emit('refresh');
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
            if (!this.sendData.name) {
                this.rule.nameMsg = `请输入分类名称`;
                return this.rule.nameMsg;
            } else if (!accountTest(this.sendData.name)) {
                this.rule.nameMsg = `分类名称不正确`;
                return this.rule.nameMsg;
            } else {
                this.rule.nameMsg = null;
            }
            return success;
        },

        /**
         * 重置表单
         */
        reset() {
            this.dialogConf.isShow = false;
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
