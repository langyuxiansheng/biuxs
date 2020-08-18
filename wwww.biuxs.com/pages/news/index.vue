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
                    <nuxt-link to="/news">
                        资讯头条
                    </nuxt-link>
                </li>
                <li class="nav">
                    <nuxt-link to="/nav3">
                        技术文章
                    </nuxt-link>
                </li>
                <li class="nav">
                    <nuxt-link to="/tool">
                        在线工具
                    </nuxt-link>
                </li>
            </ul>
        </div>
        <div class="news-warpper">
            <div class="news-list">
                <div class="news-filter">
                    <ul class="filter-ul">
                        <li class="f-btn active">
                            全部
                        </li>
                        <li class="f-btn">
                            快讯
                        </li>
                        <li class="f-btn">
                            动态
                        </li>
                        <li class="f-btn">
                            热点
                        </li>
                        <li class="f-btn">
                            文章
                        </li>
                    </ul>
                </div>
                <ul class="news">
                    <li class="item">
                        <div class="img-box">
                            <img src="http://imgs.ebrun.com/resources/2020_07/2020_07_24/20200724_1595579616305.jpg" alt="保险代理服务商凯森保险完成数百万人民币战略投资融资">
                        </div>
                        <div class="item-content">
                            <h5 class="item-title">
                                保险代理服务商凯森保险完成数百万人民币战略投资融资
                            </h5>
                            <p class="item-desc">
                                保险代理服务商凯森保险完成战略投资数百万人民币融资，投资方为德同资本。
                            </p>
                            <div class="item-other">
                                <span class="date">2020-07-21 18:20</span>
                                <span class="tag">标签: 融资,旅游</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="news-aside">
                热文推荐
            </div>
        </div>
    </div>
</template>
<script>
import getWebpage from '@/mixins/getWebpage';
import isFixedTop from '@/mixins/isFixedTop';
export default {
    name: 'News',
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
    .news-warpper{
        display: flex;
        .news-list{
            flex: 1;
            .news-filter{
                margin-bottom: 20px;
                .filter-ul{
                    margin: 0;
                    display: flex;
                    align-items: center;
                    font-size: 16px;
                    .f-btn{
                        & + .f-btn{
                            margin-left: 20px;
                        }
                    }
                    .active{
                        font-weight: bold;
                        color: #ff5722;
                    }
                }
            }
            .news{
                margin: 0;
                .item{
                    border-radius: 3px;
                    display: flex;
                    line-height: 1.5;
                    .img-box{
                        width: 240px;
                        height: 180px;
                        overflow: hidden;
                        img{
                            display: block;
                            height: 100%;
                            margin: 0 auto;
                        }
                    }
                    .item-content{
                        flex: 1;
                        margin-left: 20px;
                        cursor: pointer;
                        .item-title{
                            font-size: 16px;
                            margin-bottom: 20px;
                            transition: all .2s ease-in;
                            &:hover{
                                color:#ff5722;
                            }
                        }
                        .item-desc{

                        }
                        .item-other{
                            .date{

                            }
                            .tag{

                            }
                        }
                    }
                }
            }
        }
    }
    /**-moz-animation: <div class="news-warpper">
            <div class="news-list">
                <div class="news-filter">
                    筛选
                </div>
                <ul class="news">
                    <li class="item">
                        <div class="img-box">
                            <img src="" alt="">
                        </div>
                        <div class="item-content">
                            <h5 class="item-title">
                                保险代理服务商凯森保险完成数百万人民币战略投资融资
                            </h5>
                            <p class="item-desc">
                                保险代理服务商凯森保险完成战略投资数百万人民币融资，投资方为德同资本。
                            </p>
                            <div class="item-other">
                                <span class="date">2020-07-21 18:20</span>
                                <span class="tag">标签: 融资,旅游</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="news-aside">
                热文推荐
            </div>
        </div>; */
    .nav-recommend{
        margin-bottom: 100px;
        height: 500px;
    }
}
</style>
