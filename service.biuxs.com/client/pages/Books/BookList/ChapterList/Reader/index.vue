<template>
    <el-button type="text" @click="init()">
        <slot />
        <dialog-container v-if="dialogConf.isShow" :dialog-conf="dialogConf">
            {{ 内容 }}
        </dialog-container>
    </el-button>
</template>
<script type="text/ecmascript-6">
import { getBookArticleByAdmin } from '@/http';
export default {
    name: 'Reader',
    props: {
        title: {
            required: true,
            type: String
        },
        chapterId: {
            required: true,
            type: String
        }
    },
    data () {
        const { dialogFormWidth } = this.$store.state.config;
        return {
            dialogConf: {
                width: dialogFormWidth,
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
            this.dialogConf.title = this.title;
            this.getContent(this.chapterId);
        },

        /**
         * 获取章节内容
         */
        async getContent(chapterId) {
            try {
                const { data } = await this.$axios[getBookArticleByAdmin.method](`${getBookArticleByAdmin.url}/${chapterId}`);
                console.log(data);
            } catch (error) {
                console.error(error);
            }
        }
    }
};
</script>
