/**
 * 网站基础信息爬虫
 */
const http = require('superagent');
require('superagent-proxy')(http);
require('superagent-charset')(http);
const cheerio = require('cheerio');
// const schedule = require('node-schedule');
const userAgents = require(':lib/userAgents');
module.exports = class Hao123 {
    constructor(url) {
        this.baseURL = url;
    }
    /**
     * 运行服务
     */
    async start() {
        try {
            console.info(`============================================抓取开始================================================`);
            const headers = {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Cache-Control': 'max-age=0',
                'Connection': 'keep-alive',
                'User-Agent': userAgents
            };
            let httpCharset = null;
            try {
                const res = await http.head(`${this.baseURL}`).set(headers).timeout(1000 * 10).buffer(true);
                httpCharset = res && res.charset || 'utf-8';
            } catch (error) {
                console.log(`获取网站${this.baseURL},编码出错:`, error);
            }
            const response = await http.get(`${this.baseURL}`)
                .set(headers) //设置请求头
                .timeout(1000 * 10)
                .charset(httpCharset)
                .buffer(true);
            const { status, text } = response;
            if (status == 200) {
                console.log(`网站编码:`, httpCharset);
                const $ = cheerio.load(text, { decodeEntities: false });
                const title = $('head').find('title').text(); //获取网站标题
                const keywords = $('meta[name="keywords"]').attr('content'); //获取网站关键字
                const desc = $('meta[name="description"]').attr('content');//获取简介
                console.log(`网站标题:`, title);
                console.log(`网站关键字:`, keywords);
                console.log(`网站简介:`, desc);
                let result = { title, keywords, desc };
                try {
                    const logo = await http.head(`${this.baseURL}/favicon.ico`).set(headers).timeout(1000 * 10).buffer(true);
                    if (/image/.test(logo.type)) {
                        result.logo = `${this.baseURL}favicon.ico`;
                    }
                } catch (error) {
                    console.log(`抓取网站${this.baseURL}favicon.ico logo出错:`, error);
                }
                console.info(`=============================================抓取结束=================================================`);
                return result;
            }
            return null;
        } catch (error) {
            console.log(`error`, error);
            console.log(`${this.baseURL} 抓取错误! 正在重试!`);
            return new Error(error);
        }
    }
};
