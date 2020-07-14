<template>
    <dialog-container :dialog-conf="dialogConf">
        <el-row class="app-form" :gutter="$store.state.config.dialogFormGutterWidth">
            <el-form ref="AppForm" :model="sendData" :label-position="$store.state.config.labelPosition" :rules="rules" label-width="125px" @submit.native.prevent>
                <el-col :span="24">
                    <el-form-item label="搜索链接名" prop="label">
                        <el-input v-model="sendData.label" placeholder="请输入搜索链接名" />
                    </el-form-item>
                    <el-form-item label="搜索链接" prop="searchUrl">
                        <el-input v-model="sendData.searchUrl" placeholder="请输入搜索链接" />
                    </el-form-item>
                    <el-form-item label="搜索分类" prop="stid">
                        <search-types-select v-model="sendData.stid" placeholder="请选择搜索分类" />
                    </el-form-item>
                    <el-form-item label="提示Tips">
                        <el-input v-model="sendData.tips" placeholder="请输入提示Tips" />
                    </el-form-item>
                    <el-form-item label="icon">
                        <div class="logo-upload">
                            <el-button type="primary" @click="showDialog ({ type:'logo' })">
                                点击上传
                            </el-button>
                            <div v-if="sendData.icon" class="priview-content">
                                <img :src="sendData.icon">
                            </div>
                        </div>
                    </el-form-item>
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
                    <el-form-item label="排序">
                        <el-input v-model="sendData.sort" type="number" placeholder="请输入排序" />
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
        <upload-logo ref="UploadLogo" @success="handleUploadLogo" />
    </dialog-container>
</template>
<script type="text/ecmascript-6">
import util from '@/lib/util';
import { addSearchTagByAdmin, updateSearchTag } from '@/http';
import UploadLogo from './UploadLogo';
export default {
    name: 'TypeTagForm',
    components: { UploadLogo },
    data () {
        const { dialogSingleFormWidth } = this.$store.state.config;
        return {
            dialogConf: {
                width: dialogSingleFormWidth,
                isShow: false,
                center: true,
                title: null
            },
            sendData: {},
            initData: {
                label: null,
                searchUrl: null,
                tips: null,
                icon: null,
                status: 1,
                stid: null,
                remark: null
            },
            rules: {
                label: [
                    { required: true, message: '请输入链接名', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
                stid: [
                    { required: true, message: '请输入选择搜索分类', trigger: 'change' }
                ],
                searchUrl: [
                    { required: true, message: '请输入搜索链接名', trigger: 'blur' },
                    { min: 1, max: 255, message: '长度在 1 到 20 个字符', trigger: 'blur' }
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
		 * 提交表单
		 */
        submitForm (formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    let res = null;
                    try {
                        if (this.type == 'add') { //添加
                            res = await this.$axios[addSearchTagByAdmin.method](addSearchTagByAdmin.url, this.sendData);
                        } else { //编辑
                            res = await this.$axios[updateSearchTag.method](updateSearchTag.url, this.sendData);
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
        },

        /**
	     * 弹出层控制
	     */
        showDialog ({ type, data }) {
            if (type === 'logo') {
                this.$refs.UploadLogo.init({ type, title: '上传logo' });
            }
        },

        /**
         * file回调
         */
        handleUploadLogo({ fileId, path }) {
            this.sendData.icon = path;
        }
    }
};
</script>
