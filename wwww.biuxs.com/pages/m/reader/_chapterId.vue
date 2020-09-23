<template>
    <div class="app-reader-contaier">
        <vuescroll ref="AppBookReader" :ops="ops" @load-start="handleLoadStart" @load-before-deactivate="handleLoadBeforeDeactivate">
            <div class="scroll-content">
                <h4 class="reader-title">
                    <span class="index">第1章</span>
                    <span class="title">{{ book.title }}</span>
                </h4>
                <div class="reader-content" v-html="formatContent(book.content)" />
            </div>
        </vuescroll>
    </div>
</template>
<script>
import vuescroll from 'vuescroll';
import { getBookChapterArticleData } from '@/http';
export default {
    name: 'Reader',
    components: { vuescroll },
    data() {
        const { chapterId } = this.$route.params;
        return {
            ops: {
                rail: {
                    size: '.15rem'
                },
                bar: {
                    hoverStyle: true,
                    onlyShowBarOnScroll: false, //是否只有滚动的时候才显示滚动条
                    background: 'rgba(0,0,0,.15)' //颜色
                },
                vuescroll: {
                    mode: 'slide',
                    pullRefresh: {
                        enable: true
                    },
                    pushLoad: {
                        enable: true,
                        tips: {
                            start: '加载中...',
                            beforeDeactive: '加载成功!'
                        },
                        auto: !false,
                        autoLoadDistance: 40
                    }
                }
            },
            book: {
                'isDelete': false,
                'createdTime': 1600309423,
                'updatedTime': 1600309423,
                'articleId': '5D284DC54C6514A521DA5E7102C338D5',
                'title': '楔子 源起',
                'content': '大地世间的生灵万物均分为魔界，仙界与凡界三界。　　相传，隶属于魔界的九尾狐族。世代隐匿于人间与魔界交接的某个结界的深山密林之中，人称人迹罕至的封印之地——青丘。在那儿亦幻亦真，四季如梦似幻。乃是世外桃源。幻美的景色皆可与仙界之仙庭相媲美。九尾狐的族人们世世代代生活在这月光盈满之福地，终日倚靠吸取照拂下的月光灵气历练自身的法力修为。以狐族为守护者的三大长老则用强大法术封印着青丘之地与外界隔绝，以防各个魔界异族司机侵扰入内。　　九尾狐无论男女皆个个容貌绝伦。且可千年长久保持未老的盛世容颜。而最为特殊的则是他们血液能够使凡人起死回生，异族人短时间内伤重自愈的绝妙灵药！　　狐族里修为法术最高当属九尾天狐——九夜圣尊。他引领着族人修炼至今已有万年之久。而守护在他身边的，分别是三位狐族法术同样高强的长老：九尾美狐白仙儿，九尾玄狐白鹤童与白玄灵姐弟俩。他们三人是九尾狐一族之中法力仅次圣尊九夜之下，最为强大的三位狐仙尊者。其中，白仙儿更曾获仙家圣秘道宗的传授，拥有可预知未来发生之事的神秘力量。　　与此同时，凝聚了九尾狐至尊九夜魂元的内丹——九尾灵珠。则更有着长生不老与增进修炼灵力的功效。万年来，九尾灵珠由三位长老们庇护。共同为九尾狐族人便于在月圆之夜修炼法术之用。　　但凡拥有了九夜的内丹——九尾灵珠，便但同于拥有了九夜圣尊的魂元与法力修为。则等同于控制了整个青丘与狐族。　　魔界鬼族之王冥魂则一直觊觎九尾灵珠许久。并意欲铲除九尾狐族并获取九尾灵珠的永生与法力。继而冥魂在策划了一场蓄谋已久的阴谋之后爆发了一场与狐族之间的异族大战。　　此场战役延续了三百年日以继日的争战之后，两方族人死伤无数。在这场战役中，九夜与冥魂皆两败俱伤，形魂不保。为了避免狐族面临更大的灭族危难，大长老白仙儿动用了九尾灵珠中蕴含的九夜强大魂元法力，击退大肆鬼族侵入。重新将青丘入口重新封印隐蔽起来。为了不再波及青丘，她冒险携带九尾灵珠藏匿于凡界人间。至此，九尾灵珠的下落便在凡间销声匿迹——　　在沉寂了数百年之余。万物复苏，阴谋继续暗涌。鬼族的黑暗之幽冥鬼爪又欲将杀戮转投于人间——',
                'letterCount': 879,
                'status': 1,
                'bookId': 'F5AAD129D269D7153283C5D821F5370B',
                'remark': '初次抓取楔子 源起-https://www.biqugexx.com/131_131248/43278252.html'
            },
            params: {
                chapterId
            }
        };
    },

    async asyncData({ req, $axios, params }) {
        try {
            const { data } = await $axios[getBookChapterArticleData.method](getBookChapterArticleData.url, { params });
            return { book: data || {} };
        } catch (error) {
            console.error(error);
        }
    },
    created() {
        this.init();
    },

    methods: {
        async init() {
            try {
                const { data } = await this.$axios[getBookChapterArticleData.method](getBookChapterArticleData.url, {
                    params: this.params
                });
                console.log(data);
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * 上拉加载开始
         */
        handleLoadStart(vm, refreshDom, done) {
            console.log(`上拉加载`);
            setTimeout(() => {
                done();
            }, 1000);
        },

        /**
         * 上拉加载完成前
         */
        handleLoadBeforeDeactivate(vm, refreshDom, done) {
            console.log(`上拉加载完成`);
            setTimeout(() => {
                done();
            }, 1000);
        },

        /**
         * 格式化内容显示
         * @param text 小说内容
         * @returns text 格式后的内容
         */
        formatContent(text) {
            if (text) {
                const arr = text.split(new RegExp(`\\s`, 'g'));
                const reg = /|[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+.?/g;
                const showTxt = Array.from(new Set(arr)).filter(item => item).map((txt) => {
                    return `<p>${txt.replace(reg, '')}</p>`;
                }).join('');
                return showTxt;
            }
            return text;
        }
    }
};
</script>
<style lang="less" scoped>
.app-reader-contaier{
    background: #eadcc5;
    // background-image: url('~@/assets/images/reader/skin-default-m-35905b0ba7.jpg');
    // background-size: contain;
    // background-repeat: repeat-y;
    height: 100vh;
    .reader-title{
        font-size: 1.25rem;
        padding: 1rem;
    }
    .reader-content{
        padding: 0 .875rem;
        padding-bottom: 2.5rem;
        line-height: 2;
        font-size: 1rem;
        text-indent: 1.95rem;
    }
}
</style>
