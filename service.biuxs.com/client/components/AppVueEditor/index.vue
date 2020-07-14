<template>
    <div id="app-editor" />
</template>
<script>
import { uploadFile } from '@/http';
import Editor from 'wangeditor';
export default {
    name: 'AppVueEditor',
    model: {
        prop: 'text',
        event: 'changeEditor'
    },
    props: {
        text: {
            required: false,
            type: [String],
            default: null
        }
    },
    data() {
        return {
            editorVal: null,
            editor: null
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        async init() {
            this.editor = new Editor('#app-editor'); /* 括号里面的对应的是html里div的id */
            /* 配置菜单栏 */
            this.editor.customConfig.menu = [
                'head', // 标题
                'bold', // 粗体
                'fontSize', // 字号
                'fontName', // 字体
                'italic', // 斜体
                'underline', // 下划线
                'strikeThrough', // 删除线
                'foreColor', // 文字颜色
                'backColor', // 背景颜色
                'link', // 插入链接
                'list', // 列表
                'justify', // 对齐方式
                'quote', // 引用
                'emoticon', // 表情
                'image', // 插入图片
                'table', // 表格
                'code', // 插入代码
                'undo', // 撤销
                'redo' // 重复
            ];
            // 自定义配置颜色（字体颜色、背景色）
            this.editor.customConfig.colors = [
                '#000000',
                '#eeece0',
                '#1c487f',
                '#4d80bf',
                '#c24f4a',
                '#8baa4a',
                '#7b5ba1',
                '#46acc8',
                '#f9963b',
                '#ffffff'
            ];
            // 表情面板可以有多个 tab ，因此要配置成一个数组。数组每个元素代表一个 tab 的配置
            this.editor.customConfig.emotions = [
                {
                    // tab 的标题
                    title: '默认',
                    // type -> 'emoji' / 'image'
                    type: 'image',
                    // content -> 数组
                    content: [
                        {
                            alt: '[坏笑]',
                            src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/50/pcmoren_huaixiao_org.png'
                        },
                        {
                            alt: '[舔屏]',
                            src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/pcmoren_tian_org.png'
                        }
                    ]
                },
                {
                    // tab 的标题
                    title: 'emoji',
                    // type -> 'emoji' / 'image'
                    type: 'emoji',
                    // content -> 数组
                    content: ['😀', '😃', '😄', '😁', '😆']
                }
            ];
            this.editor.customConfig.uploadImgMaxLength = 5; /* 限制一次最多上传 5 张图片 */
            this.editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024; /* 将图片大小限制为 3M 默认为5M /
            /* 自定义图片上传（支持跨域和非跨域上传，简单操作）*/
            this.editor.customConfig.customUploadImg = async (files, insert) => {
                /* files 是 input 中选中的文件列表 */
                let fm = new FormData();
                fm.append('file', files[0]);
                fm.append('remark', '富文本图片');
                const { data } = await this.$axios[uploadFile.method](uploadFile.url, fm);
                if (data && data.path) {
                    /* insert 是编辑器自带的 获取图片 url 后，插入到编辑器的方法 上传代码返回结果之后，将图片插入到编辑器中*/
                    insert(data.path);
                }
            };
            /* html 即变化之后的内容 */
            this.editor.customConfig.onchange = (html) => {
                console.log(html);
                this.$emit('changeEditor', html);
            };
            this.editor.create(); /* 创建编辑器 */
            this.editor.txt.html(this.text);
        },

        /**
         * 清空内容
         */
        clear() {
            this.editor.txt.clear();
        },

        /**
         * 追加内容
         */
        append(html) {
            this.editor.txt.append(html);
        },

        /**
         * 追加内容
         */
        getJSON() {
            const json = this.editor.txt.getJSON();
            return json;
        }

    }
};
</script>
