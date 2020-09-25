<template>
    <el-dialog
        v-if="dialogConf.isShow"
        :close-on-click-modal="dialogConf.closeOnClickModal || false"
        :width="dialogConf.width"
        :center="dialogConf.center"
        :visible.sync="dialogConf.isShow"
        :append-to-body="dialogConf.appendToBody || false"
    >
        <span v-if="dialogConf.title" slot="title">
            {{ dialogConf.title }}
        </span>
        <slot />
    </el-dialog>
</template>
<script type="text/ecmascript-6">
export default {
    name: 'DialogContainer',
    props: {
        dialogConf: {
            type: Object,
            default() {
                return {
                    width: null,
                    isShow: false,
                    center: true,
                    title: null,
                    closeOnClickModal: true,
                    appendToBody: false
                };
            }
        }
    }
};
</script>
<style lang="less" scoped>

</style>
