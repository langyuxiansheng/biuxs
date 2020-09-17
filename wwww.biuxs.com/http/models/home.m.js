import { API_SERVER } from './types';
export default {
    /**
     * 获取移动端首页的数据（无需token）
     */
    getHomeMobileData: {
        url: `${API_SERVER}/biuxs/site/getHomeMobileData`,
        method: 'get'
    }
};
