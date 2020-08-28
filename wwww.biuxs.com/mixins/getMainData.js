/**
 * 通用主页页面请求
 * @param req 请求的方法
 * @res 返回的字段
 */
export default (req, res) => {
    return {
        data() {
            return {
                ...res
            };
        },
        async asyncData({ $axios }) {
            try {
                const { data } = await $axios[req.method](req.url);
                return { ...data };
            } catch (error) {
                console.error(error);
            }
        }
    };
};
