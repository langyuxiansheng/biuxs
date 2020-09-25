<template>
    <div class="app-m-container">
        <app-top-bar>{{ book.title }}</app-top-bar>
        <div class="app-book">
            <div class="book-img">
                <template v-if="book.image">
                    <img class="image" :src="$IMAGE_PATH + book.image" alt="image">
                </template>
                <template v-else>
                    <img class="image" :src="$IMAGE_PATH + $DEFAULT_BOOK_IMAGE" alt="image">
                </template>
            </div>
            <div class="book-info">
                <h3 class="title">
                    {{ book.title }}
                </h3>
                <div class="book-item app-flex">
                    <span class="b-label">
                        作者
                    </span>
                    <span class="b-value">
                        {{ book.author }}
                    </span>
                </div>
                <div class="book-item app-flex">
                    <span class="b-label">
                        分类
                    </span>
                    <span class="b-value">
                        {{ book.type }}
                    </span>
                </div>
                <div class="book-item app-flex">
                    <span class="b-label">
                        状态
                    </span>
                    <span class="b-value">
                        连载中
                    </span>
                </div>

                <div class="book-item app-flex">
                    <span class="b-label">
                        更新
                    </span>
                    <span class="b-value">
                        {{ book.updatedTime | formatDateYearMonthDay }}
                    </span>
                </div>
            </div>
        </div>
        <div class="app-btns app-flex">
            <button v-waves class="app-btn">
                <nuxt-link to="/m/reader/BE0E3A76C93C9CF3AA73F14CC5CAC14C">
                    开始阅读
                </nuxt-link>
            </button>
            <button v-waves class="app-btn">
                加入书架
            </button>
        </div>
        <div class="book-brief">
            <h6 class="name">
                书本简介
            </h6>
            <div class="brief">
                {{ book.brief }}
            </div>
        </div>
        <!-- <div class="book-chapter">
            <h4 class="chapter-title">
                <span class="name">
                    最新章节预览
                </span>
            </h4>
            <ul class="chapter-list">
                <template v-for="index in 2">
                    <li :key="index" class="item">
                        <nuxt-link v-waves class="item-link" to="/article">
                            <span class="chapter-index">第{{ index }}章</span>
                            <span class="chapter-name">远古魔法——风神的审判</span>
                        </nuxt-link>
                    </li>
                </template>
            </ul>
        </div> -->
        <div class="book-chapter">
            <h4 class="chapter-title">
                <span class="name">
                    最新章节列表
                </span>
            </h4>
            <ul v-if="list && list.length" class="chapter-list">
                <template v-for="item in list">
                    <li :key="item.chapterId" class="item">
                        <nuxt-link v-waves class="item-link" :to="`/m/reader/${item.chapterId}?bookId=${params.bookId}`">
                            <span class="chapter-index">第{{ item.index }}章:</span>
                            <span class="chapter-name">{{ item.title }}</span>
                        </nuxt-link>
                    </li>
                </template>
            </ul>
        </div>
        <div class="app-pager app-flex">
            <span class="app-btn" @click="handlePage(params.page > 1 ? --params.page : 1)">上一页</span>
            <span class="app-page-jump app-flex">
                <font>第</font>
                <input v-model="params.page" type="number" @blur="handlePage(params.page <= total ? params.page : 1)">
                <font>/{{ total }}页</font>
            </span>
            <span class="app-btn" @click="handlePage(params.page < total ? ++params.page : total)">下一页</span>
        </div>
    </div>
</template>
<script>
import { getBookDetailData, getBookChapterListData } from '@/http';
import { AppTopBar } from '../components';
import util from '@/lib/util';
export default {
    name: 'Book',
    components: { AppTopBar },
    data() {
        const { bookId } = this.$route.params;
        return {
            book: {},
            list: [],
            total: 0,
            params: {
                bookId,
                page: 1,
                limit: 10
            }
        };
    },
    async asyncData({ req, $axios, params }) {
        try {
            const { data } = await $axios[getBookDetailData.method](getBookDetailData.url, { params });
            return { book: data || {} };
        } catch (error) {
            console.error(error);
        }
    },
    created() {
        const cache = util.getCache(this.$biuxs.BOOK_CHAPTER_LIST + this.params.bookId);
        if (cache && cache.params) this.params = cache.params;
        this.init();
    },
    methods: {
        async init() {
            try {
                const { data: { list, total } } = await this.$axios[getBookChapterListData.method](getBookChapterListData.url, {
                    params: this.params
                });
                this.list = list;
                this.total = total ? Math.ceil(total / this.params.limit) : 0;
                this.bookCache();
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * 设置缓存
         */
        bookCache() {
            try {
                util.setCache(this.$biuxs.BOOK_CHAPTER_LIST + this.params.bookId, {
                    params: this.params,
                    list: this.list,
                    total: this.total,
                    book: this.book
                });
            } catch (error) {
                console.error(`设置缓存出错`, error);
            }
        },

        /**
         * 分页回调
         */
        handlePage(page) {
            this.params.page = page;
            this.init();
        }
    }
};
</script>
<style lang="less" scoped>
@tag-size: 1.125rem;
.app-m-container{
    padding-top: 2.5rem;
    .app-book{
        display: flex;
        padding: 1.25rem 1rem;
        font-size: .75rem;
        background: #eaf5ef;
        .book-img{
            width: 5rem;
            height: 6.875rem;
            .image{
                width: 100%;
                height: 100%;
                border-radius: .25rem;
            }
        }
        .book-info{
            flex: 1;
            margin-left: 1rem;
            .title{
                font-size: 1rem;
                margin-bottom: .625rem;
            }
            .book-item{
                font-size: .875rem;
                & + .book-item{
                    margin-top: .625rem;
                }
                .b-label{
                    display: inline-block;
                    font-weight: bold;
                }
                .b-value{
                    margin-left: .25rem;
                }
            }
        }
    }
    .app-btns{
        justify-content: center;
        background: #eaf5ef;
        padding-bottom: 1rem;
        .app-btn{
            flex: 1;
            margin: 0 1rem;
            padding: .5rem;
            font-size: .875rem;
            a{
                color: #fff;
            }
        }
    }
    .book-brief{
        padding: 1rem;
        font-size: .875rem;
        .name{
            font-size: 1rem;
            margin-bottom: .75rem;
        }
        .brief{
            line-height: 1.5;
        }
    }
    .book-chapter{
        .chapter-title{
            padding: .625rem 1rem;
            background: @app-theme-color;
            color: #fff;
        }
        .chapter-list{
            font-weight: bold;
            background: #eaf5ef;
            padding-top: 1.25rem;
            .item{
                position: relative;
                &::after{
                    content: '';
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    height: 1px;
                    background: #cee2d8;
                }
                .item-link{
                    display: block;
                    padding: .625rem 1rem;
                }
            }
        }
    }
    .app-pager{
        justify-content: center;
        font-size: 1rem;
        padding: 1rem 0;
        .app-btn{
            font-size: .875rem;
            padding: .5rem .75rem;
        }
        .app-page-jump{
            margin: 0 .625rem;
            [type="number"]{
                display: inline-block;
                max-width: 3rem;
                margin: 0 .25rem;
                border: 1px solid @app-theme-color;
                border-radius: .25rem;
                outline: none;
                padding: .25rem;
            }
        }
    }
}

</style>
