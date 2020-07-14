/**
 * http://www.quwanli.com 采集爬虫
 */
const http = require('superagent');
require('superagent-proxy')(http);
require('superagent-charset')(http);
const cheerio = require('cheerio');
const userAgents = require(':lib/userAgents');
// const { BiuDB } = require(':lib/sequelize');
// const IncludeLinksModel = BiuDB.import(`../models/website/IncludeLinksModel`);
// const WebsiteTypesModel = BiuDB.import(`../models/website/WebsiteTypesModel`);
module.exports = class QuWanLi {
    constructor() {
        this.baseURL = `http://www.quwanli.com`;
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
                'Host': 'www.quwanli.com',
                'User-Agent': userAgents
            };
            const response = await http.get(`${this.baseURL}`)
                .set(headers) //设置请求头
                .timeout(1000 * 10)
                .charset('utf-8')
                .buffer(true);
            const { status, text } = response;
            if (status == 200) {
                console.info(`============================================BEGIN================================================`);
                console.info(`正在抓取:${this.baseURL}`);
                const $ = cheerio.load(text, { decodeEntities: false });
                const list = [];
                console.log($);
                // let chinese = /[\u4e00-\u9fa5]/g;
                // let types = [];
                // $('.content .container .content-sidebar #dl').find('dd').each((i, dd) => {
                //     const type = $(dd).find('li a span').text().match(chinese).join(''); //只提取汉字
                //     types.push({
                //         name: type, //角色名
                //         sort: 99 + i, //排序
                //         status: 1, //排序
                //         remark: `爬虫自动抓取:${this.baseURL}的分类`
                //     });
                // });

                // if (types.length) {
                //     console.log(JSON.stringify(types));
                //     await WebsiteTypesModel.bulkCreate(types);
                //     return false;
                // }
                // const types = await WebsiteTypesModel.findAll({ where: { isDelete: false } });
                // $('.content .container .col-md-11').find('.part').each((i, nav) => {
                //     const type = $(nav).find('h2 strong').text().match(chinese).join(''); //只提取汉字
                //     $(nav).find('.items .row .col-xs-6').each((i, item) => {
                //         const url = $(item).find('.item a').attr('href');
                //         const src = $(item).find('.item a img').attr('src');
                //         const title = $(item).find('.item a h3').text();
                //         if (url && title) {
                //             for (const key in types) {
                //                 if (types[key].name == type) {
                //                     const save = { url, title, logo: src ? `${this.baseURL}${src}` : null, typeId: types[key].typeId || '079C476C999A9EC26FDA2DB452E18260', remark: `爬虫自动抓取${this.baseURL},链接分类:${type || '-'}` };
                //                     list.push(save);
                //                     break;
                //                 }
                //             }
                //         }
                //     });
                // });
                console.log(`抓取结束`);
                if (list.length) {
                    console.log(list);
                    this.saveData(list);
                }
                console.info(`=============================================END=================================================`);
            }
        } catch (error) {
            console.log(`error`, error);
            console.log(`${this.baseURL} 抓取错误! 正在重试!`);
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

    async blacklist() {

    }
};
