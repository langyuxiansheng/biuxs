<template>
    <dialog-container :dialog-conf="dialogConf">
        <el-row class="app-form" :gutter="$store.state.config.dialogFormGutterWidth">
            <el-form ref="AppForm" :model="sendData" :label-position="$store.state.config.labelPosition" :rules="rules" label-width="125px" @submit.native.prevent>
                <el-col :span="12">
                    <el-form-item label="配置项名" prop="name">
                        <el-input v-model="sendData.name" placeholder="请输入配置项名" />
                    </el-form-item>
                    <el-form-item label="配置项类型" prop="type">
                        <el-select v-model="sendData.type" class="select-block" placeholder="请选择配置项类型" @change="handleStatusChange">
                            <el-option label="书籍爬虫配置" :value="1" />
                            <el-option label="IP代理爬虫配置" :value="2" />
                            <el-option label="用户阅读器配置" :value="3" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="唯一标识符" prop="code">
                        <el-input v-model="sendData.code" placeholder="请输唯一标识符" />
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

                <template v-if="sendData.status == 1 && sendData.conf && sendData.conf.base && sendData.conf.info && sendData.conf.types">
                    <el-col :span="24">
                        <el-divider content-position="left">
                            <el-tag>站点基础配置</el-tag>
                        </el-divider>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="站点名称" prop="conf.base.title">
                            <el-input v-model="sendData.conf.base.title" placeholder="请输入站点名称(例:XX小说网)" />
                        </el-form-item>
                        <el-form-item label="站点协议" prop="conf.base.protocol">
                            <el-input v-model="sendData.conf.base.protocol" placeholder="请输入站点协议(例:https://)" />
                        </el-form-item>
                        <el-form-item label="站点地址" prop="conf.base.host">
                            <el-input v-model="sendData.conf.base.host" placeholder="请输入站点地址(例:www.xs.com)" />
                        </el-form-item>
                        <el-form-item label="站点编码" prop="conf.base.charset">
                            <el-input v-model="sendData.conf.base.charset" placeholder="请输入站点地址(例:utf-8)" />
                        </el-form-item>
                        <el-form-item label="站点超时" prop="conf.base.timeout">
                            <el-input v-model="sendData.conf.base.timeout" placeholder="请输入站点超时(例:10000)单位:ms" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="分类列表" prop="conf.base.listSelector">
                            <el-input v-model="sendData.conf.base.listSelector" placeholder="请输入分类列表选择器(例:#content) CSS选择器" />
                        </el-form-item>
                        <el-form-item label="分类列表项" prop="conf.base.itemSelector">
                            <el-input v-model="sendData.conf.base.itemSelector" placeholder="请输入分类列表项选择器(例:.li) CSS选择器" />
                        </el-form-item>
                        <el-form-item label="分类列表书籍名称" prop="conf.base.name">
                            <el-input v-model="sendData.conf.base.name" placeholder="请输入分类列表书籍名称选择器(例:.s2 > a:nth-child(1)) CSS选择器" />
                        </el-form-item>
                        <el-form-item label="分类列表书籍链接" prop="conf.base.href">
                            <el-input v-model="sendData.conf.base.href" placeholder="请输入分类列表书籍链接选择器(例:.s2 > a:nth-child(1)) CSS选择器" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-divider content-position="left">
                            <el-tag>
                                基本任务信息模型
                            </el-tag>
                        </el-divider>
                        <div class="config-model">
                            <p class="line-model">
                                $(<span class="select-name">`{{ sendData.conf.base.listSelector || '分类列表选择器' }}`</span>).find(<span class="select-name">`{{ sendData.conf.base.itemSelector || '分类列表项选择器' }}`</span>).each((index, el) => {
                            </p>
                            <p class="line-model pd-left-20">
                                const url = $(el).find(<span class="select-name">`{{ sendData.conf.base.href || '分类列表书籍链接选择器' }}`</span>).attr('href').trim();
                            </p>
                            <p class="line-model pd-left-20">
                                const name = $(el).find(<span class="select-name">`{{ sendData.conf.base.name || '分类列表书籍名称选择器' }}`</span>).text().trim();
                            </p>
                            <p class="line-model">
                                });
                            </p>
                        </div>
                    </el-col>
                    <el-col :span="24">
                        <el-divider content-position="left">
                            <el-tag>
                                分类抓取配置
                            </el-tag>
                        </el-divider>
                    </el-col>
                    <el-col :span="24">
                        <template v-for="(item,k) in sendData.conf.types">
                            <el-row :key="k" :gutter="20">
                                <el-col :span="4">
                                    <el-form-item :label="`分类名:${item.title || ''}`" :prop="'conf.types.' + k + '.title'" :rules="{required: true, message: '分类名不能为空', trigger: 'blur'}">
                                        <el-select v-model="item.title" class="select-block" placeholder="请选择分类">
                                            <el-option
                                                v-for="(cate,cindex) in cates"
                                                :key="cindex"
                                                :label="cate.type"
                                                :value="cate.type"
                                                :disabled="sendData.conf.types.map(i => i.title).includes(cate.type)"
                                            />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="分类参数链接" :prop="'conf.types.' + k + '.params'" :rules="{required: true, message: '分类参数链接不能为空', trigger: 'blur'}">
                                        <el-input v-model="item.params" placeholder="请输入分类参数链接(例:#/list/1_[page].html) [page]代表分页参数" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="3">
                                    <el-form-item label="起始页" :prop="'conf.types.' + k + '.page'" :rules="{required: true, message: '分类列表起始页不能为空', trigger: 'blur'}">
                                        <el-input v-model="item.page" placeholder="默认为1" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="3">
                                    <el-form-item label="最大页">
                                        <el-input v-model="item.max" placeholder="默认为100" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="3">
                                    <el-form-item label="操作">
                                        <el-button type="danger" plain @click="handleDeltype(k)">
                                            删除
                                        </el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </template>
                    </el-col>
                    <el-col v-if="sendData.conf.types.length < cates.length" :span="24">
                        <el-form-item>
                            <el-button type="primary" plain @click="handleAddtype()">
                                添加分类
                            </el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-divider content-position="left">
                            <el-tag>
                                书籍信息配置
                            </el-tag>
                        </el-divider>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="书籍标题" prop="conf.info.titleSelector">
                            <el-input v-model="sendData.conf.info.titleSelector" placeholder="请输入书籍标题选择器(例:#container .bookinfo .btitle h1) CSS选择器" />
                        </el-form-item>
                        <el-form-item label="书籍作者" prop="conf.info.authorSelector">
                            <el-input v-model="sendData.conf.info.authorSelector" placeholder="请输入书籍作者选择器(例:#container .bookinfo .btitle em a) CSS选择器" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="书籍简介" prop="conf.info.briefSelector">
                            <el-input v-model="sendData.conf.info.briefSelector" placeholder="请输入书籍简介选择器(例:#container .bookinfo .intro) CSS选择器" />
                        </el-form-item>
                        <el-form-item label="书籍封面">
                            <el-input v-model="sendData.conf.info.imageSelector" placeholder="请输入书籍封面选择器(例:#container > .image) CSS选择器" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="章节列表" prop="conf.info.chapterListSelector">
                            <el-input v-model="sendData.conf.info.chapterListSelector" placeholder="请输入章节列表选择器(例:#main .chapterlist) CSS选择器" />
                        </el-form-item>
                        <el-form-item label="章节内容链接" prop="conf.info.contentUrlSelector">
                            <el-input v-model="sendData.conf.info.contentUrlSelector" placeholder="请输入章节内容链接选择器(例: a ) CSS选择器" />
                        </el-form-item>
                        <el-form-item label="章节内容" prop="conf.info.contentSelector">
                            <el-input v-model="sendData.conf.info.contentSelector" placeholder="请输入章节内容选择器(例:#BookText) CSS选择器" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="章节列表项" prop="conf.info.itemSelector">
                            <el-input v-model="sendData.conf.info.itemSelector" placeholder="请输入章节列表项选择器(例: dd+dt~dd ) CSS选择器" />
                        </el-form-item>
                        <el-form-item label="章节名称" prop="conf.info.chapterNameSelector">
                            <el-input v-model="sendData.conf.info.chapterNameSelector" placeholder="请输入章节名称选择器(例: a ) CSS选择器" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-divider content-position="left">
                            <el-tag>
                                书籍信息数据采集模型
                            </el-tag>
                        </el-divider>
                        <div class="config-model">
                            //基本信息
                            <p class="line-model">
                                const title = $(<span class="select-name">`{{ sendData.conf.info.titleSelector || '书籍标题选择器' }}`</span>).text().trim();
                            </p>
                            <p class="line-model">
                                const author = $(<span class="select-name">`{{ sendData.conf.info.authorSelector || '书籍作者选择器' }}`</span>).text().trim();
                            </p>
                            <p class="line-model">
                                const brief = $(<span class="select-name">`{{ sendData.conf.info.briefSelector || '内容简介选择器' }}`</span>).text().trim();
                            </p>
                            <p class="line-model">
                                const image = $(<span class="select-name">`{{ sendData.conf.info.imageSelector || '书籍封面图选择器' }}`</span>).attr('src');
                            </p>
                            //章节列表配置
                            <p class="line-model">
                                $(<span class="select-name">`{{ sendData.conf.info.chapterListSelector || '分类列表选择器' }}`</span>).find(<span class="select-name">`{{ sendData.conf.info.itemSelector || '章节列表项选择器' }}`</span>).each((index, el) => {
                            </p>
                            <p class="line-model pd-left-20">
                                const title = $(el).find(<span class="select-name">`{{ sendData.conf.info.chapterNameSelector || '章节标题选择器' }}`</span>).text().trim();
                            </p>
                            <p class="line-model pd-left-20">
                                const url = $(el).find(<span class="select-name">`{{ sendData.conf.info.contentUrlSelector || '章节内容采集地址选择器' }}`</span>).attr('href').trim();
                            </p>
                            <p class="line-model">
                                });
                            </p>
                            //章节内容
                            <p class="line-model">
                                const content = $(el).find(<span class="select-name">`{{ sendData.conf.info.contentSelector || '章节内容选择器' }}`</span>).text().trim();
                            </p>
                        </div>
                    </el-col>
                </template>
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
import { addConfig, updateConfig } from '@/http';
export default {
    name: 'ConfigForm',
    data () {
        const { dialogDetailWidth } = this.$store.state.config;
        return {
            dialogConf: {
                width: dialogDetailWidth,
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
                        'title': null,
                        'protocol': 'https://',
                        'host': null,
                        'charset': null,
                        'timeout': 10000,
                        'listSelector': null,
                        'itemSelector': null,
                        'name': null,
                        'href': null
                    },
                    'types': [
                        {
                            'title': null,
                            'params': null,
                            'page': 1
                        }
                    ],
                    'info': {
                        'titleSelector': null,
                        'authorSelector': null,
                        'briefSelector': null,
                        'imageSelector': null,
                        'chapterListSelector': null,
                        'itemSelector': null,
                        'chapterNameSelector': null,
                        'contentUrlSelector': null,
                        'contentSelector': null
                    }
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
                ],
                'conf.base.title': [
                    { required: true, message: '请输入站点名称(例:XX小说网)', trigger: 'blur' }
                ],
                'conf.base.protocol': [
                    { required: true, message: '请输入站点协议(例:https://)', trigger: 'blur' }
                ],
                'conf.base.host': [
                    { required: true, message: '请输入站点地址(例:www.xs.com)', trigger: 'blur' }
                ],
                'conf.base.charset': [
                    { required: true, message: '请输入站点地址(例:utf-8)', trigger: 'blur' }
                ],
                'conf.base.timeout': [
                    { required: true, message: '请输入站点超时(例:10000)单位:ms', trigger: 'blur' }
                ],
                'conf.base.listSelector': [
                    { required: true, message: '请输入分类列表选择器(例:#content)', trigger: 'blur' }
                ],
                'conf.base.itemSelector': [
                    { required: true, message: '请输入分类列表项选择器(例:.li)', trigger: 'blur' }
                ],
                'conf.base.name': [
                    { required: true, message: '请输入分类列表书籍名称选择器(例:.s2 > a:nth-child(1))', trigger: 'blur' }
                ],
                'conf.base.href': [
                    { required: true, message: '请输分类列表书籍链接选择器(例:.s2 > a:nth-child(1))', trigger: 'blur' }
                ],
                'conf.info.titleSelector': [
                    { required: true, message: '请输入书籍标题选择器(例:#container .bookinfo .btitle h1)', trigger: 'blur' }
                ],
                'conf.info.authorSelector': [
                    { required: true, message: '请输入书籍作者选择器(例:#container .bookinfo .btitle em a)', trigger: 'blur' }
                ],
                'conf.info.briefSelector': [
                    { required: true, message: '请输入书籍简介选择器(例:#container .bookinfo .intro)', trigger: 'blur' }
                ],
                'conf.info.imageSelector': [
                    { required: true, message: '请输入书籍封面选择器(例:#container > .image)', trigger: 'blur' }
                ],
                'conf.info.chapterListSelector': [
                    { required: true, message: '请输入章节列表选择器(例:#main .chapterlist)', trigger: 'blur' }
                ],
                'conf.info.contentUrlSelector': [
                    { required: true, message: '请输入章节内容链接选择器(例: a )', trigger: 'blur' }
                ],
                'conf.info.contentSelector': [
                    { required: true, message: '请输入章节内容选择器(例:#BookText)', trigger: 'blur' }
                ],
                'conf.info.itemSelector': [
                    { required: true, message: '请输入章节列表项选择器(例: dd+dt~dd )', trigger: 'blur' }
                ],
                'conf.info.chapterNameSelector': [
                    { required: true, message: '请输入章节名称选择器(例: a )', trigger: 'blur' }
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
            ],
            cates: [
                {
                    type: '武侠修真',
                    icon: 'iconwuxia',
                    img: 'wuxiaxiuzhen.png'
                },
                {
                    type: '玄幻魔法',
                    icon: 'iconxuanhuan',
                    img: 'xuanhuanmofa.png'
                },
                {
                    type: '都市言情',
                    icon: 'iconxuanhuan',
                    img: 'xuanhuanmofa.png'
                },
                {
                    type: '科幻未来',
                    icon: 'iconkehuan',
                    img: 'kehuanweilai.png'
                },
                {
                    type: '灵异穿越',
                    icon: 'iconlingyi',
                    img: 'lingyichuanyue.png'
                },
                {
                    type: '历史军事',
                    icon: 'iconjunshi',
                    img: 'lishijunshi.png'
                },
                {
                    type: '悬疑推理',
                    icon: 'icontuilinengli',
                    img: 'xuanyituili.png'
                },
                {
                    type: '网游动漫',
                    icon: 'icontuilinengli',
                    img: 'xuanyituili.png'
                },
                {
                    type: '散文诗词',
                    icon: 'icontuilinengli',
                    img: 'xuanyituili.png'
                },
                {
                    type: '女生专区',
                    icon: 'iconnvsheng',
                    img: 'nvshengzhuanqu.png'
                },
                {
                    type: '男生专区',
                    icon: 'iconnansheng',
                    img: 'nanshengzhuanqu.png'
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
                        'title': null,
                        'protocol': 'https://',
                        'host': null,
                        'charset': null,
                        'timeout': 10000,
                        'listSelector': null,
                        'itemSelector': null,
                        'name': null,
                        'href': null
                    },
                    'types': [
                        {
                            'title': null,
                            'params': null,
                            'page': 1
                        }
                    ],
                    'info': {
                        'titleSelector': null,
                        'authorSelector': null,
                        'briefSelector': null,
                        'imageSelector': null,
                        'chapterListSelector': null,
                        'itemSelector': null,
                        'chapterNameSelector': null,
                        'contentUrlSelector': null,
                        'contentSelector': null
                    }
                };
            }
        },

        /**
         * 添加分类项
         */
        handleAddtype(types) {
            this.sendData.conf.types.push({
                'title': null,
                'params': null,
                'page': 1
            });
        },

        /**
         * 删除分类项
         */
        handleDeltype(index) {
            this.sendData.conf.types.splice(index, 1);
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
                            res = await this.$axios[addConfig.method](addConfig.url, this.sendData);
                        } else { //编辑
                            res = await this.$axios[updateConfig.method](updateConfig.url, this.sendData);
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
<style lang="less" scope>
.config-model{
    line-height: 1.6;
    background: #333;
    padding: 20px;
    border-radius: 4px;
    .line-model{
        color: #6ebb6e;
        font-weight: bold;
        .select-name{
            color: #ff3737;
        }
    }
    .pd-left-20{
        padding-left: 32px;
    }
}
</style>
