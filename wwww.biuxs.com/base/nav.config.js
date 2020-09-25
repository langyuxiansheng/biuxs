/**
 * 网站配置
 * @description
 */
import { SERVER_HOST } from '@/http/models/types';
import config from './config';
export default {
    install(Vue) {
        Vue.prototype.$biuxs = config;
        Vue.prototype.$IMAGE_PATH = 'https://www.biunav.com' || SERVER_HOST;
        Vue.prototype.$DEFAULT_BOOK_IMAGE = '/books/20200916/BIUXS_WEB_BD63666B81EC7B5128B2DA45FF258A81.jpg';
        return Vue;
    }
};
