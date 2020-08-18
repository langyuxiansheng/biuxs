<template>
    <div class="app-m-container">
        <footer class="app-m-footer">
            <ul class="footer-bar">
                <li class="item">
                    首页
                </li>
                <li class="item">
                    分类
                </li>
                <li class="item">
                    排行
                </li>
                <li class="item">
                    我的
                </li>
            </ul>
        </footer>
    </div>
</template>
<script>
// import { getSiteHomeData } from '@/http';
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
.app-m-container{
    .app-m-footer{
        width: 100%;

    }
}

</style>
