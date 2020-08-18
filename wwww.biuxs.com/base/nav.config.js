/**
 * 网站配置
 * @description
 */
import { SERVER_HOST } from '@/http/models/types';
import config from './config';
export default {
    install(Vue) {
        Vue.prototype.$biuxs = config;
        Vue.prototype.$IMAGE_PATH = SERVER_HOST;
        return Vue;
    }
};
