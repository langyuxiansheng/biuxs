/**
 * hao123采集爬虫
 */
const http = require('superagent');
require('superagent-proxy')(http);
require('superagent-charset')(http);
const cheerio = require('cheerio');
// const schedule = require('node-schedule');
const userAgents = require(':lib/userAgents');
// const { BiuDB } = require(':lib/sequelize');
// const IncludeLinksModel = BiuDB.import(`../models/website/IncludeLinksModel`);
module.exports = class Hao123 {
    constructor(pathname, typeId) {
        this.baseURL = `http://www.hao123.com`;
        this.pathname = pathname;
        this.typeId = typeId;
    }
    /**
     * 运行服务
     */
    async start() {
        try {
            const headers = {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Cache-Control': 'max-age=0',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Host': 'www.hao123.com',
                'User-Agent': userAgents,
                'Cookie': 'BAIDUID=4AA5A67E620134A2C3438FBA8497D1FC:FG=1; Hm_lvt_0703cfc0023d60b244e06b5cacfef877=1573198494; hz=0'
            };
            const response = await http.get(`${this.baseURL}/${this.pathname}`)
                .set(headers) //设置请求头
                // .proxy(proxyIP) //设置代理进行爬取
                .timeout(1000 * 10)
                .charset('utf-8')
                .buffer(true);
            const { status, text } = response;
            if (status == 200) {
                console.info(`============================================BEGIN================================================`);
                const $ = cheerio.load(text, { decodeEntities: false });
                const list = [];
                let chinese = /[\u4e00-\u9fa5]/g;
                $('#bd').find('.mod-content').each((i, div) => {
                    const type = $(div).find('.content-title').text().match(chinese).join(''); //只提取汉字
                    $(div).find('.content-link li').each((i, li) => {
                        const url = $(li).find('h3 a').attr('href');
                        const src = $(li).find('h3 a img').attr('src');
                        const title = $(li).find('h3 a').text();
                        if (url && title) {
                            const save = { url, title, logo: src || null, typeId: this.typeId || '079C476C999A9EC26FDA2DB452E18260', remark: `爬虫自动抓取,链接分类:${type || '-'}` };
                            list.push(save);
                        }
                    });
                });
                console.log(`抓取结束`);
                if (list.length) {
                    this.saveData(list);
                }
                console.info(`=============================================END=================================================`);
            }
        } catch (error) {
            console.log(`error`, error);
            console.log(`${this.baseURL}/${this.pathname} 抓取错误! 正在重试!`);
            return error;
        }
    }

    /**
     * 保存数据
     * @param {*} list
     */
    async saveData(list) {
        try {
            //查询否存在
            // const datas = await IncludeLinksModel.findAll({
            //     where: { isDelete: false }
            // });
            // if (datas && datas.length) { //查询数据库已有的数据
            //     for (let i in datas) {
            //         for (let j in list) {
            //             if (datas[i].url === list[j].url) { //检测是否重复
            //                 console.log(`title:${datas[i].title},URL:${datas[i].url} 已存在`);
            //                 list.splice(j, 1); //删除数组中的重复数据
            //             }
            //         }
            //     }
            // }
            // IPBaseModel.destroy({ where: { isDelete: true } }); //删除无效的IP
            if (list && list.length) {
                // await IncludeLinksModel.bulkCreate(list); //创建或者更新
                console.log(`本次保存链接: ${list.length} 条`);
            }
            return true;
        } catch (error) {
            console.log(`ip 数据保存出错`, error);
            return false;
        }
    }
};
