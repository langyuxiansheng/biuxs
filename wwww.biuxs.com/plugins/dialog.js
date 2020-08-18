// import into project
import Vue from 'vue';
import VuejsDialog from '@/components/AppDialogPlugin';
// Tell Vue to install the plugin.
Vue.use(VuejsDialog, {
    html: true,
    loader: true,
    reverse: true,
    okText: '确认',
    cancelText: '取消',
    animation: 'fade', // Available: "zoom", "bounce", "fade"
    customClass: 'app-dg-container'
});
