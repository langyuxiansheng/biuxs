import Vue from 'vue';
import VueJsonp from 'vue-jsonp';
import VTooltip from 'v-tooltip';
import filters from '@/filters';
// 图片放大
// import VueDirectiveImagePreviewer from 'vue-directive-image-previewer';
// import 'vue-directive-image-previewer/dist/assets/style.css';
// 自定义全局组件
import components from '@/components';
import config from '@/base/nav.config';
//水波纹效果
import waves from '@/directives/waves';

const IMAGE_PATH = 'http://www.zykqxy.com/zykq';
Vue.prototype.$IMAGE_PATH = IMAGE_PATH;
Vue.use(filters);
Vue.use(waves);
Vue.use(config);
Vue.use(VueJsonp);
Vue.use(VTooltip, {
    disposeTimeout: 5000000,
    autoHide: false,
    defaultOffset: 10
});
// Vue.use(VueDirectiveImagePreviewer, { background: 'rgba(0,0,0,.5)' });
export default () => {
    Object.keys(components).forEach((key) => {
        Vue.component(key, components[key]);
    });
};
