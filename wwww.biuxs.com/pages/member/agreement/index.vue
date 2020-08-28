<template>
    <div class="app-nav-types app-content">
        <app-card-container :title="page && page.title || '用户协议'" icon="iconxieyi" size="18px">
            <div class="app-page-content" v-html="page && page.body" />
        </app-card-container>
    </div>
</template>
<script>
import getWebpage from '@/mixins/getWebpage';
export default {
    name: 'Agreement',
    layout: 'child',
    mixins: [getWebpage('agreement')]
};
</script>
