<template>
    <div class="app-nav-types app-content">
        <app-card-container :title="page && page.title || '广告合作'" icon="iconguanggao" size="18px">
            <div class="app-page-content" v-html="page && page.body" />
        </app-card-container>
    </div>
</template>
<script>
import getWebpage from '@/mixins/getWebpage';
export default {
    name: 'Adpart',
    layout: 'child',
    mixins: [getWebpage('adpart')]
};
</script>
