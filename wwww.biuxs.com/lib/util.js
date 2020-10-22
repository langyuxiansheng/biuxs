/**
 * 公有方法类
 */

import dayjs from 'dayjs';
import zhCn from 'dayjs/locale/zh-cn';
import MD5 from 'blueimp-md5';
import Cookies from 'js-cookie';
import config from '@/base/config';
dayjs.locale(zhCn);
const util = {

    /**
     * 设置cookie
     * @param name
     * @param value
     * @param expires
     */
    setCookie(name, value, expires) {
        Cookies.set(name, value, { expires: expires || 7 });
    },

    /**
     * 清除cookie
     * @param name
     * @param isClearAll 是否清除所有
     */
    clearCookie(name) {
        Cookies.remove(name);
    },

    /**
     * 获取cookie
     * @param name
     * @returns {*}
     */
    getCookie(name) {
        return Cookies.get(name);
    },

    /**
     * 设置缓存值
     * @param key
     * @param val
     * @param store  locale || session
     */
    setCache(key, val, store = 'L') {
        if (!key) throw new Error('key undefined');
        if (typeof window === 'object') {
            const value = JSON.stringify(val);
            store === 'L' ? window.localStorage.setItem(key, value) : window.sessionStorage.setItem(key, value);
        } else {
            console.error('window undefined');
        }
    },

    /**
     * 获取缓存值
     * @param key
     * @param store  locale || session
     */
    getCache(key, store = 'L') {
        if (!key) throw new Error('key undefined');
        if (typeof window === 'object') {
            const res = store === 'L' ? window.localStorage.getItem(key) : window.sessionStorage.getItem(key);
            return res ? JSON.parse(res) : res;
        } else {
            console.error('window undefined');
        }
    },

    /**
     * 删除缓存值
     * @param key
     * @param store  L || S
     */
    delCache(key, store = 'L') {
        if (!key) throw new Error('key undefined');
        if (typeof window === 'object') {
            store === 'L' ? window.localStorage.removeItem(key) : window.sessionStorage.removeItem(key);
        } else {
            console.error('window undefined');
        }
    },

    /**
     * 清除所有缓存值
     * @param key
     */
    clearCache() {
        if (typeof window === 'object') {
            window.localStorage.clear();
            window.sessionStorage.clear();
        } else {
            throw new Error('window undefined');
        }
    },

    /**
     * 生成随机颜色
     * @returns #color
     */
    getRandomColor() {
        return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
    },

    /**
     * 随机获取数组中的元素
     * @param {*} arr
     * @param {*} count
     */
    getRandomElements(arr, count) {
        const shuffled = arr.slice(0);
        let i = arr.length;
        let min = i - count;
        let temp = null;
        let index = 0;
        while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
            // console.log(shuffled[i]);
        }
        return shuffled.slice(min);
    },

    /**
     * 转换时间戳 YYYY-MM-DD
     * @param timestamp
     * @return {string}
     */
    formatDateYearMonthDay(timestamp) {
        let isSec = (timestamp + '').length === 10;
        return isSec ? dayjs.unix(timestamp).format('YYYY-MM-DD') : dayjs(timestamp).format('YYYY-MM-DD');
    },

    /**
     * 转换时间戳 时分秒
     * @param timestamp
     * @return {string}
     */
    formatDateHourMinSec(timestamp) {
        let isSec = (timestamp + '').length === 10;
        return isSec ? dayjs.unix(timestamp).format('hh:mm:ss') : dayjs(timestamp).format('hh:mm:ss');
    },

    /**
     * 转换时间戳 年月日时分秒
     * @param timestamp
     * @return {string}
     */
    formatDateYearMonthDayAndHms(timestamp) {
        let isSec = (timestamp + '').length === 10;
        return isSec ? dayjs.unix(timestamp).format('YYYY-MM-DD hh:mm:ss') : dayjs(timestamp).format('YYYY-MM-DD hh:mm:ss');
    },

    /**
     * 获取今天0点时间戳 秒
     * @return {number}
     */
    getTodayTimeStamp() {
        return new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
    },

    /**
     * 获取当前时间 年月日时分秒
     * @return {*}
     */
    getThisTime() {
        return this.formatDateYearMonthDayAndHms(Date.parse(new Date()));
    },

    /**
     * 获取今天 23:59分的时间戳
     * @return {number}
     */
    getTodayTimeEnd() {
        return (new Date(new Date().setHours(0, 0, 0, 0)) / 1000) + (24 * 60 * 60) - 1;
    },

    /**
     * 获取昨天 00:00 的时间戳
     * @return {number}
     */
    getYesterdayTime() {
        return (new Date(new Date().setHours(0, 0, 0, 0)) / 1000) - 24 * 60 * 60;
    },

    /**
     * 获取指定时间戳N天前的时间戳
     * @param stamp
     * @param day
     * @return {number}
     */
    getAppointDaysAgoTime(stamp, day) {
        return (stamp / 1000) - (24 * 60 * 60) * (day || 1);
    },

    /**
     * 获取N天前的时间戳
     * @param day
     * @return {number}
     */
    getDaysAgoTime(day) {
        return (new Date(new Date().setHours(0, 0, 0, 0)) / 1000) - 24 * 60 * 60 * (day || 1);
    },

    /**
     * 获取当前年
     */
    getThisYear() {
        return dayjs().format('YYYY');
    },

    /**
     * 获取本月实际 2017 -01
     */
    getThisMonthDate() {
        return dayjs().format('YYYY-MM');
    },

    /**
     * 获取今天 2017-01-01
     */
    getTodayDate() {
        return dayjs().format('YYYY-MM-DD');
    },

    /**
     * 将秒转换为 天-时-分-秒
     * @param msd {Number} 秒数
     * */
    secondToDate(msd) {
        let time = msd;
        if (time != null && time != '') {
            if (time > 60 && time < 60 * 60) {
                time = parseInt(time / 60.0) + '分钟' + parseInt((parseFloat(time / 60.0) -
                    parseInt(time / 60.0)) * 60) + '秒';
            } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
                time = parseInt(time / 3600.0) + '小时' + parseInt((parseFloat(time / 3600.0) -
                        parseInt(time / 3600.0)) * 60) + '分钟' +
                    parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                        parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + '秒';
            } else if (time >= 60 * 60 * 24) {
                time = parseInt(time / 3600.0 / 24) + '天' + parseInt((parseFloat(time / 3600.0 / 24) -
                        parseInt(time / 3600.0 / 24)) * 24) + '小时' + parseInt((parseFloat(time / 3600.0) -
                        parseInt(time / 3600.0)) * 60) + '分钟' +
                    parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                        parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + '秒';
            } else {
                time = parseInt(time) + '秒';
            }
        }
        return time;
    },

    /**
     * 获取年月日 星期 时分秒
     * @return {string}
     */
    geyThisDateYYMMDDHmi() {
        return dayjs().format(`YYYY年MM月DD日 dddd HH:mm:ss`);
    },

    /**
     * 转换时间戳 年月日时分秒
     * @param timestamp
     * @return {string}
     */
    formatDateYearMonthDayAndHmsChinese(timestamp) {
        let isSec = (timestamp + '').length === 10;
        return isSec ? dayjs.unix(timestamp).format('YYYY年MM月DD日 hh时mm分ss秒') : dayjs(timestamp).format('YYYY年MM月DD日 hh时mm分ss秒');
    },

    /**
     * 获得本月的截止日期
     * @return {*|string}
     */
    getMonthEndDate() {
        let now = new Date(); //当前日期
        let nowMonth = now.getMonth(); //当前月
        let nowYear = now.getFullYear(); //当前年
        let monthEndDate = new Date(nowYear, nowMonth, this.getMonthDays(nowMonth));
        return this.formatDate(monthEndDate);
    },

    /**
     * 获得某月的天数
     * @param myMonth
     * @return {number}
     */
    getMonthDays(myMonth) {
        let now = new Date(); //当前日期
        let nowYear = now.getFullYear(); //当前年
        let monthStartDate = new Date(nowYear, myMonth, 1);
        let monthEndDate = new Date(nowYear, myMonth + 1, 1);
        let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
        return days;
    },

    /**
     * 格局化日期：yyyy-MM-dd
     * @param date
     * @return {string}
     */
    formatDate(date) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let weekDay = date.getDate();
        if (month < 10) month = '0' + month;
        if (weekDay < 10) weekDay = '0' + weekDay;
        return (year + '-' + month + '-' + weekDay);
    },

    /**
     * 获得本月的開始日期時間戳
     * @return {*|string}
     */
    getMonthBeginDateStamp() {
        let now = new Date(); //当前日期
        let nowMonth = now.getMonth(); //当前月
        let nowYear = now.getFullYear(); //当前年
        let monthStartDate = new Date(nowYear, nowMonth, 1);
        return this.getFormattertDateTimeStamp(this.formatDate(monthStartDate) + ' ' + '00:00:00') / 1000;
    },

    /**
     * 获得本月的截止日期時間戳
     * @return {*|string}
     */
    getMonthEndDateStamp() {
        let now = new Date(); //当前日期
        let nowMonth = now.getMonth(); //当前月
        let nowYear = now.getFullYear(); //当前年
        let monthEndDate = new Date(nowYear, nowMonth, this.getMonthDays(nowMonth));
        return this.getFormattertDateTimeStamp(this.formatDate(monthEndDate) + ' ' + '23:59:59') / 1000;
    },

    /**
     * 根据指定月份时间戳获得最后一天日期時間戳
     * @param stamp 时间戳
     * @return {number}
     */
    getFormattertMonthEndDateStamp(stamp) {
        let arr = this.formatDateYearMonthDay(stamp).split('-');
        let newYear = arr[0]; //取当前的年份
        let newMonth = arr[1]++; //取下一个月的第一天，方便计算（最后一天不固定）
        if (arr[1] > 12) { //如果当前大于12月，则年份转到下一年
            newMonth -= 12; //月份减
            newYear++; //年份增
        }
        let oneDay = (60 * 60 * 24 * 1000) - 1000;
        let date = new Date(newYear, newMonth, 1); //取当年当月中的第一天
        let lastDay = (new Date(date.getTime() - oneDay)).getDate(); //获取当月最后一天日期
        let fmt = newYear + '/' + newMonth + '/' + lastDay + ' ' + '23:59:59';
        return Date.parse(new Date(fmt)) / 1000;
    },

    /**
     * 获取当年第一天的时间戳秒数
     * @return {number}
     */
    getFirstDayOfYear() {
        let date = new Date();
        date.setDate(1);
        date.setMonth(0);

        let y = date.getFullYear(); //年
        let m = date.getMonth() + 1; //月
        let d = date.getDate(); //日
        let fmt = y + '/' + m + '/' + d + ' ' + '00:00:00';
        return Date.parse(new Date(fmt)) / 1000;
    },

    /**
     * 获得指定日期的時間戳秒数
     * @param formatterDate YYYY-MM-DD hh:mm:ii
     * @return {number} 时间戳秒数
     */
    getFormattertDateTimeStamp(formatterDate) {
        if (formatterDate.indexOf('-') != -1) {
            return Date.parse(new Date(formatterDate.replace(/-/g, '/')));
        } else {
            return Date.parse(new Date(formatterDate));
        }
    },

    /**
     * 获取指定月份天数
     * @param {*} date
     */
    getMonthLength(date) {
        let d = new Date(date);
        // 将日期设置为下月一号
        d.setMonth(d.getMonth() + 1);
        d.setDate('1');
        // 获取本月最后一天
        d.setDate(d.getDate() - 1);
        return d.getDate();
    },

    /**
     * 获取最近一周的时间戳
     */
    getTheLatestWeekTimeStamp() {
        const end = new Date();
        const start = new Date(new Date(new Date().toLocaleDateString()).getTime());
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        return [start, end];
    },

    /**
     * 判断是否是对象
     * @param obj
     * @return {boolean}
     */
    isEmpty(obj) {
        return (Object.keys(obj).length === 0 && obj.constructor === Object);
    },

    /**
     * 移除对象中的空字符串
     * @param test
     * @param recurse
     */
    deleteEmptyString(test, recurse) {
        for (let i in test) {
            if (test[i] === '') {
                delete test[i];
            } else if (recurse && typeof test[i] === 'object') {
                util.deleteEmptyString(test[i], recurse);
            }
        }
    },

    /**
     * 删除对象中的空Key
     * @param test
     * @param recurse
     */
    deleteEmptyObject(test, recurse) {
        for (let i in test) {
            if (util.isEmpty(test[i])) {
                delete test[i];
            } else if (recurse && typeof test[i] === 'object') {
                util.deleteEmptyObject(test[i], recurse);
            }
        }
    },

    /**
     * 移除对象中的无效属性
     * @param obj
     * @return {*}
     */
    removeEmpty(obj) {
        Object.keys(obj).forEach(function(key) {
            (obj[key] && typeof obj[key] === 'object') && util.removeEmpty(obj[key]) ||
                (obj[key] === undefined || obj[key] === null || obj[key] === '') && delete obj[key];
        });
        return obj;
    },

    /**
     * 深度拷贝
     * @param {*} obj
     */
    deepCloneObject(obj) {
        let objClone = Array.isArray(obj) ? [] : {};
        if (obj && typeof obj === 'object') {
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    //判断ojb子元素是否为对象，如果是，递归复制
                    if (obj[key] && typeof obj[key] === 'object') {
                        objClone[key] = util.deepCloneObject(obj[key]);
                    } else {
                        //如果不是，简单复制
                        objClone[key] = obj[key];
                    }
                }
            }
        }
        return objClone;
    },

    /**
     * json对象转FormData
     * @param obj
     * @returns {*}
     */
    jsonToFormData(obj) {
        // 创建表单对象
        let formData = new FormData();
        if (obj) {
            for (let k in obj) {
                formData.append(k, obj[k]);
            }
        }
        return formData;
    },

    /**
     * 线性数据转化为树
     * @param {Object} source 源数据
     * @param {Object} parentKey 父级id key
     * @param {childrenKey} childrenKey 子集key
     * @param {Object} pId 父级标识符
     */
    listToTree(source, parentKey, childrenKey, pId) {
        let data = JSON.parse(JSON.stringify(source));
        let tree = [];
        let temp = null;
        for (let i = 0; i < data.length; i++) {
            if (data[i][parentKey] == pId) {
                let obj = data[i];
                temp = util.listToTree(data, parentKey, childrenKey, data[i][childrenKey]);
                if (temp.length > 0) {
                    obj.children = temp;
                }
                tree.push(obj);
            }
        }
        return tree;
    },

    /**
     * 获取md5小写
     * @param {*} val
     */
    getMD5LC(val) {
        return util.getLC(MD5(`${val}${config.MD5_SALT}`));
    },

    /**
     * 获取md5大写
     * @param {*} val
     */
    getMD5UC(val) {
        return util.getUC(MD5(`${val}${config.MD5_SALT}`));
    },

    /**
     * 字符转小写
     */
    getLC(val) {
        return (val).toLowerCase();
    },

    /**
     * 字符转大写
     * @param {*} val
     */
    getUC(val) {
        return (val).toLocaleUpperCase();
    },

    /**
     * 获取登录用户的信息
     */
    getUserInfo() {
        if (window) {
            const u = window.localStorage.getItem(config.USER_INFO_KEY);
            if (u) {
                return JSON.parse(u);
            }
        }
        return null;
    },

    /**
     * 获取加密参数
     * @param {*} param0
     */
    getSign({ params, data, method }) {
        console.log(`原始参数:`, JSON.stringify(params || data));
        const KEY = 'DFEBAC47B8DD2D803FE2FFADC4990E13';
        const noncestr = Math.random().toString(36).substr(2).toLocaleUpperCase();
        const timestamp = Date.parse(new Date()) / 1000;
        //get 排序加密,post 原参数转字符串加密
        // const paramsStr = method == 'get' ? `${this.objKeySort(params)}&` : JSON.stringify(data);
        const paramsStr = (params || data) ? `${this.objKeySort(this.removeEmpty(params || data))}&` : '';
        // console.log(`签名参数:`, paramsStr);
        const str = (paramsStr).length == 1 ? '' : paramsStr; //空参数加密 移除掉&
        const sign = this.getMD5UC(`${str}${noncestr}${timestamp}${KEY}`);
        // console.log(`签名数据:`, { noncestr, timestamp, sign });
        return { noncestr, timestamp, sign };
    },

    /**
     * 排序的函数
     * @param {*} arys
     */
    objKeySort(arys) {
        if (!arys) return null;
        //先用Object内置类的keys方法获取要排序对象的属性名数组，再利用Array的sort方法进行排序
        let newkey = Object.keys(arys).sort();
        // console.log('newkey=' + newkey);
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
    },

    /**
     * 对象转&拼接
     * @param {*} param
     * @param {*} key
     * @param {*} encode
     */
    parseStr(param, key, encode) {
        if (param == null) return false;
        let arr = [];
        let t = typeof (param);
        if (t == 'string' || t == 'number' || t == 'boolean') {
            arr.push(key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param));
        } else {
            for (let i in param) {
                var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                arr.push(this.parseStr(param[i], k, encode));
            }
        }
        return arr.join('&');
    }
};

export default util;
