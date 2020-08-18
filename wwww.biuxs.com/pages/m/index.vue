<template>
    <div class="app-m-container">
        <header class="app-m-header">
            <nuxt-link class="app-logo" to="/">
                笔优小说
            </nuxt-link>
        </header>
        <div class="app-m-content">
            content
        </div>
        <footer class="app-m-footer">
            <div class="footer-bar">
                <nuxt-link class="link" to="/">
                    <i class="iconfont iconicon13" />
                    <span class="label">首页</span>
                </nuxt-link>
                <nuxt-link class="link" to="/1">
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
    .app-m-header{
        background: @app-theme-color;
        padding: .625rem;
        .app-logo{
            color: #fff;
            font-size: 1.125rem;
        }
    }
    .app-m-content{
        height: calc(100vh - 2.125rem - 2.375rem);
        overflow: auto;
    }
    .app-m-footer{
        width: 100%;
        background: @app-theme-color;
        .footer-bar{
            display: flex;
            align-items: center;
            justify-content: space-around;
            font-size: .875rem;
            .link{
                text-align: center;
                flex: 1;
                padding: .625rem .25rem;
                color: #fff;
                .iconfont{
                    font-size: .875rem;
                }
            }
            .nuxt-link-active{
                background: rgba(75,175,126,.8);
            }
        }
    }
}

</style>
