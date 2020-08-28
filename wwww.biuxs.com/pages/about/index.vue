<template>
    <div class="app-nav-types app-content">
        <app-card-container title="关于我们" icon="iconguanyuwomen1" size="18px">
            <div class="app-page-content" v-html="page && page.body" />
        </app-card-container>
    </div>
</template>
<script>
import getWebpage from '@/mixins/getWebpage';
export default {
    name: 'About',
    layout: 'child',
    mixins: [getWebpage('about')]
};
</script>
