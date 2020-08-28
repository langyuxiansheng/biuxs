<template>
    <header class="app-m-header app-flex app-flex-between">
        <nuxt-link class="app-logo" to="/">
            <i class="iconfont iconbiulogo" /> 笔优小说
        </nuxt-link>
        <nuxt-link class="star-book" to="/2">
            <i class="iconfont iconshuji" />
        </nuxt-link>
    </header>
</template>
<script>
export default {
    data() {
        return {

        };
    },
    async asyncData({ req, $axios }) {
        // try {
        //     const { data: { navs, search } } = await $axios[getSiteHomeData.method](getSiteHomeData.url);
        //     return { navs: navs || [], search: search || [] };
        // } catch (error) {
        //     console.error(error);
        // }
    }
};
</script>
<style lang="less" scoped>
.app-m-header{
    background: #fff;
    padding: .625rem;
    position: relative;
    ::after{
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1px;
        background: #f3f3f3;
    }
    .app-logo,
    .iconfont{
        color: @app-theme-color;
        font-size: 1.25rem;
        font-weight: bold;
    }
}
</style>
