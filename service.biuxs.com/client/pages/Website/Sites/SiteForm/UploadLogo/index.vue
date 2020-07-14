<template>
    <dialog-container class="app-avatar-form" :dialog-conf="dialogConf">
        <app-cropper @success="handleSuccess" @error="handleError" />
    </dialog-container>
</template>
<script>
export default {
    name: 'UploadLogo',
    data() {
        return {
            dialogConf: {
                width: '680px',
                appendToBody: true,
                isShow: false,
                center: true,
                title: null
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
            this.$emit('success', { fileId, path });
            this.dialogConf.isShow = false;
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
