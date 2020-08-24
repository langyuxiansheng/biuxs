<template>
    <header class="app-top-bar app-flex app-flex-between">
        <span class="app-logo" @click="handleBack()">
            <i class="iconfont iconzuojiantou" />
        </span>
        <h1 class="top-title">
            <slot />
        </h1>
        <nuxt-link class="star-book" to="/m/home">
            <i class="iconfont iconicon13" />
        </nuxt-link>
    </header>
</template>
<script>
export default {
    name: 'AppTopBar',
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
    },
    methods: {
        handleBack() {
            this.$router.back();
        }
    }
};
</script>
<style lang="less" scoped>
.app-top-bar{
    background: #fff;
    padding: .625rem 1rem;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 99;
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
    .top-title{
        font-size: .875rem;
        color: #757757;
    }
}
</style>
