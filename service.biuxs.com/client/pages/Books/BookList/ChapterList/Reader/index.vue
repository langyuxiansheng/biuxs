<template>
    <el-button type="text" @click="init()">
        <slot>预览</slot>
        <DialogContainer v-if="dialogConf.isShow" :dialog-conf="dialogConf">
            <div v-if="book" class="reader-container">
                <h4 class="reader-title">
                    <span class="index">第{{ chapter.index }}章</span>
                    <span class="title">{{ chapter.title }}</span>
                </h4>
                <div class="reader-content" v-html="formatContent(book.content)" />
            </div>
        </DialogContainer>
    </el-button>
</template>
<script type="text/ecmascript-6">
import { getBookArticleByAdmin } from '@/http';
export default {
    name: 'Reader',
    props: {
        chapter: {
            required: true,
            type: [Object]
        }
    },
    data () {
        const { dialogFormWidth } = this.$store.state.config;
        return {
            dialogConf: {
                width: dialogFormWidth,
                closeOnClickModal: true,
                isShow: false,
                center: true,
                title: null
            },
            book: null
        };
    },
    methods: {

        /**
		 * 初始化
		 */
        async init () {
            this.dialogConf.isShow = true;
            this.dialogConf.title = `第${this.chapter.index}章`;
            this.getContent(this.chapter);
        },

        /**
         * 获取章节内容
         */
        async getContent({ chapterId }) {
            try {
                const { data } = await this.$axios[getBookArticleByAdmin.method](`${getBookArticleByAdmin.url}/${chapterId}`);
                console.log(data);
                this.book = data;
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * 格式化内容显示
         * @param text 小说内容
         * @returns text 格式后的内容
         */
        formatContent(text) {
            if (text) {
                // eslint-disable-next-line no-irregular-whitespace
                const arr = text.split(new RegExp(`　|' '`));
                const reg = /|[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+.?/g;
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
.reader-container{
    background: #eadcc5;
    .reader-title{
        font-size: 1.25rem;
        padding: 1rem;
        text-align: center;
    }
    .reader-content{
        padding: 0 .875rem;
        padding-bottom: 2.5rem;
        line-height: 2;
        font-size: 1rem;
        text-indent: 1.95rem;
        white-space: normal;
    }
}
</style>
