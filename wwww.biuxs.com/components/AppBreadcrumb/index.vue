<template>
    <div class="app-breadcrumb-bar">
        <template v-for="(nav,k) in navs">
            <template v-if="nav.link">
                <span :key="k" class="link">
                    <nuxt-link :to="nav.link">{{ nav.label }}</nuxt-link>
                </span>
            </template>
            <span v-else :key="k">
                {{ nav.label }}
            </span>
            <i v-if="k < navs.length - 1" :key="k + `E`" class="iconfont iconmianbaoxie" />
        </template>
    </div>
</template>
<script>
export default {
    name: 'AppBreadcrumb',
    props: {
        navs: {
            required: true,
            type: [Array],
            default: () => []
        }
    }
};
</script>
<style lang="less" scoped>
@import url('~@/assets/styles/common/constant');
.app-breadcrumb-bar{
    height: 36px;
    line-height: 36px;
    border-radius: 4px;
    margin: 10px auto;
    .link{
        font-weight: bold;
        a{
            &:hover{
                color: @app-theme-color;
            }
        }
    }
    .iconfont{
        margin: 0 6px;
        font-size: 12px;
    }
    span{
        color: #828282;
    }
}
</style>
