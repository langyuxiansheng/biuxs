<template>
    <app-dialog class="app-avatar-form" :show.sync="dialogConf.isShow" :width="dialogConf.width" :btns="dialogConf.btns">
        <app-cropper @success="handleSuccess" @error="handleError" />
    </app-dialog>
</template>
<script>
import { userUpdateAvatar, deleteFiles } from '@/http';
import AppCropper from '@/components/AppCropper';
export default {
    name: 'UploadAvatar',
    components: { AppCropper },
    data() {
        return {
            dialogConf: {
                width: '680px',
                isShow: false,
                btns: false
            }
        };
    },
    methods: {
        /**
		 * 初始化
		 */
        async init ({ type, title }) {
            this.dialogConf.isShow = true;
        },

        /**
         * 上传成功回调
         */
        async handleSuccess({ fileId, path }) {
            try {
                const { code } = await this.$axios[userUpdateAvatar.method](userUpdateAvatar.url, { avatar: path });
                if (code == 200) {
                    this.$message.success(`上传成功`);
                    this.dialogConf = false;
                    this.$emit('refresh');
                } else { //未上传成功需要删除文件
                    this.$axios[deleteFiles.method](deleteFiles.url, { data: { ids: [fileId], isDelete: true } });
                }
            } catch (error) {
                console.error(`提交出错：`, error);
            }
        },

        /**
         * 上传成功回调
         */
        async handleError(data) {
            this.$message.error(`上传失败`);
        }
    }
};
</script>
<style lang="less" scoped>
@import url('~@/assets/styles/common/constant');
.app-user-form{
    color: @app-theme-color;
}
</style>
