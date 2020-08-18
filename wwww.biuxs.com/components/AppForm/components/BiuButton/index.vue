<template>
    <div class="form-item">
        <button class="form-item-submit" :type="type">
            <slot />
        </button>
    </div>
</template>
<script>
export default {
    name: 'BiuButton',
    props: {
        type: {
            type: String,
            requered: false,
            default: 'button'
        }
    }
};
</script>
<style lang="less" scoped>
@import url('~@/assets/styles/common/constant');
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
</style>
