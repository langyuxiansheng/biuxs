import AppMessage from '@/components/AppMessage';
import conf from '@/base/config';
import util from '@/lib/util';
export default ({ $axios }) => {
    $axios.defaults.timeout = 1000 * 60 * 5;
    $axios.defaults.baseURL = '/';
    $axios.onRequest(config => {
        config.headers.Authorization = `Bearer ${util.getCookie(conf.COOKIE_JWT_KEY)}`;
        //===========================签名 S=====================================
        const { noncestr, timestamp, sign } = util.getSign(config);
        config.headers.noncestr = noncestr;
        config.headers.timestamp = timestamp;
        config.headers.sign = sign;
        //===========================签名 E=====================================
        return config;
    });
    $axios.onResponse(response => {
        let data = {};
        if (response && response.data) {
            console.log(response.data);
            const { code, msg } = response.data;
            if (code == 200) {
                data = response.data;
            } else if (code == 401) {
                AppMessage.error(msg);
                util.clearCookie(conf.COOKIE_JWT_KEY);
                if (typeof window !== 'undefined' && window && window.localStorage) {
                    window.localStorage.removeItem(conf.USER_INFO_KEY);
                }
            } else {
                AppMessage.error(msg);
            }
        }
        return data;
    });

    $axios.onError(error => {
        AppMessage.error('服务升级中,请稍后刷新重试!');
        return Promise.reject(new Error(error));
    });
};
