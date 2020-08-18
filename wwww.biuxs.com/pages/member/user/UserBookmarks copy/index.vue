<template>
    <div class="app-user-bookmarks">
        <div class="app-card-container">
            <!-- <ul class="bookmark-tabs">
                <template v-for="items in userBookmarks">
                    <li v-if="items.list && items.list.length" :key="items.folderId" class="tab-title" :class="{'tab-title-active':activeItem && activeItem.folderId === items.folderId}" @click="handleHover(items)">
                        <a :href="`#${items.title}`">{{ items.title }}</a>
                    </li>
                </template>
            </ul> -->
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
    .bookmark-tabs{
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: 10px 10px 0;
        background: #fff;
        border-radius: 4px;
        // border-bottom: 1px dashed @app-theme-boder;
        .tab-title{
            cursor: pointer;
            transition: color .2s ease-in;
            min-width: calc(100% / 10 - 10px);
            padding: 5px 10px;
            border-radius: 2px;
            transition: all 0.3s ease-in;
            margin: 0 5px 10px;
            text-align: center;
            background: #f7f9fb;
            border: 1px solid #f7f9fb;
            color: #797d83;
            &:hover{
                background-color: @app-hover-bg;
                border: 1px solid @app-theme-boder;
                color: @app-theme-color;
            }
        }
        .tab-title-active{
            color: @app-theme-color;
        }
    }
    .app-card-container{
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        margin-bottom: 20px;
        .card-content{
            padding: 10px 15px 5px;
            & + .card-content{
                border-top: 1px dashed @app-theme-boder;
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
}
</style>
