<template>
    <div class="app-nav-types app-content">
        <app-card-container :title="page && page.title || '设为主页'" icon="iconguanyuwomen1" size="18px">
            <div class="app-page-content" v-html="page && page.body" />
        </app-card-container>
    </div>
</template>
<script>
import getWebpage from '@/mixins/getWebpage';
export default {
    name: 'SetHome',
    layout: 'child',
    mixins: [getWebpage('setHome')]
};
</script>
