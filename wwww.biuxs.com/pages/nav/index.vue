<template>
    <div class="app-nav-warp app-content">
        <div class="app-navs">
            <div class="logo">
                <nuxt-link to="/">
                    笔优网
                </nuxt-link>
            </div>
            <ul class="navs">
                <li class="nav">
                    <nuxt-link to="/home">
                        首页
                    </nuxt-link>
                </li>
                <li class="nav">
                    <nuxt-link to="/nav">
                        网址分类
                    </nuxt-link>
                </li>
                <li class="nav">
                    <nuxt-link to="/nav2">
                        资讯头条
                    </nuxt-link>
                </li>
                <li class="nav">
                    <nuxt-link to="/nav3">
                        技术文章
                    </nuxt-link>
                </li>
                <li class="nav">
                    <nuxt-link to="/nav4">
                        在线工具
                    </nuxt-link>
                </li>
            </ul>
        </div>
        <div class="nav-types">
            <div class="nav-aside">
                <!-- <div class="aside-title">
                    全部分类
                </div> -->
                <ul class="aside" :class="{'nav-aside-fixed': isFixedTop}">
                    <template v-for="(item,k) in asides">
                        <li :key="k" class="type">
                            <a :data-target="item" :class="{'active':k == activeIndex}" @click="handleTypeClick(item,k)"> {{ item }}</a>
                        </li>
                    </template>
                </ul>
            </div>
            <div class="nav-content">
                <div v-for="item in asides" :id="item" :key="item" class="nav-card">
                    <h4 class="nav-title">
                        {{ item }}
                    </h4>
                    <ul class="navs">
                        <li v-for="i in 20" :key="i" class="nav">
                            <a href="#">
                                <img class="n-logo" src="https://www.baidu.com/favicon.ico" alt="logo">
                                <span class="n-name">百度一下,你就知道</span>
                                <p class="n-desc">
                                    全球最大的中文搜索引擎
                                </p>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="nav-recommend">
            导航推荐
        </div>
    </div>
</template>
<script>
import getWebpage from '@/mixins/getWebpage';
import isFixedTop from '@/mixins/isFixedTop';
export default {
    name: 'SetHome',
    layout: 'child-nosearch',
    mixins: [getWebpage('setHome'), isFixedTop(100)],
    data() {
        return {
            asides: ['热门推荐', '高清图库', '设计教程', '界面设计', '灵感创意', '设计工具', '素材资源', '酷站模版', '字体设计', '配色方案', '摄影美图'],
            activeIndex: 0
        };
    },
    mounted() {
        this.initScroll();
    },
    methods: {
        handleTypeClick(item, k) {
            this.$nextTick(() => {
                document.querySelector('#' + item).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        },
        initScroll() {
            document.body.onscroll = (e) => {
                if (document.documentElement && document.documentElement.scrollTop) {
                    const scrollTop = document.documentElement.scrollTop;
                    let scrollItems = document.querySelectorAll('.nav-card');
                    for (let i = scrollItems.length - 1; i >= 0; i--) {
                        // 判断滚动条滚动距离是否大于当前滚动项可滚动距离
                        let judge = scrollTop >= scrollItems[i].offsetTop - scrollItems[0].offsetTop;
                        if (judge) {
                            this.activeIndex = i;
                            break;
                        }
                    }
                }
            };
        }
    }
};
</script>
<style lang="less" scoped>
@import url('~@/assets/styles/common/constant');
.app-nav-warp{
    .app-navs{
        display: flex;
        align-items: center;
        height: 60px;
        margin: 20px auto;
        .logo{
            a{
                color: @app-theme-color;
                font-size: 26px;
            }
        }
        .navs{
            flex: 1;
            display: flex;
            align-items: center;
            margin-left: 56px;
            .nav{
                margin: 0 12px;
                a{
                    color: #fff;
                    font-size: 18px;
                    &:hover{
                        color: #ff5722;
                    }
                }
                .nuxt-link-active{
                    color: #ff5722;
                }
            }
        }
    }
    .nav-types{
        display: flex;
        .nav-aside{
            margin-right: 20px;
            min-width: 126px;
            .aside{
                background: rgba(255, 255, 255, .75);
                border-radius: 4px;
                padding: 20px;
                margin: 0;
                .type{
                    padding: 10px 15px;
                    position: relative;
                    cursor: pointer;
                    transition: all .2s ease-in;
                    &:hover{
                        color: @app-theme-color;
                    }
                }
                .active{
                    color: @app-theme-color;
                    &::after{
                        display: table;
                        content: '';
                        width: 12px;
                        height: 2px;
                        background: @app-theme-color;
                        position: absolute;
                        left: -5%;
                        top: 50%;
                    }
                }
            }
            .nav-aside-fixed{
                position: fixed;
                top: 0;
            }
        }
        .nav-content{
            flex: 1;
            overflow: auto;
            transition: all .5s ease;
            .nav-card{
                background: rgba(255, 255, 255, .75);
                border-radius: 4px;
                padding: 20px;
                margin-bottom: 20px;
                .nav-title{
                    padding: 10px;
                    font-size: 16px;
                }
                .navs{
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    margin: 0;
                    .nav{
                        width: calc(100% / 5);
                        padding: 10px;
                        a{
                            color: #2e211e;
                            display: block;
                            font-size: 14px;
                            padding: 12px;
                            border-radius: 4px;
                            transition: all .2s ease-in;
                            background: rgba(255, 255, 255, .85);
                            color: #535353;
                            .n-logo{
                                width: 24px;
                                height: 24px;
                                vertical-align: middle;
                                border-radius: 4px;
                                overflow: hidden;
                            }
                            .n-name{
                                margin-left: 5px;
                                vertical-align: sub;
                            }
                            .n-desc{
                                margin-top: 10px;
                                font-size: 12px;
                            }
                            &:hover{
                                box-shadow:0px 0px 8px 0px #ab8f86;
                                .n-name{
                                    color: @app-theme-color;
                                    text-decoration: underline;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .nav-recommend{
        margin-bottom: 100px;
        height: 500px;
    }
}
</style>
