const http = require('superagent');
const userAgents = require(':lib/userAgents');
const { getRandomNum } = require(':lib/Utils');
const { logger } = require(':lib/logger4'); //日志系统
let i = 1;
const testReg = async (num) => {
    try {
        const url = `http://47.92.39.166:3000/login/register`;
        const headers = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Cache-Control': 'max-age=0',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': userAgents
        };
        const user = Math.random().toString(36).substr(2);
        const rand = getRandomNum(10000000, 999999999);
        const send = { user, 'password': user + '记得验证', 'qq': rand + '@qq.com' };
        // console.log(send, `第${i}次注册,第${num}次进程`);
        const res = await http.post(url).send(send).set(headers).timeout(1000 * 10).charset('utf-8').buffer(true);
        if (res.status == 200) {
            logger.info(`第${num}次进程,第${i}次注册,注册信息:${JSON.stringify(send)},注册结果:${res.text}`);
            i++;
            testReg(num);
        }
    } catch (error) {
        console.error(error);
        testReg(num);
    }
};

module.exports = testReg;
