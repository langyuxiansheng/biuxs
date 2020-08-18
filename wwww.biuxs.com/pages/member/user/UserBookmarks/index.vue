<template>
    <div class="app-user-bookmarks">
        <template v-for="items in userBookmarks">
            <div v-if="items.list && items.list.length" :key="items.folderId" class="card-content">
                <div class="card-content-title">
                    <span class="title">{{ items.title }}</span>
                </div>
                <ul class="app-links app-flex bookmark-app-links">
                    <template v-for="(item,k) in items.list">
                        <li :key="k" class="link">
                            <a :href="item.url" target="_blink" :title="item.title" rel="nofollow">
                                <img v-if="item.logo" class="link-img-icon" :src="item.logo" :alt="item.title">
                                <img v-else class="link-img-icon" :src="require('@/assets/images/link-default.png')" :alt="item.title">
                                <span class="link-label">{{ item.title }}</span>
                            </a>
                        </li>
                    </template>
                </ul>
            </div>
        </template>
    </div>
</template>
<script>
import { getUserBookmarkHomeData } from '@/http';
export default {
    data() {
        return {
            navs: [],
            userBookmarks: [],
            activeItem: null
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        async init() {
            try {
                const { data: { navs } } = await this.$axios[getUserBookmarkHomeData.method](getUserBookmarkHomeData.url);
                this.userBookmarks = navs || [];
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * tab hover
         */
        handleHover(item) {
            console.log(item);
            this.activeItem = item;
        }
    }
};
</script>
<style lang="less" scoped>
@import url('~@/assets/styles/common/constant');
.app-user-bookmarks{
    margin-bottom: 20px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    margin-bottom: 20px;
    .card-content{
        padding: 10px 15px 5px;
        & + .card-content{
            border-top: 1px dashed @app-bg-color;
        }
        .card-content-title{
            margin-bottom: 10px;
            .title{
                display: inline-block;
                font-size: 12px;
                background: #5ed2fc;
                padding: 4px;
                color: #fff;
                border-radius: 2px;
            }
        }
        .app-links{
            .link{
                min-width: calc(100% / 8);
                a{
                    .link-label{
                        font-size: 14px;
                    }
                }
                &:hover{
                    background: @app-hover-bg;
                }
            }
        }
    }
}
</style>
