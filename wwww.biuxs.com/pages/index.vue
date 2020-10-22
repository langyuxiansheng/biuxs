<template>
    <div class="app-container">
        <app-top-bar />
        <app-search />
        <div v-if="navs && navs.length" class="app-nav-warpper app-content">
            <template v-for="items in navs">
                <div :key="items.typeId" class="nav-box">
                    <h5 v-show="setting.showTypeName" class="type-name">
                        {{ items.title }}
                    </h5>
                    <ul class="nav-ul">
                        <template v-for="(item,k) in items.list">
                            <li :key="k" class="nav">
                                <a :href="item.url" target="_blink" :title="item.title">
                                    <span class="name">
                                        <img class="logo" :src="`${item.url}/favicon.ico`" :onerror="defaultImg">
                                        <label class="t-name">{{ item.title }}</label>
                                    </span>
                                    <!-- <div class="desc">
                                        简介说明
                                    </div> -->
                                </a>
                            </li>
                        </template>
                    </ul>
                </div>
                <!--   <user-bookmarks v-if="userInfo" /> -->
            </template>
        </div>
        <app-footer fixed />
    </div>
</template>
<script>
// import { getSiteHomeData } from '@/http';
// import UserBookmarks from '@/pages/member/user/UserBookmarks';
export default {
    // components: { UserBookmarks },
    data() {
        return {
            navs: [],
            search: [],
            defaultImg: 'this.src="' + require('@/assets/images/link-default.png') + '"'
        };
    },
    computed: {
        userInfo() {
            return this.$store.state.user.userInfo;
        },
        setting() {
            return this.$store.state.user.customSetting;
        }
    },
    async asyncData({ req, $axios }) {
        try {
            // const { data: { navs, search } } = await $axios[getSiteHomeData.method](getSiteHomeData.url);
            // return { navs: navs || [], search: search || [] };
        } catch (error) {
            console.error(error);
        }
    }
};
</script>
<style lang="less" scoped>
@import url('~@/assets/styles/common/constant');
.app-container{
    .app-nav-warpper{
        // height: calc(72vh - 125px);
        overflow: auto;
        background: rgba(255, 255, 255, .85);
        border-radius: 4px;
        padding: 20px;
        .nav-box{
            .type-name{
                color: #fff;
                font-size: 12px;
                padding-left: 12px;
            }
            .nav-ul{
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                .nav{
                    width: calc(100% / 7);
                    padding: 10px;
                    a{
                        display: block;
                        font-size: 14px;
                        padding: 8px;
                        border: 1px solid #1a263e;
                        border-radius: 4px;
                        transition: all .2s ease-in;
                        color: #2e211e;
                        &:hover{
                            color: @app-hover-color;
                            box-shadow:0px 0px 5px 0px rgba(211,211,211,0.6);
                        }
                        .name{
                            display: flex;
                            align-items: center;
                            .logo{
                                width: 28px;
                                height: 28px;
                                border-radius: 100%;
                                cursor: pointer;
                            }
                            .t-name{
                                margin-left: 10px;
                                cursor: pointer;
                            }
                        }
                    }
                }

            }
        }
    }
}

</style>
