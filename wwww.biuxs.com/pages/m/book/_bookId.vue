<template>
    <div class="app-m-container">
        <app-top-bar>{{ book.title }}</app-top-bar>
        <div class="app-book">
            <div class="book-img">
                <img class="image" src="http://img.1391.com/api/v1/bookcenter/cover/1/683354/683354_731ddfbb9c06418a904b39b6dffdaca7.jpg" alt="image">
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
        <div class="book-chapter">
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
        </div>
        <div class="book-chapter">
            <h4 class="chapter-title">
                <span class="name">
                    最新章节列表
                </span>
            </h4>
            <ul class="chapter-list">
                <template v-for="index in 10">
                    <li :key="index" class="item">
                        <nuxt-link v-waves class="item-link" to="/article">
                            <span class="chapter-index">第{{ index }}章</span>
                            <span class="chapter-name">远古魔法——风神的审判</span>
                        </nuxt-link>
                    </li>
                </template>
            </ul>
        </div>
        <div class="app-pager app-flex">
            <span class="app-btn">上一页</span>
            <sapn class="app-page-jump app-flex">
                <font>第</font>
                <input type="number" value="1">
                <font>/3000页</font>
            </sapn>
            <span class="app-btn">下一页</span>
        </div>
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
