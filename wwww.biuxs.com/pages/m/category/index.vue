<template>
    <div class="app-m-container">
        <app-m-header v-show="false" />
        <div id="app-cate-content" class="app-m-content">
            <div class="search-warpper app-flex app-flex-between">
                <input type="search" placeholder="请输入作者名或者书名进行搜索" class="search-input">
                <span class="search-btn">
                    <i class="iconfont iconicon_search" />
                </span>
            </div>
            <div class="app-category" :class="{'app-fixed-top': isFixedTop}">
                <div class="cate-item app-flex">
                    <span class="cate-label">
                        分类
                    </span>
                    <ul class="cates app-flex">
                        <template v-for="(cate,index) in cates">
                            <li :key="index" class="cate" :class="{'cate-active':index == 2}">
                                {{ cate.type }}
                            </li>
                        </template>
                    </ul>
                </div>
                <!-- <div class="cate-item app-flex">
                    <span class="cate-label">
                        状态
                    </span>
                    <ul class="cates app-flex">
                        <li class="cate cate-active">
                            全部
                        </li>
                        <li class="cate">
                            连载中
                        </li>
                        <li class="cate">
                            已完结
                        </li>
                    </ul>
                </div> -->
            </div>
            <div class="app-cate-hr" />
            <div class="book-floor hot-books" :class="{'book-floor-fixed': isFixedTop}">
                <h4 class="item-title app-flex app-flex-between">
                    <span class="name">书籍列表</span>
                </h4>
                <ul class="book-list app-flex">
                    <template v-for="item in books">
                        <li :key="item.bookId" class="book-item">
                            <div class="b-image">
                                <img class="image" src="http://img.1391.com/api/v1/bookcenter/cover/1/683354/683354_731ddfbb9c06418a904b39b6dffdaca7.jpg" alt="image">
                            </div>
                            <div class="b-info">
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
                            </div>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
        <app-m-footer />
    </div>
</template>
<script>
import { getBookTypeData, searchBook } from '@/http';
import { AppMHeader, AppMFooter } from '../components';
import isFixedTop from '@/mixins/isFixedTop';
export default {
    name: 'Category',
    components: { AppMHeader, AppMFooter },
    mixins: [isFixedTop(64, '#app-cate-content')],
    data() {
        return {
            books: [],
            cates: []
        };
    },
    async asyncData({ req, $axios }) {
        try {
            const { data } = await $axios[getBookTypeData.method](getBookTypeData.url);
            return { cates: data || [] };
        } catch (error) {
            console.error(error);
        }
    },

    methods: {

        async init() {
            try {
                const { data: { list, total } } = await this.$axios[searchBook.method](searchBook.url, {
                    params: this.params
                });
                this.list = list;
                this.total = total ? Math.ceil(total / this.params.limit) : 0;
            } catch (error) {
                console.error(error);
            }
        }
    }
};
</script>
<style lang="less" scoped>
@tag-size: 1.125rem;
.app-m-container{
    .app-m-content{
        max-height: calc(100vh - 3rem);
        overflow: auto;
        font-size: .875rem;
        .search-warpper{
            border: 1px solid @app-theme-color;
            margin: 1.25rem 1rem;
            height: 2rem;
            border-radius: .25rem;
            margin-bottom: 0;
            .search-input{
                flex: 1;
                border: none;
                padding: .375rem;
                outline: none;
            }
            .search-btn{
                display: inline-block;
                margin-left: .625rem;
                margin-right: .625rem;
                color: @app-theme-color;
                .iconfont{
                    font-size: 1.25rem;
                    font-weight: bold;
                }
            }
        }
        .app-category{
            padding: 1.25rem 1rem;
            background: @app-bg-color;
            .cate-item{
                align-items: flex-start;
                & + .cate-item{
                    margin-top: .625rem;
                }
                .cate-label{
                    margin-right: .625rem;
                    color: #757575;
                    padding: .4rem 0;
                    font-weight: bold;
                }
                .cates{
                    flex-wrap: wrap;
                    flex: 1;
                    .cate{
                        padding: .4rem;
                        border-radius: .25rem;
                        margin-right: .25rem;
                        &-active{
                            background: @app-theme-color;
                            color: #fff;
                        }
                    }
                }
            }
        }
        .app-cate-hr{
            margin: 1.25rem 1rem;
            height: .0625rem;
            background: @app-theme-color;
            margin-top: 0;
        }
        .book-floor{
            padding-left: .75rem;
            padding-right: .75rem;
            margin-bottom: 1.25rem;
            &-fixed{
                margin-top: 11.5rem;
            }
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
