<template>
    <div class="app-nav-bar">
        <div class="app-content app-flex">
            <nuxt-link class="app-logo" to="/">
                <i class="iconfont iconbiulogo" />
                <span>笔优导航</span>
            </nuxt-link>
            <ul class="nav-items app-flex">
                <li class="tab-item tab-title-active">
                    <nuxt-link to="/">
                        导航推荐
                    </nuxt-link>
                </li>
                <li class="tab-item">
                    <nuxt-link to="/">
                        分类导航
                    </nuxt-link>
                </li>
                <li class="tab-item">
                    <nuxt-link to="/">
                        文章推荐
                    </nuxt-link>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    name: 'AppNavBar'
};
</script>
<style lang="less" scoped>
@import url('~@/assets/styles/common/constant');
.app-nav-bar{
    // background: #fff;
    .app-content{
        .app-content();
        margin: 20px auto;
        align-items: flex-end;
        .app-logo{
            color: @app-theme-color;
            font-size: 28px;
            font-weight: 200;
            .iconfont{
                font-size: 36px;
                font-weight: bold;
            }
        }
        .nav-items{
            align-items: center;
            flex: 1;
            height: 28px;
            margin-left: 40px;
            // border-bottom: 1px dashed @app-theme-boder;
            .tab-item{
                a{
                    cursor: pointer;
                    padding: 10px 15px;
                    border-radius: 2px;
                    transition: all 0.3s ease-in;
                    text-align: center;
                    // background: #f7f9fb;
                    // border: 1px solid @app-bg-color;
                    // color: #797d83;
                    font-size: 18px;
                    &:hover{
                        // background-color: @app-hover-bg;
                        // border: 1px solid @app-theme-boder;
                        color: @app-theme-color;
                    }
                }
            }
            .tab-title-active{
                a{
                    color: @app-theme-color;
                }
            }
        }
    }
}
</style>
