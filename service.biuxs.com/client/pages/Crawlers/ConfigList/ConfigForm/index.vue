<template>
    <dialog-container :dialog-conf="dialogConf">
        <el-row class="app-form" :gutter="$store.state.config.dialogFormGutterWidth">
            <el-form ref="AppForm" :model="sendData" :label-position="$store.state.config.labelPosition" :rules="rules" label-width="125px" @submit.native.prevent>
                <el-col :span="12">
                    <el-form-item label="配置项名" prop="name">
                        <el-input v-model="sendData.name" placeholder="请输入配置项名" />
                    </el-form-item>
                    <el-form-item label="配置项类型">
                        <el-select v-model="sendData.status" class="select-block" placeholder="请选择配置项类型" @change="handleStatusChange">
                            <el-option label="书籍爬虫配置" :value="1" />
                            <el-option label="IP代理爬虫配置" :value="2" />
                            <el-option label="用户阅读器配置" :value="3" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="状态">
                        <el-select v-model="sendData.status" class="select-block" placeholder="请选择状态">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="sendData.remark" placeholder="请输入备注" />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-divider>配置项内容设置</el-divider>
                </el-col>
                <el-col v-if="sendData.status == 1" :span="24">
                    <el-form-item label="状态">
                        <el-select v-model="sendData.status" class="select-block" placeholder="请选择状态">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="sendData.remark" placeholder="请输入备注" />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <div class="app-submit-btns">
                        <el-form-item class="app-text-center">
                            <el-button type="primary" @click="submitForm('AppForm')">
                                保存
                            </el-button>
                            <el-button @click="resetForm('AppForm')">
                                重置
                            </el-button>
                        </el-form-item>
                    </div>
                </el-col>
            </el-form>
        </el-row>
    </dialog-container>
</template>
<script type="text/ecmascript-6">
import util from '@/lib/util';
// import { addSearchType, updateSearchType } from '@/http';
export default {
    name: 'ConfigForm',
    data () {
        const { dialogFormWidth } = this.$store.state.config;
        return {
            dialogConf: {
                width: dialogFormWidth,
                isShow: false,
                center: true,
                title: null
            },
            sendData: {},
            initData: {
                name: null, //配置项名
                code: null, //标识符
                type: 1, //类型
                conf: {
                    'base': {
                        'title': '全本小说网',
                        'protocol': 'https://',
                        'host': 'www.quanben.net',
                        'charset': 'utf-8',
                        'timeout': 10000,
                        'listSelector': '#content .item-con',
                        'itemSelector': 'li',
                        'name': '.s2 > a:nth-child(1)',
                        'href': '.s2 > a:nth-child(1)'
                    },
                    'types': [
                        {
                            'title': '玄幻小说',
                            'params': '/list/1_[page].html',
                            'page': 1
                        },
                        {
                            'title': '修真小说',
                            'params': '/list/2_[page].html',
                            'page': 1
                        },
                        {
                            'title': '言情小说',
                            'params': '/list/2_[page].html',
                            'page': 1
                        }
                    ],
                    'info': {
                        'titleSelector': '#container .bookinfo .btitle h1',
                        'authorSelector': '#container .bookinfo .btitle em a',
                        'briefSelector': '#container .bookinfo .intro',
                        'letterCountSelector': null,
                        'chapterCountSelector': null,
                        'imageSelector': null,
                        'chapterListSelector': '#main .chapterlist',
                        'itemSelector': 'dd+dt~dd',
                        'chapterNameSelector': 'a',
                        'contentUrlSelector': 'a',
                        'contentSelector': '#BookText'
                    } //配置项内容
                },
                status: 1, //排序
                remark: null
            },
            rules: {
                name: [
                    { required: true, message: '请输入配置项名', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入标识符', trigger: 'blur' },
                    { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '选择类型', trigger: 'change' }
                ]
            },
            type: 'add',
            options: [
                {
                    value: 1,
                    label: '正常'
                },
                {
                    value: 3,
                    label: '审核中'
                },
                {
                    value: 4,
                    label: '禁用'
                }
            ]
        };
    },
    methods: {

        /**
		 * 初始化
		 */
        async init ({ type, title, data }) {
            this.dialogConf.isShow = true;
            this.type = type;
            if (title) this.dialogConf.title = title;
            if (type === 'add') {
                this.sendData = util.deepCloneObject(this.initData);
            } else if (type === 'update') {
                this.sendData = util.deepCloneObject(data);
            }
        },

        /**
         * 类型选择
         */
        handleStatusChange(type) {
            if (type == 1) {
                this.sendData.conf = {
                    'base': {
                        'title': '全本小说网',
                        'protocol': 'https://',
                        'host': 'www.quanben.net',
                        'charset': 'utf-8',
                        'timeout': 10000,
                        'listSelector': '#content .item-con',
                        'itemSelector': 'li',
                        'name': '.s2 > a:nth-child(1)',
                        'href': '.s2 > a:nth-child(1)'
                    },
                    'types': [
                        {
                            'title': '玄幻小说',
                            'params': '/list/1_[page].html',
                            'page': 1
                        },
                        {
                            'title': '修真小说',
                            'params': '/list/2_[page].html',
                            'page': 1
                        },
                        {
                            'title': '言情小说',
                            'params': '/list/2_[page].html',
                            'page': 1
                        }
                    ],
                    'info': {
                        'titleSelector': '#container .bookinfo .btitle h1',
                        'authorSelector': '#container .bookinfo .btitle em a',
                        'briefSelector': '#container .bookinfo .intro',
                        'letterCountSelector': null,
                        'chapterCountSelector': null,
                        'imageSelector': null,
                        'chapterListSelector': '#main .chapterlist',
                        'itemSelector': 'dd+dt~dd',
                        'chapterNameSelector': 'a',
                        'contentUrlSelector': 'a',
                        'contentSelector': '#BookText'
                    }
                };
            }
        },

        /**
		 * 提交表单
		 */
        submitForm (formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    let res = null;
                    try {
                        if (this.type == 'add') { //添加
                            // res = await this.$axios[addSearchType.method](addSearchType.url, this.sendData);
                        } else { //编辑
                            // res = await this.$axios[updateSearchType.method](updateSearchType.url, this.sendData);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                    if (res && res.code == 200) {
                        this.dialogConf.isShow = false;
                        this.$message.success(this.$t('msg.operation_success'));
                        this.resetForm(formName);
                        this.$emit('refresh');
                    };
                } else {
                    this.$message.error('请填写完表单');
                }
            });
        },

        /**
		 * 重置表单
		 * @param formName
		 */
        resetForm (formName) {
            this.$refs[formName].resetFields();
        }
    }
};
</script>
