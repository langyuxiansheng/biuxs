const path = require('path');
const MD5 = require('blueimp-md5');
const UUID = require('uuid');
const JWT = require('jsonwebtoken');
const config = require(':config/server.base.config'); //配置文件
const SRC_PATH = path.join(__dirname, '../');
const MODELS_PATH = path.join(__dirname, '../models');
/**
 * 工具类
 */
const Utils = {
    //获取models路径
    SRC_PATH: SRC_PATH,
    MODELS_PATH: MODELS_PATH,

    /**
     * 验证是否是超级管理员
     * @param {*} data
     * @returns Boolean
     */
    isSuperAdmin(data) {
        return data && data.userId && data.isAdmin && (data.roleId === config.superAdminRoleId);
    },

    /**
     * 获取jwt数据
     * @param {*} authorization
     */
    getJwtData(authorization) {
        if (!authorization) return null;
        return JWT.verify(authorization, config.jwtPublicKey);
    },

    /**
     * 签发jwt
     * @param {*} data  你要保存到token的数据
     * @param {*} expiresIn  秒到期时间
     */
    signJWT(data = {}, expiresIn) {
        const time = 60 * 30; //默认为30分钟的有效期
        const sign = { data, publicKey: config.jwtPublicKey, expiresIn: { expiresIn: expiresIn || time } };
        return JWT.sign(sign.data, sign.publicKey, sign.expiresIn);
    },

    /**
     * 取随机数
     */
    getRandomNum(min = 1, max = 100) {
        let range = min - max;
        let rand = Math.random();
        return Math.abs(min + Math.round(rand * range));
    },

    /**
     * 获取MD5加密
     */
    getMd5(str) {
        return MD5(`${str}${config.saltMD5}`).toUpperCase();
    },

    /**
     * 获取MD5加密大写
     */
    getUCMd5(str) {
        return MD5(`${str}${config.saltMD5}`).toUpperCase();
    },

    /**
     * 获取MD5加密小写
     */
    getLCMd5(str) {
        return MD5(`${str}${config.saltMD5}`).toLowerCase();
    },

    /**
     * 获取随机UUID 可能会重复
     */
    getRandomUUID(isLowerCase) {
        // return UUID.v4().replace(/-/g, '');
        const str = Utils.getMd5(UUID.v4());
        return isLowerCase ? str : str.toUpperCase();
    },

    /**
     * 根据时间戳生成UUID
     * @param {*} isLowerCase 是否小写
     */
    getTimeStampUUID(isLowerCase) {
        // const str = UUID.v1().replace(/-/g, '');
        const str = Utils.getMd5(UUID.v1());
        return isLowerCase ? str : str.toUpperCase();
    },

    /**
     * 获取当前时间戳秒
     */
    getTimeStamp(isSec = true) {
        const time = Date.parse(new Date());
        return isSec ? time / 1000 : time;
    },

    /**
     * 获取年月日 2019-09-25
     * @param {*} connect 连接符
     */
    getYearMonthDay(connect, zh) {
        const str = connect || '-';
        const date = new Date();
        const Y = date.getFullYear();
        const M = date.getMonth() + 1;
        const D = date.getDate();
        if (zh) {
            return `${Y} 年${M > 9 ? M : '0' + M} 月${D > 9 ? D : '0' + D} 日`;
        }
        return `${Y}${str}${M > 9 ? M : '0' + M}${str}${D > 9 ? D : '0' + D}`;
    },

    /**
     * 获取当前年月日 时分秒
     * @param {*} c1 连接符
     * @param {*} c2 连接符
     */
    getYearMonthDayAndHMI(c1, c2) {
        const str = c1 || ':';
        const date = new Date();
        const H = date.getHours();
        const M = date.getMinutes();
        const I = date.getSeconds();
        const YMD = Utils.getYearMonthDay(c2);
        return `${YMD} ${H > 9 ? H : '0' + H}${str}${M > 9 ? M : '0' + M}${str}${I > 9 ? I : 'I' + I}`;
    },

    /**
     * 截取字符串， 多余的部分用...代替
     * @param {*} str
     * @param {*} len
     */
    setString(str, len) {
        let StrLen = 0;
        let s = '';
        for (let i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 128) {
                StrLen += 2;
            } else {
                StrLen++;
            }
            s += str.charAt(i);
            if (StrLen >= len) {
                return s + '...';
            }
        }
        return s;
    },

    /**
     * 格式化设置
     * @param {*} GetOptions
     */
    optionFormat(getOptions) {
        let options = '{';
        for (let n = 0; n < getOptions.length; n++) {
            options = options + '\'' + getOptions[n].option_name + '\':\'' + getOptions[n].option_value + '\'';
            if (n < getOptions.length - 1) {
                options = options + ',';
            }
        }
        return JSON.parse(options + '}');
    },

    /**
     * 数组去重
     * @param {*} arr
     */
    hovercUnique(arr) {
        let n = {};
        let r = [];
        for (let i = 0; i < arr.length; i++) {
            if (!n[arr[i]]) {
                n[arr[i]] = true;
                r.push(arr[i]);
            }
        }
        return r;
    },

    /**
     * 获取json长度
     * @param {*} jsonData
     */
    getJsonLength(jsonData) {
        let arr = [];
        for (let item in jsonData) {
            arr.push(jsonData[item]);
        }
        return arr.length;
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
                temp = Utils.listToTree(data, parentKey, childrenKey, data[i][childrenKey]);
                if (temp.length > 0) {
                    obj.children = temp;
                }
                tree.push(obj);
            }
        }
        return tree;
    },

    /**
     * 移除对象中的无效属性
     * @param obj
     * @return {*}
     */
    removeEmpty(obj) {
        Object.keys(obj).forEach(function(key) {
            (obj[key] && typeof obj[key] === 'object') && Utils.removeEmpty(obj[key]) ||
                (obj[key] === undefined || obj[key] === null || obj[key] === '') && delete obj[key];
        });
        return obj;
    },

    /**
     * 深度拷贝
     * @param {*} obj
     */
    deepCloneObject(object) {
        return JSON.parse(JSON.stringify(object));
        // const obj = JSON.parse(JSON.stringify(object));
        // let objClone = Array.isArray(obj) ? [] : {};
        // if (obj && typeof obj === 'object') {
        //     for (let key in obj) {
        //         if (obj.hasOwnProperty(key)) {
        //             //判断ojb子元素是否为对象，如果是，递归复制
        //             if (obj[key] && typeof obj[key] === 'object') {
        //                 objClone[key] = Utils.deepCloneObject(obj[key]);
        //             } else {
        //                 //如果不是，简单复制
        //                 objClone[key] = obj[key];
        //             }
        //         }
        //     }
        // }
        // return objClone;
    },

    /**
     * 字符转小写
     */
    getLC(val) {
        if (!val) throw Error(`字符串不存在 val${val}`);
        return (val).toLowerCase();
    },

    /**
     * 字符转大写
     * @param {*} val
     */
    getUC(val) {
        if (!val) throw Error(`字符串不存在 val${val}`);
        return (val).toLocaleUpperCase();
    },

    /**
     * 生成文件名 默认全大写
     * @param {*} isLowerCase
     */
    getFileNameUUID32(nameExtension, isLowerCase) {
        return `${config.filePrefix}${Utils.getTimeStampUUID(isLowerCase)}.${nameExtension}`;
    },

    // 转为unicode 编码
    encodeUnicode(str) {
        var res = [];
        for (var i = 0; i < str.length; i++) {
            res[i] = ('00' + str.charCodeAt(i).toString(16)).slice(-4);
        }
        return '\\u' + res.join('\\u');
    },

    // 解码
    decodeUnicode(str) {
        str = str.replace(/\\/g, '%');
        //转换中文
        str = unescape(str);
        //将其他受影响的转换回原来
        str = str.replace(/%/g, '\\');
        //对网址的链接进行处理
        str = str.replace(/\\/g, '');
        return str;
    },

    /**
     * 获取文件的后缀名
     * @param {*} filename
     */
    getExtname(filename) {
        if (!filename || typeof filename != 'string') return false;
        const a = filename.split('').reverse().join('');
        const b = a.substring(0, a.search(/\./)).split('').reverse().join('');
        return b;
    },

    /**
     * 参数非空验证
     * @param {*} params  参数列表
     * @param {*} rules  校验规则列表
     * @returns Boolearn 成功true 失败 false
     */
    checkParams(params, rules) {
        const result = [];
        if ((typeof params === 'object') && (typeof rules === 'object')) {
            for (const key in rules) {
                let falg = false;
                const type = typeof params[key];
                if (rules[key] === 'array' && Array.isArray(params[key])) { //验证数组
                    falg = true;
                } else if (rules[key] === 'number' && !isNaN(Number(params[key]))) { //验证数字
                    falg = true;
                } else if ((type === rules[key]) && (params[key] !== null)) { //验证一般的
                    falg = true;
                }
                console.log(params[key], type);
                result.push(falg);
            }
        }
        console.log(result);
        return !result.includes(false);
    }
};
module.exports = Utils;
