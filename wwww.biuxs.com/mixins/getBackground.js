/**
 * 通用背景页面请求
 */
import { getBackgroundData } from '@/http';
export default (menu) => {
    return {
        data() {
            return {
                backgroundImg: null
            };
        },
        // async asyncData({ $axios }) {
        //     try {
        //         const { data } = await $axios[getBackgroundData.method](getBackgroundData.url, { params: { menu } });
        //         return { backgroundImg: data.path };
        //     } catch (error) {
        //         console.error(error);
        //     }
        // },
        mounted() {
            this.getBg();
        },
        methods: {
            async getBg() {
                try {
                    const { data: { path } } = await this.$axios[getBackgroundData.method](getBackgroundData.url, { params: { menu } });
                    this.backgroundImg = path;
                } catch (error) {
                    console.error(error);
                }
            }
        }
    };
};
