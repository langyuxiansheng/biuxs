<template>
    <div class="app-m-container">
        <app-m-header />
        <div class="app-m-content">
            <swiper v-if="banner && banner.length" ref="AppSwiperBanner" class="app-swiper-banner" :options="swiperOptions">
                <template v-for="(img,index) in banner">
                    <swiper-slide :key="index">
                        <div class="swiper-img" :style="{'background-image': `url(${$IMAGE_PATH + img.image})`}" />
                    </swiper-slide>
                </template>
                <div slot="pagination" class="swiper-pagination" />
            </swiper>
            <div class="search-warpper app-flex app-flex-between">
                <i class="iconfont iconicon_search" />
                <input type="search" placeholder="请输入作者名或者书名进行搜索" class="search-input">
            </div>
            <div v-if="stars && stars.length" class="book-floor">
                <h4 class="item-title app-flex app-flex-between">
                    <span class="name">我的收藏</span>
                    <nuxt-link class="more" to="/">
                        查看全部
                    </nuxt-link>
                </h4>
                <ul class="book-list app-flex">
                    <template v-for="item in 4">
                        <li :key="item" class="book-item">
                            <div class="b-image">
                                <img class="image" src="http://img.1391.com/api/v1/bookcenter/cover/1/683354/683354_731ddfbb9c06418a904b39b6dffdaca7.jpg" alt="image">
                                <span class="b-tags">10</span>
                            </div>
                            <span class="b-title">最强狂兵{{ item }}</span>
                        </li>
                    </template>
                </ul>
            </div>
            <div v-if="randoms && randoms.length" class="book-floor">
                <h4 class="item-title app-flex app-flex-between">
                    <span class="name">猜你喜欢</span>
                    <span class="more" to="/">
                        <i class="iconfont iconicon_refresh" />
                        换一换
                    </span>
                </h4>
                <ul class="book-list app-flex">
                    <template v-for="(item,index) in randoms">
                        <li v-if="index < 4" :key="`randoms-${item.bookId}`" class="book-item">
                            <div class="b-image">
                                <template v-if="item.image">
                                    <img class="image" :src="$IMAGE_PATH + item.image" alt="image">
                                </template>
                                <template v-else>
                                    <img class="image" :src="$IMAGE_PATH + $DEFAULT_BOOK_IMAGE" alt="image">
                                </template>
                                <span class="b-tags">{{ item.chapterCount }}</span>
                            </div>
                            <span class="b-title">{{ item.title }}</span>
                        </li>
                    </template>
                </ul>
            </div>
            <div class="book-floor hot-books">
                <h4 class="item-title app-flex app-flex-between">
                    <span class="name">热门推荐</span>
                    <nuxt-link class="more" to="/">
                        查看全部
                    </nuxt-link>
                </h4>
                <ul class="book-list app-flex">
                    <template v-for="item in hots">
                        <li :key="`hots-${item.bookId}`" class="book-item">
                            <div class="b-image">
                                <template v-if="item.image">
                                    <img class="image" :src="$IMAGE_PATH + item.image" alt="image">
                                </template>
                                <template v-else>
                                    <img class="image" :src="$IMAGE_PATH + $DEFAULT_BOOK_IMAGE" alt="image">
                                </template>
                            </div>
                            <nuxt-link class="b-info" :to="`/m/book/${item.bookId}`">
                                <h5 class="b-title">
                                    {{ item.title }}
                                </h5>
                                <div class="b-author">
                                    <span class="b-a-name">{{ item.author }}</span>
                                    <span class="b-a-line">|</span>
                                    <span class="b-a-status">连载中</span>
                                </div>
                                <div class="b-brief">
                                    {{ item.brief }}
                                </div>
                                <div class="b-other">
                                    <span class="b-o-tags">{{ item.type }}</span>
                                    <span class="b-o-tags">阅读数 {{ item.readCount }}</span>
                                    <span class="b-o-tags">共 {{ item.chapterCount }} 章</span>
                                </div>
                            </nuxt-link>
                        </li>
                    </template>
                </ul>
            </div>
            <div class="book-floor">
                <h4 class="item-title app-flex app-flex-between">
                    <span class="name">最新推荐</span>
                    <nuxt-link class="more" to="/">
                        查看全部
                    </nuxt-link>
                </h4>
                <ul class="book-list app-flex">
                    <template v-for="(item,index) in news">
                        <li v-if="index < 4" :key="`news-${item.bookId}`" class="book-item">
                            <div class="b-image">
                                <template v-if="item.image">
                                    <img class="image" :src="$IMAGE_PATH + item.image" alt="image">
                                </template>
                                <template v-else>
                                    <img class="image" :src="$IMAGE_PATH + $DEFAULT_BOOK_IMAGE" alt="image">
                                </template>
                                <span class="b-tags">{{ item.chapterCount }}</span>
                            </div>
                            <span class="b-title">{{ item.title }}</span>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
        <app-m-footer />
    </div>
</template>
<script>
import { getHomeMobileData } from '@/http';
import { AppMHeader, AppMFooter } from '../components';
export default {
    name: 'MobileHome',
    components: { AppMHeader, AppMFooter },
    data() {
        return {
            swiperOptions: {
                pagination: {
                    el: '.swiper-pagination'
                }
            },
            stars: [], //用户收藏
            books: [],
            banner: [],
            randoms: [],
            news: [],
            hots: []
        };
    },
    async asyncData({ req, $axios }) {
        try {
            const { data: { banner, randoms, news, hots } } = await $axios[getHomeMobileData.method](getHomeMobileData.url);
            console.log(banner, randoms, news, hots);
            return {
                banner: banner || [],
                randoms: randoms || [],
                news: news || [],
                hots: hots || []
            };
        } catch (error) {
            console.error(error);
        }
    }
};
</script>
<style lang="less" scoped>
@tag-size: 1.125rem;
.app-m-container{
    .app-m-content{
        max-height: calc(100vh - 5.5rem);
        overflow: auto;
        font-size: .875rem;
        .app-swiper-banner{
            height: 10rem;
            .swiper-img{
                background-repeat: no-repeat;
                background-size: cover;
                height: 100%;
            }
            /deep/ .swiper-pagination-bullet-active{
                background: @app-theme-color;
            }
        }
        .search-warpper{
            border: 1px solid @app-theme-color;
            margin: 1.25rem 1rem;
            height: 2rem;
            border-radius: .25rem;
            .iconfont{
                font-size: .75rem;
                margin-left: .625rem;
                margin-right: .625rem;
            }
            .search-input{
                flex: 1;
                border: none;
                padding: .375rem;
                outline: none;
            }
        }
        .book-floor{
            padding-left: .75rem;
            padding-right: .75rem;
            margin-bottom: 1.25rem;
            .item-title{
                margin-bottom: 1rem;
                .more{
                    .iconfont{
                        font-size: 12px;
                    }
                }
            }
            .book-list{
                .book-item{
                    font-size: .75rem;
                    & + .book-item{
                        margin-left: .5rem;
                    }
                    .b-image{
                        width: 5rem;
                        height: 6.875rem;
                        position: relative;
                        .image{
                            width: 100%;
                            height: 100%;
                            border-radius: .25rem;
                        }
                        .b-tags{
                            display: inline-block;
                            color: #fff;
                            position: absolute;
                            top: 0;
                            right: 0;
                            background: rgba(255, 69, 0, .8);
                            padding: .15rem;
                            text-align: center;
                            border-radius: 20%;
                            font-size: .75rem;
                        }
                    }
                    .b-title{
                        margin-top: .375rem;
                        display: inline-block;
                        color: #535353;
                        font-weight: bold;
                        line-height: 1.3;
                        height: 1.875rem;
                        .ellipsis-mult(2);
                    }
                }
            }
        }
        .hot-books{
            .book-list{
                display: block;
                .book-item{
                    display: flex;
                    & + .book-item{
                        margin-left: 0;
                        margin-top: 1rem;
                    }
                    .b-info{
                        margin-left: 1rem;
                        flex: 1;
                        .b-title{
                            display: block;
                            font-size: .875rem;
                            margin-top: 0;
                            margin-bottom: .5rem;
                            height: auto;
                            line-height: initial;
                            .ellipsis-mult(2);
                        }
                        .b-author{
                            font-size: .75rem;
                            .b-a-line{
                                display: inline-block;
                                margin: 0 .25rem;
                            }
                            .b-a-status{
                                color: #f00;
                            }
                        }
                        .b-brief{
                            margin: .625rem 0;
                            .ellipsis-mult(2);
                            line-height: 1.5;
                            height: 2.25rem;
                        }
                        .b-other{
                            margin-top: .625rem;
                            .b-o-tags{
                                display: inline-block;
                                background: @app-theme-color;
                                padding: .25rem;
                                color: #fff;
                                border-radius: .25rem;
                            }
                        }
                    }
                }
            }
        }
    }
}

</style>
