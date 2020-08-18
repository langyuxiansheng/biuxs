/**
 * 通用富文本页面请求
 */
import { getWebpageBaseByMenu } from '@/http';
export default (menu) => {
    return {
        data() {
            return {
                page: null
            };
        },
        async asyncData({ $axios }) {
            try {
                const { data } = await $axios[getWebpageBaseByMenu.method](getWebpageBaseByMenu.url, { params: { menu } });
                // console.log(data);
                if (data && data.body) {
                    return { page: data };
                }
                return { page: { body: '暂无内容' } };
            } catch (error) {
                console.error(error);
            }
        }
    };
};
