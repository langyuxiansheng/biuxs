<template>
    <div class="app-reader-contaier">
        <vuescroll ref="AppBookReader" :on-infinite="infinite" :on-refresh="refresh">
            <h4 class="reader-title">
                <span class="index">第1章</span>
                <span class="title">{{ book.title }}</span>
            </h4>
            <div class="reader-content" v-html="formatContent(book.content)" />
        </vuescroll>
    </div>
</template>
<script>
import vuescroll from 'vuescroll';
export default {
    name: 'Reader',
    components: { vuescroll },
    data() {
        return {
            book: {
                'isDelete': false,
                'createdTime': 1598597286,
                'updatedTime': 1598597286,
                'articleId': '188405BB84C4370581B6BE3548123A77',
                'title': '灵武宗',
                'content': '大船停了下来，只见周围云雾缭绕。众人纷纷走下船来，心里想着一定要留在这里。    现在开始第二次测试。由你们的师姐轻语带你们去，之间一个可爱的小女孩出现在了众人面前。    “肖逸辰出列，”肖逸辰刚站出来，沐清玉提起肖逸辰就飞了起来。    “肖逸辰，待会见了掌门要礼貌些，不该问的别问。他叫你做什么就做什么。至于他收不收你就看你自己的造化了。”    “是，沐长老。”肖逸辰答道。    过了一会眼前映入一个浮起来的宫殿。极其壮阔。“这里叫云宫，是掌门居住的地方。你现在跟我进去。沐清玉说到。跟紧点别乱碰别乱摸。”    宫殿里到处排放着悬浮的玉简。到了一个书架旁边，沐清玉突然喊道:“阎老头子，我来找你了快开门。给你找了个徒弟。”突然书架打开露出了里面的密室。    密室里面一个中年模样的人静坐着。    “沐老头，我不是说了我不收徒的吗？别来烦我。你仔细看看这个徒弟，他不一样。”说着沐清玉拿出了一块测试水晶，给肖逸辰输了一团灵气便让肖逸辰去碰，肖逸辰一碰水晶立马爆开。    阎龙武猛的惊起问道:“小子你叫什么名字？”    “我叫肖逸辰。”    “好了肖逸辰，现在你是我徒弟了。肖逸辰张大了嘴巴，就怎么容易？不让我考核考核？”    “考核是肯定有的，不然你认为谁都可以做掌门弟子吗？你站过来。”肖逸辰站了过去，随即便晕倒了。    “阎老头子你这是干嘛，”沐青玉吼到。    “沐老头，这么多年你还是那么急躁。我是看看他的心性，修炼天赋再好，心不好的话那我们何必培养。”    “好吧，那就只有看他的造化了。”    肖逸辰晕倒后，发现自己到了自己的家。正躺在自己床上。自己的父母正喊自己去吃饭。这一切都好诡异，我刚刚不是在灵武宗拜见掌门吗？难道我不合格被踢出来了？看来只有等两年后的太虚宗招人了。唉，肖逸辰微微叹气。    肖逸辰正和父母吃饭，村里突然来了一帮强盗，辰儿快跑。肖逸辰父亲吼道。看着一个个村民死在面前，看着一个个熟悉的面孔倒在自己面前。    肖逸辰不知道哪里来的勇气，冲了出去。正当刀要砍到自己的时候，自己从地板上醒来。    “恭喜你通过考核。从此你就是我阎龙武的弟子。从此你就住在我着云宫里吧！这是基础的凝气决，加油修炼吧小伙子。”    肖逸辰想高兴却高兴不起来，因为后背的衣服已经被汗水打湿了。    “傻小子还不谢谢掌门，”沐清玉说道。    “哦哦多谢掌门。”    “沐老头你给他大致说一下现在的修真界吧。”    “现在的灵气世界，有很多的界面。各种界面的修真境界可能划分有所不同，有些世界的金丹期还没有筑基期强。有细分的也有大致分的。我们灵武界作为中级界面之一，现在的局势是灵武宗，太虚宗和定仙宗三大宗门三足鼎力。我们虽然只是中级界面却和顶级界面的修真方法相同，因为我们这个界面曾经也是最强的界面之一。修真的境界划分为练气期，筑基期，结丹期，元婴期，化神期，炼虚期，合体期，大乘期，渡劫期，伪仙期，散仙期，真仙期，玄仙期，人仙期，地仙期，天仙期，金仙期，太乙期，大罗期，道祖期。灵武宗掌门你已经知道了就是你的师傅，阎龙武。目前修为是炼虚中期。太虚宗的掌门徐玄倾目前也是炼虚中期。而定仙宗的掌门刘星只有炼虚初期。宗门的规矩就刻在入宗门口的石壁上。各个书院里面也有，自己去了解下吧！”    lgqishijiezhidengxian    。全本书-免费全本小说阅读网 www.quanben.net',
                'letterCount': 1425,
                'status': 1,
                'bookId': '4926E62C6C00B482250502C09FC14099',
                'remark': '初次抓取，灵武宗-https://www.quanben.net/292/292032/42098781.html'
            }
        };
    },
    methods: {
        infinite(done) { //上拉加载
            if (this.noData) {
                setTimeout(() => {
                    this.$refs.AppBookReader.finishInfinite(2);
                });
                return;
            }
            let self = this;
            let i = 1;
            let start = this.list.length;
            setTimeout(() => {
                for (var k = 0; k < 9; k++) {
                    self.list.push(k);
                }
                i++;
                if (start / i < 9) {
                    self.noData = '没有更多数据';
                }
                self.$refs.my_scroller.resize();
                done();
            }, 1500);
        },
        refresh: function() { //下拉刷新
            console.log('refresh');
            this.timeout = setTimeout(() => {
                this.$refs.my_scroller.finishPullToRefresh();
            }, 1500);
        },

        /**
         * 格式化内容显示
         * @param text 小说内容
         * @returns text 格式后的内容
         */
        formatContent(text) {
            if (text) {
                const arr = text.split(' ');
                const reg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+.?/g;
                const showTxt = Array.from(new Set(arr)).map((txt) => {
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
    // background: #d3c5a8;
    background-image: url('~@/assets/images/reader/skin-default-m-35905b0ba7.jpg');
    background-size: contain;
    background-repeat: repeat-y;
    height: 100vh;
    .reader-title{
        font-size: 1.25rem;
        padding: 1rem;
    }
    .reader-content{
        padding: 0 1.25rem;
        padding-bottom: 2.5rem;
        line-height: 1.8;
        font-size: 1rem;
        text-indent: 1.95rem;
    }
}
</style>
