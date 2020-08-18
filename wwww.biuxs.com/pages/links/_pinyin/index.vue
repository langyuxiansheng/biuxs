<template>
    <div class="app-content">
        <AppBreadcrumb :navs="navs" />
        <app-card-container :title="type.name" :icon="type.icon">
            <ul class="app-links app-flex">
                <template v-for="(item,k) in type.sites">
                    <li :key="k" class="link">
                        <a :href="item.url" target="_blink" :title="item.title" rel="nofollow">
                            <img v-if="item.logo" class="link-img-icon" :src="`${$IMAGE_PATH}${item.logo}`" :alt="item.title">
                            <img v-else class="link-img-icon" :src="require('@/assets/images/link-default.png')" :alt="item.title">
                            <span class="link-label">{{ item.title }}</span>
                        </a>
                        <!-- <span class="link-fill">
                                    <i class="iconfont iconarrLeft-fill" />
                                </span> -->
                    </li>
                </template>
            </ul>
        </app-card-container>
    </div>
</template>
<script>
import { getLinksByType } from '@/http';
export default {
    name: 'Links',
    layout: 'child',
    data() {
        return {
            type: {}
        };
    },
    async asyncData({ req, $axios, params }) {
        try {
            const { data } = await $axios[getLinksByType.method](getLinksByType.url, { params });
            const navs = [
                {
                    label: '主页',
                    link: '/'
                },
                {
                    label: '链接分类',
                    link: `/links/${params.pinyin}`
                },
                {
                    label: data && data.name || '其它分类'
                }
            ];
            return { type: data || {}, navs };
        } catch (error) {
            console.error(error);
        }
    }
};
</script>
