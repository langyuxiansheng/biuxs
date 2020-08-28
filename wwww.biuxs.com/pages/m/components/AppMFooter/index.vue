<template>
    <footer class="app-m-footer">
        <div class="footer-bar app-flex app-flex-between">
            <nuxt-link class="link" to="/m/home">
                <i class="iconfont iconicon13" />
                <span class="label">首页</span>
            </nuxt-link>
            <nuxt-link class="link" to="/m/category">
                <i class="iconfont iconicon_workset" />
                <span class="label">分类</span>
            </nuxt-link>
            <nuxt-link class="link" to="/2">
                <i class="iconfont icontongji" />
                <span class="label">排行</span>
            </nuxt-link>
            <nuxt-link class="link" to="/3">
                <i class="iconfont iconzhanchangpingtai" />
                <span class="label">我的</span>
            </nuxt-link>
        </div>
    </footer>
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
.app-m-footer{
    width: 100%;
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    .footer-bar{
        font-size: 1rem;
        position: relative;
        ::after{
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 1px;
            background: #f3f3f3;
        }
        .link{
            text-align: center;
            flex: 1;
            padding: 1rem .25rem;
            outline: none;
            font-weight: 400;
            .iconfont{
                font-size: 1rem;
            }
        }
        .nuxt-link-active{
            // background: rgba(75,175,126,.8);
            color: @app-theme-color;
        }
    }
}
</style>
