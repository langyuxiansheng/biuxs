import filters from './filters.fun';
export default {
    install(Vue) {
        for (let k in filters) {
            Vue.filter(k, filters[k]);
        }
        Vue.prototype.$appFilters = filters;
        return Vue;
    }
};
