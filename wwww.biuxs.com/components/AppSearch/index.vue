<template>
    <div class="app-search">
        <div class="app-search-content">
            <div class="app-search-logo">
                <img class="icon" :src="require('@/assets/images/logo/baidu.png')" alt="icon">
            </div>
            <div class="app-input">
                <input v-model="keyword" class="input" type="text" placeholder="请输入您要搜索的关键字" @keyup="inputKeyword($event)" @blur="handleInputBlur()" @focus="inputKeyword()">
                <span class="input-search-btn" @click="goSearch()">
                    搜索
                </span>
                <ul v-if="suggestion.length && keyword" class="app-suggestion">
                    <template v-for="(kd,key) in suggestion">
                        <li :key="key" class="keyword" :class="{'active':keywordIndex == key}" @click="handleSug(kd)">
                            {{ kd }}
                        </li>
                    </template>
                </ul>
            </div>
            <div class="app-hot-tags">
                <ul v-if="hotKeywords && hotKeywords.length" class="hot-tags">
                    <template v-for="(item,index) in hotKeywords">
                        <li :key="index" :title="`快速搜索:${item.text}`" class="hot-tag" :style="{backgroundColor: item.color}" @click="handleSug(item.text)">
                            {{ item.text }}
                        </li>
                    </template>
                </ul>
                <p v-else class="hot-loding">
                    加载中...
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import { getHotSearchKeywords } from '@/http';
import util from '@/lib/util';
export default {
    name: 'AppSearch',
    data() {
        return {
            keyword: null, //搜索关键字
            showsug: false, //是否显示联想词
            suggestion: [], //联想词列表
            hotKeywords: [],
            cacheHotKeywords: [], //缓存标签
            keywordIndex: null, //关键词搜索列表索引
            timer: null
        };
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    mounted() {
        this.init();
    },
    methods: {
        async init() {
            try {
                const { data: { list } } = await this.$axios[getHotSearchKeywords.method](getHotSearchKeywords.url);
                this.cacheHotKeywords = list;
                this.getRandomTags();
                setInterval(() => {
                    this.getRandomTags();
                }, 1000 * 30);
            } catch (error) {
                console.error(`获取微博热搜词出错:`, error);
            }
        },

        /**
         * 随机获取标签
         */
        getRandomTags() {
            const hotKeys = util.getRandomElements(this.cacheHotKeywords || [], 4);
            this.hotKeywords = hotKeys.map((item) => {
                item.color = util.getRandomColor();
                return item;
            });
        },

        /*
		 * demo 父容器(ul)的id
		 * -36px 子元素li的高度
		 * 3000  滚动间隔时间
		 * 每次滚动持续时间可到css文件中修改
		 */
        upScroll(domc, _h, interval) {
            const dom = document.getElementById(domc);
            this.timer = setInterval(() => {
                const field = dom.firstElementChild;
                field.style.marginTop = '5px';
                dom.appendChild(field);
                dom.firstElementChild.style.marginTop = _h;
            }, interval);
        },

        /**
         * 关键词列表点击回调
         */
        handleSug(kd) {
            this.keyword = kd;
            this.goSearch();
            console.log(this.keyword);
        },

        /**
         * 处理blur事件
         */
        handleInputBlur() {
            setTimeout(() => {
                this.suggestion = [];
                this.initKeydownEvent(0);
            }, 100);
        },

        /**
         * 回车搜索和点击搜索
         */
        goSearch() {
            window.open(`https://www.baidu.com/s?wd=${this.keyword || ''}`, '_blank'); //注意第二个参数
            this.suggestion = [];
        },

        /**
         * 关键词搜索
         */
        async inputKeyword(e) {
            if (e && [13, 38, 40].includes(e.keyCode)) return false;
            const keyword = this.keyword;
            if (!keyword) return false;
            const httpURL = `https://suggestion.baidu.com/su?wd=${keyword}&json=1`;
            try {
                const { s } = await this.$jsonp(httpURL, { callbackQuery: 'cb', callbackName: 'sug' });
                if (s && s.length) {
                    this.suggestion = s || [];
                    this.initKeydownEvent(1);
                }
            } catch (error) {
                console.error(`关键词搜索出错:`, error);
            }
        },

        /**
         * 注册键盘事件
         * @param type 1注册 0销毁
         */
        initKeydownEvent(type) {
            if (type) {
                const sugs = this.suggestion;
                if (!sugs.length) return false;
                this.keywordIndex = 0;
                document.onkeydown = (event) => {
                    const e = event || window.event;
                    if (e && e.keyCode == 38) { //ArrowUp 键 向上
                        if (this.keywordIndex > 0) {
                            --this.keywordIndex;
                        } else {
                            this.keywordIndex = sugs.length - 1;
                        }
                        this.keyword = sugs[this.keywordIndex];
                        return false;
                    }

                    if (e && e.keyCode == 40) { // ArrowDown 键向下
                        if (this.keywordIndex >= 0 && this.keywordIndex < sugs.length - 1) {
                            this.keywordIndex++;
                        } else {
                            this.keywordIndex = 0;
                        }
                        this.keyword = sugs[this.keywordIndex];
                        return false;
                    }

                    if (e && e.keyCode == 13) { // enter 键
                        this.goSearch();
                        return false;
                    }
                };
            } else {
                document.onkeydown = null;
            }
        }
    }
};
</script>
<style lang="less" scoped>
@import url('~@/assets/styles/common/constant');
.app-search{
    .app-search-content{
        .app-content();
        margin: 28px auto;
        .app-search-logo{
            width: 180px;
            margin: 0 auto;
            .icon{
                max-width: 100%;
            }
        }
        .app-input{
            margin: 20px auto;
            width: 800px;
            display: flex;
            align-items: center;
            background: rgba(255, 255, 255, .95);
            border-radius: 6px;
            padding: 14px 18px;
            // box-shadow: 0 0 4px 0 #d0d0d0;
            position: relative;
            .input{
                flex: 1;
                outline: none;
                border: none;
                background: none;
                font-size: 16px;
            }
            .input-search-btn{
                text-align: center;
                font-size: 16px;
                padding: 0 16px;
                cursor: pointer;
                color: @app-theme-color;
                transition: all .2s ease-in;
                &:hover{
                    color: #f00;
                }
            }
            .app-suggestion{
                width: 100%;
                position: absolute;
                left: 0;
                top: 50px;
                background: rgba(255, 255, 255, .85);
                border-top: 0;
                margin: 0;
                font-size: 16px;
                z-index: 99;
                border-radius: 6px;
                overflow: hidden;
                .keyword{
                    cursor: pointer;
                    padding: 6px 14px;
                    .ellipsis-single();
                    &:hover{
                        color: #fff;
                        background: @app-theme-color;
                    }
                }
                .active{
                    color: #fff;
                    background: @app-theme-color;
                }
            }
        }
        .app-hot-tags{
            margin: 20px auto;
            display: flex;
            justify-content: center;
            .hot-tags{
                margin: 0 auto;
                .hot-tag{
                    display: inline-block;
                    padding: 6px 10px;
                    color: #fff;
                    border-radius: 4px;
                    cursor: pointer;
                    opacity: .8;
                    transition: .2s ease-in;
                    font-size: 12px;
                    &:hover{
                        opacity: 1;
                    }
                    & + .hot-tag{
                        margin-left: 10px;
                    }
                }
            }
            .hot-loding{
                color: #fff;
                text-align: center;
            }
            .tag-toggle{
                margin-left: 20px;
                cursor: pointer;
                transition: .2s ease-in;
                &:hover{
                    color: @app-hover-color;
                }
            }
        }
        .app-search-hot{
            font-size: 12px;
            color: #929494;
            margin-left: 20px;
            width: 200px;
            height: 90px;
            overflow: hidden;
            right: 0;
            top: 20px;
            .hots{
                p:first-child {
                    margin-top: 0;
                    transition: margin-top .8s;
                }
            }
            .s-keyword{
                .iconfont{
                    font-size: 12px;
                }
                span{
                    width: calc(100% - 16px);
                    cursor: pointer;
                    .ellipsis-single();
                    transition: color .2s ease-in;
                    &:hover{
                        color: @app-hover-color;
                    }
                }
                & + .s-keyword{
                    margin-top: 5px;
                }
            }
        }
    }
}
</style>
