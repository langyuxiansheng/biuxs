/**
 * 通用列表详情类请求
 */
import { getBodyById } from '@/http';
export default {
    data() {
        return {
            info: {}
        };
    },
    async asyncData({ $axios, params }) {
        try {
            const { data } = await $axios[getBodyById.method](getBodyById.url, { params });
            return { info: data || {} };
        } catch (error) {
            console.error(error);
        }
    }
};
