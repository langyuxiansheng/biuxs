import { API_SERVER } from './types';
export default {

    /**
     * 添加配置项
     * @param {*} data
     */
    addConfig: {
        url: `${API_SERVER}/common/config/addConfig`,
        method: 'post'
    },

    /**
     * 获取配置项列表
     * @param {*} data
     */
    getConfigList: {
        url: `${API_SERVER}/common/config/getConfigList`,
        method: 'get'
    },

    /**
     * 根据唯一标识符获取配置项
     * @param {*} data
     */
    getConfigByCode: {
        url: `${API_SERVER}/common/config/getConfigByCode`,
        method: 'get'
    },

    /**
     * 编辑配置项
     * @param {*} data
     */
    updateConfig: {
        url: `${API_SERVER}/common/config/updateConfig`,
        method: 'put'
    },

    /**
     * 删除配置项
     * @param {*} data
     */
    delConfigByIds: {
        url: `${API_SERVER}/common/config/delConfigByIds`,
        method: 'delete'
    },

    /**
     * 运行配置项的任务
     * @param {*} data
     */
    runTaskByConfigId: {
        url: `${API_SERVER}/common/config/runTaskByConfigId`,
        method: 'post'
    },

    /**
     * 获取爬虫系统任务列表
     * @param {*} params
     */
    getTaskList: {
        url: `${API_SERVER}/crawlers/tasks/getTaskList`,
        method: 'get'
    },

    /**
     * 删除爬虫系统任务
     * @param {*} params
     */
    delTaskByIds: {
        url: `${API_SERVER}/crawlers/tasks/delTaskByIds`,
        method: 'delete'
    },

    /**
     * 运行爬虫系统任务
     * @param {*} params
     */
    runTaskById: {
        url: `${API_SERVER}/crawlers/tasks/runTaskById`,
        method: 'post'
    }

};
