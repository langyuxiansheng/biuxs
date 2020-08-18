import types from './types';

export const state = () => ({	//state里面存放的是变量，如果你要注册全局变量，写这里
    userInfo: null,
    customSetting: {} //自定义设置
});

const getters = { //getters相当于是state的计算属性，如果你需要将变量的值进行计算，然后输出，写这里
    userInfo: state => state.userInfo,
    customSetting: state => state.customSetting
};

const actions = {//actions提交的是mutations，相当于就是改变变量的方法的重写，但是，actions是可以进行异步操作的
    setUserInfo({ state, commit }, data) {
        commit(types.SET_USER_INFO, data);
    },
    setCustomSetting({ state, commit }, data) {
        commit(types.SET_CUSTOM_SETTING, data);
    }
};

const mutations = { //修改store中的变量的方法，如果你要改变变量的值，就写这（vuex中state中的值不能直接修改）
    [types.SET_USER_INFO](state, data) {
        state.userInfo = data;
    },
    [types.SET_CUSTOM_SETTING](state, data) {
        state.customSetting = data;
    }
};

export default {
    namespaced: true, //命名空间
    state, //这里你用到了哪几个属性就写哪几个，不需要的可以注释掉
    getters,
    actions,
    mutations
};
