/**
 * 安全签名验证中间件
 * 通过请求headers里的获取redis里存储的用户信息
 */
const result = require(':lib/Result');
const config = require(':config/server.base.config'); //配置文件
const utils = require(':lib/Utils');
/**
 * 获取加密参数
 * @param {*} param0
 */
const getSign = (data, noncestr, timestamp) => {
    const KEY = config.sign.signatureKey;
    const paramsStr = (data) ? `${objKeySort(removeEmpty(data))}&` : '';
    console.log(`签名参数:`, paramsStr);
    const str = (paramsStr).length == 1 ? '' : paramsStr; //空参数加密 移除掉&
    const sign = utils.getUCMd5(`${str}${noncestr}${timestamp}${KEY}`);
    console.log(`服务端签名数据:`, { noncestr, timestamp, sign });
    return { noncestr, timestamp, sign };
};

/**
 * 排序的函数
 * @param {*} arys
 */
const objKeySort = (arys) => {
    if (!arys) return null;
    //先用Object内置类的keys方法获取要排序对象的属性名数组，再利用Array的sort方法进行排序
    let newkey = Object.keys(arys).sort();
    console.log('newkey=' + newkey);
    let newObj = ''; //创建一个新的对象，用于存放排好序的键值对
    for (let i = 0; i < newkey.length; i++) {
        if (typeof arys[newkey[i]] === 'object') { //对象类型转为字符串
            //遍历newkey数组
            newObj += newkey[i] + '=' + JSON.stringify(arys[newkey[i]]) + '&';
        } else {
            //遍历newkey数组
            newObj += [newkey[i]] + '=' + arys[newkey[i]] + '&';
        }
    }
    return newObj.substring(0, newObj.length - 1);
};

/**
 * 移除对象中的无效属性
 * @param obj
 * @return {*}
 */
const removeEmpty = (obj) => {
    Object.keys(obj).forEach(function(key) {
        (obj[key] && typeof obj[key] === 'object') && removeEmpty(obj[key]) || (obj[key] === undefined || obj[key] === null || obj[key] === '') && delete obj[key];
    });
    return obj;
};
module.exports = async (ctx, next) => {
    const { noncestr, timestamp, sign } = ctx.headers;
    console.log(`客户端签名:`, { noncestr, timestamp, sign });
    const time = Date.parse(new Date()) / 1000;
    if (timestamp && (time - timestamp > config.sign.maxAge)) {
        return ctx.body = result.failed('签名无效');
    }
    const signUnlessPath = config.signUnlessPath.map(item => {
        return item.test(ctx.request.path);
    });
    if (!signUnlessPath.includes(true)) {
        let sg = null;
        if (['GET'].includes(ctx.request.method)) {
            sg = getSign(ctx.request.query, noncestr, timestamp);
        } else {
            sg = getSign(ctx.request.body, noncestr, timestamp);
        }
        if (sg.sign !== sign) {
            return ctx.body = result.failed('签名无效');
        }
    } else {
        console.log(`免签url:`, ctx.request.path);
    }
    await next();
};
