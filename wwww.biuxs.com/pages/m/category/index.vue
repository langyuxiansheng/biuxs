<template>
    <div class="app-m-container">
        <app-m-header />
        <div class="app-m-content">
            <ul class="app-category">
                <template v-for="(cate,index) in cates">
                    <li :key="index" class="cate app-flex app-flex-center">
                        <div class="cate-warp">
                            <i class="iconfont" :class="cate.icon" />
                            <span class="type">
                                {{ cate.type }}
                            </span>
                        </div>
                    </li>
                </template>
            </ul>
        </div>
        <app-m-footer />
    </div>
</template>
<script>
// import { getSiteHomeData } from '@/http';
import { AppMHeader, AppMFooter } from '../components';
export default {
    name: 'Category',
    components: { AppMHeader, AppMFooter },
    data() {
        return {
            swiperOptions: {
                pagination: {
                    el: '.swiper-pagination'
                }
            },
            cates: [{
                type: '武侠修真',
                icon: 'iconwuxia',
                img: 'wuxiaxiuzhen.png'
            },
            {
                type: '玄幻魔法',
                icon: 'iconxuanhuan',
                img: 'xuanhuanmofa.png'
            },
            {
                type: '科幻未来',
                icon: 'iconkehuan',
                img: 'kehuanweilai.png'
            },
            {
                type: '灵异穿越',
                icon: 'iconlingyi',
                img: 'lingyichuanyue.png'
            },
            {
                type: '历史军事',
                icon: 'lishijunshi.png'
            },
            {
                type: '悬疑推理',
                icon: 'icontuilinengli',
                img: 'xuanyituili.png'
            },
            {
                type: '女生专区',
                icon: 'iconnvsheng',
                img: 'nvshengzhuanqu.png'
            },
            {
                type: '男生专区',
                icon: 'iconnansheng',
                img: 'nanshengzhuanqu.png'
            }]
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
        max-height: calc(100vh - 5.5rem);
        overflow: auto;
        font-size: .875rem;
        .app-category{
            display: flex;
            flex-wrap: wrap;
            .cate{
                width: calc(100% / 2);
                min-height: 2.5rem;
                font-size: 1rem;
                .cate-warp{
                    text-align: center;
                    .type{
                        margin-left: 1.25rem;
                    }
                }
            }
        }
    }
}

</style>
