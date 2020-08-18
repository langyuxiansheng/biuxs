import { API_SERVER } from './types';
export default {
    /**
     * 获取首页数据
     */
    getCraWebSiteBase: {
        url: `${API_SERVER}/crawlers/getWebSiteBase`,
        method: 'get'
    }
};
