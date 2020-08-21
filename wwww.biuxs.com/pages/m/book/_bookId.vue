<template>
    <div class="app-m-container">
        <app-top-bar>{{ book.title }}</app-top-bar>
    </div>
</template>
<script>
// import { getSiteHomeData } from '@/http';
import { AppTopBar } from '../components';
export default {
    name: 'Category',
    components: { AppTopBar },
    data() {
        return {
            book: {
                'bookId': '8AFF15F9140C2377B926F11BDDF873A6',
                'title': '我真不想被夺舍',
                'brief': '秦缺很困惑，作为一个平平无奇的修行者，怎么就成了穿越者眼中的香饽饽？    一个个穿越者都想穿越成自己？穿越不就是另类的夺舍？这不就是馋我身子么？    “既然诸位都想成为我，那么反过来被我收割，也合情合理吧？”    “你看你，人穿越来就行了嘛，还带什么金手指。”',
                'letterCount': 0,
                'chapterCount': 0,
                'author': '更从心',
                'readCount': 0,
                'type': '玄幻小说',
                'pinyin': 'xuanhuanxiaoshuo',
                'tags': '玄幻小说',
                'sourceName': '全本小说网',
                'sourceUrl': 'https://www.quanben.net/296/296576/',
                'image': null,
                'status': 2,
                'configId': 'D655267DEA565CC63BB8A0EDD612B5A6',
                'remark': '初次抓取抓取[全本小说网]-[玄幻小说]-[我真不想被夺舍]-https://www.quanben.net/296/296576/',
                'createdTime': 1597393575,
                'updatedTime': 1597393575
            }
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
