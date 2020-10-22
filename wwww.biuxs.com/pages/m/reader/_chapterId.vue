<template>
    <div class="app-reader-contaier">
        <!-- @load-before-deactivate="handleLoadBeforeDeactivate" -->
        <vuescroll ref="AppBookReader" :ops="ops" @load-start="handleLoadStart">
            <template v-if="books && books.length && list && list.length">
                <div v-for="book in books" :key="book.bookId" class="scroll-content">
                    <h4 v-if="list && list.length" class="reader-title">
                        <span class="index">第{{ book.index }}章</span>
                        <span class="title">{{ book.title }}</span>
                    </h4>
                    <div class="reader-content" v-html="formatContent(book.content)" />
                </div>
            </template>
        </vuescroll>
    </div>
</template>
<script>
import vuescroll from 'vuescroll';
import { getBookChapterArticleData, getBookChapterListData } from '@/http';
import util from '@/lib/util';
export default {
    name: 'Reader',
    components: { vuescroll },
    data() {
        const { chapterId } = this.$route.params;
        const { bookId } = this.$route.query;
        return {
            ops: {
                rail: {
                    size: '.15rem'
                },
                bar: {
                    hoverStyle: true,
                    onlyShowBarOnScroll: false, //是否只有滚动的时候才显示滚动条
                    background: 'rgba(0,0,0,.15)' //颜色
                },
                vuescroll: {
                    mode: 'slide',
                    pullRefresh: {
                        enable: true
                    },
                    pushLoad: {
                        enable: true,
                        tips: {
                            start: '加载中...',
                            beforeDeactive: '加载成功!'
                        },
                        auto: !false,
                        autoLoadDistance: 40
                    }
                }
            },
            books: [],
            params: {
                chapterId,
                bookId,
                page: 1,
                limit: 10
            },
            index: 0, //设置的章节索引
            chapter: null, //章节对象
            list: [] //章节对象
        };
    },

    async asyncData({ req, $axios, params }) {
        try {
            const { data } = await $axios[getBookChapterArticleData.method](getBookChapterArticleData.url, { params });
            return { books: data ? [data] : [] };
        } catch (error) {
            console.error(error);
        }
    },

    created() {
        this.getChapterList();
    },

    methods: {

        /**
         * 异步加载数据
         */
        async loadArticleData({ chapterId }) {
            try {
                const { data } = await this.$axios[getBookChapterArticleData.method](getBookChapterArticleData.url, {
                    params: { chapterId }
                });
                if (this.books.length > 3) {
                    const res = this.books.shift();
                    console.log(`object res`, res);
                }
                return data;
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * 获取章节列表
         */
        async getChapterList() {
            try {
                let cache = util.getCache(this.$biuxs.BOOK_CHAPTER_LIST + this.params.bookId) || {};
                if (cache && cache.params) {
                    let { page, limit } = cache.params;
                    // this.index = cache.index || 0;
                    if (this.index < page * limit) { //如果当前的索引小于当前页码数,则返回当前缓存的章节对象
                        this.list = cache.list || [];
                        cache.index = this.index;
                        util.setCache(this.$biuxs.BOOK_CHAPTER_LIST + this.params.bookId, cache);
                        this.chapter = this.list[cache.index % limit];
                        return this.chapter;
                    }
                    this.params.page += 1;
                }
                //如果当前索引超出了则从服务器重新拉取列表
                const { data: { total, list } } = await this.$axios[getBookChapterListData.method](getBookChapterListData.url, {
                    params: this.params
                });
                cache.total = total || 0;
                cache.list = list || [];
                cache.params = this.params;
                cache.index = this.index;
                util.setCache(this.$biuxs.BOOK_CHAPTER_LIST + this.params.bookId, cache);
                this.list = cache.list;
                this.chapter = this.list[this.index % this.params.limit];
                return this.chapter;
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * 上拉加载开始
         */
        async handleLoadStart(vm, refreshDom, done) {
            console.log(`上拉加载`);
            ++this.index;
            const chapter = await this.getChapterList(this.index);
            const data = await this.loadArticleData(chapter);
            if (data) {
                setTimeout(() => {
                    data && this.books.push(data);
                    done();
                }, 10);
            } else {
                done();
            }
        },

        /**
         * 上拉加载完成前
         */
        handleLoadBeforeDeactivate(vm, refreshDom, done) {
            console.log(`上拉加载完成`);
            setTimeout(() => {
                done();
            }, 1000);
        },

        /**
         * 格式化内容显示
         * @param text 小说内容
         * @returns text 格式后的内容
         */
        formatContent(text) {
            if (text) {
                const arr = text.split(new RegExp(`\\s`, 'g'));
                const reg = /|[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+.?/g;
                const showTxt = Array.from(new Set(arr)).filter(item => item).map((txt) => {
                    return `<p>${txt.replace(reg, '')}</p>`;
                }).join('');
                return showTxt;
            }
            return text;
        }
    }
};
</script>
<style lang="less" scoped>
.app-reader-contaier{
    background: #eadcc5;
    // background-image: url('~@/assets/images/reader/skin-default-m-35905b0ba7.jpg');
    // background-size: contain;
    // background-repeat: repeat-y;
    height: 100vh;
    .reader-title{
        font-size: 1.25rem;
        padding: 1rem;
    }
    .reader-content{
        padding: 0 .875rem;
        padding-bottom: 2.5rem;
        line-height: 2;
        font-size: 1rem;
        text-indent: 1.95rem;
    }
}
</style>
