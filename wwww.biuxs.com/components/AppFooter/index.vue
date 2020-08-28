<template>
    <div class="app-footer-container" :class="{'app-is-fixed': fixed}">
        <div class="app-footer-content app-content">
            <div class="footer-navs app-flex app-flex-around">
                <nuxt-link class="nav" to="/about">
                    <i class="iconfont iconguanyuwomen" />
                    <span>关于我们</span>
                </nuxt-link>
                <!-- <i class="iconfont iconshuxian-copy-copy" />
                <nuxt-link class="nav" to="/adpart">
                    <i class="iconfont iconguanggaohezuo" />
                    <span>广告合作</span>
                </nuxt-link> -->
                <i class="iconfont iconshuxian-copy-copy" />
                <nuxt-link class="nav" to="/included">
                    <i class="iconfont iconinclude" />
                    <span>链接提交</span>
                </nuxt-link>
                <i class="iconfont iconshuxian-copy-copy" />
                <nuxt-link class="nav" to="/options">
                    <i class="iconfont iconyijian" />
                    <span>意见反馈</span>
                </nuxt-link>
                <!-- <i class="iconfont iconshuxian-copy-copy" />
                <nuxt-link class="nav" to="/blacklist">
                    <i class="iconfont iconicon_search" />
                    <span>公司查询</span>
                </nuxt-link> -->
                <i class="iconfont iconshuxian-copy-copy" />
                <a class="nav" href="https://new.cnzz.com/v1/login.php?siteid=1278668303" target="_blink" rel="nofollow">
                    <i class="iconfont icontongji" />
                    <span>站长统计</span>
                </a>
            </div>
            <div class="app-website-info">
                <p>笔优导航 - biunav.com @ All rights Reserved <a href="http://www.beian.miit.gov.cn" target="_blink" rel="nofollow">【蜀ICP备17005357号-2】</a>若本站收录的网站侵害到您的利益，请联系我们进行处理。</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'AppFooter',
    props: {
        fixed: {
            type: [Boolean],
            required: false,
            default: false
        }
    }
};
</script>
<style lang="less" scoped>
@import url('~@/assets/styles/common/constant');
.app-is-fixed{
    position: fixed;
}
.app-footer-container{
    // border-top: 1px solid @app-theme-boder;
    width: 100%;
    background: rgba(255, 255, 255, 0.25);
    font-size: 14px;
    margin-top: 40px;
    width: 100%;
    bottom: 0;
    left: 0;
    z-index: 66;
    .app-footer-content{
        color: #fff;
        a{
            color: #eee;
        }
        .footer-navs{
            padding: 14px 100px;
            .nav{
                font-size: 14px;
                font-weight: 400;
                &:hover{
                    color: @app-hover-color;
                }
            }
        }
        .app-website-info{
            text-align: center;
            font-size: 12px;
            font-weight: 200;
            p{
                padding: 5px;
            }
        }
    }
}
</style>
