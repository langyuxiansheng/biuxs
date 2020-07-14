import util from '@/lib/util';
import { Loading, Message } from 'element-ui';
export default ({ $axios, redirect }) => {
    // axios 配置
    $axios.defaults.timeout = 1000 * 60 * 5;
    $axios.defaults.baseURL = '/';
    let loading = null;
    $axios.onRequest(config => {
        if (config.url.indexOf('api.tryto.cn') > -1) return config;
        config.headers.Authorization = util.getCookie(`BIU-SERVER-ADMIN-JWT`);
        //===========================签名 S=====================================
        const { noncestr, timestamp, sign } = util.getSign(config);
        config.headers.noncestr = noncestr;
        config.headers.timestamp = timestamp;
        config.headers.sign = sign;
        //===========================签名 E=====================================
        loading = Loading.service({
            lock: true,
            text: '拼命加载中...',
            background: 'rgba(255, 255, 255, .1)'
        });
        // console.log(config);
        //   { withCredentials: true }

        return config;
    });

    $axios.onResponse(response => {
        let data = {};
        if (response && response.data) {
            const { code, msg } = response.data;
            if (code == 200) {
                data = response.data;
            } else if (code == 401) {
                setTimeout(() => {
                    const fullPath = location.pathname;
                    location.href = `/login?redirect=${fullPath}`;
                }, 1200);
                Message.error(msg);
            } else {
                Message.error(msg);
            }
        }
        if (loading) loading.close();
        return data;
    });

    $axios.onError(error => {
        if (loading) loading.close();
        Message.error('哎呀~ (ಥ﹏ಥ)网络又开小差了,请稍后刷新重试!');
        return Promise.reject(error.response.data);
    });
};
