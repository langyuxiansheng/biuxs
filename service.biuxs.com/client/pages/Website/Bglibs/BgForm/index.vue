<template>
    <dialog-container :dialog-conf="dialogConf">
        <el-row class="app-form" :gutter="$store.state.config.dialogFormGutterWidth">
            <el-form ref="AppForm" :model="sendData" :label-position="$store.state.config.labelPosition" :rules="rules" label-width="125px" @submit.native.prevent>
                <el-col :span="12">
                    <el-form-item label="背景标题" prop="title">
                        <el-input v-model="sendData.title" placeholder="请输入背景标题" />
                    </el-form-item>
                    <el-form-item label="路径类型">
                        <el-radio-group v-model="sendData.type">
                            <el-radio :label="0">
                                本地上传
                            </el-radio>
                            <el-radio :label="1">
                                外链
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="sendData.type" label="背景路径" prop="path">
                        <el-input v-model="sendData.path" placeholder="请输入背景路径" />
                    </el-form-item>
                    <el-form-item v-else label="上传图片" prop="path">
                        <UploadFile v-model="sendData.path" remark="管理员上传本地背景图片" @success="handleUploadFileSuccess" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="排序">
                        <el-input v-model="sendData.sort" placeholder="请输入排序" />
                    </el-form-item>
                    <el-form-item label="简介">
                        <el-input v-model="sendData.brief" :rows="4" type="textarea" placeholder="请输入简介" />
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="sendData.remark" :rows="4" type="textarea" placeholder="请输入备注" />
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
import { addWebsiteBglibs, updateWebsiteBglib } from '@/http';
export default {
    name: 'BgForm',
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
                title: null, //标题
                path: null, //路径
                fileId: null, //本地文件id
                brief: null, //网站简介
                remark: null, //备注
                sort: null, //排序
                status: 1,
                type: 0 //类型(0本地 1外链 )
            },
            rules: {
                title: [
                    { required: true, message: '请输入背景标题', trigger: 'blur' }
                ],
                path: [
                    { required: true, message: '请输入背景路径', trigger: 'blur' }
                ]
            },
            type: 'add',
            types: []
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
                    try {
                        let res = null;
                        if (this.type == 'add') {
                            res = await this.$axios[addWebsiteBglibs.method](addWebsiteBglibs.url, this.sendData);
                        } else {
                            res = await this.$axios[updateWebsiteBglib.method](updateWebsiteBglib.url, this.sendData);
                        }
                        if (res && res.code == 200) {
                            this.dialogConf.isShow = false;
                            this.$message.success(this.$t('msg.operation_success'));
                            this.resetForm(formName);
                            this.$emit('refresh');
                        };
                    } catch (error) {
                        console.error(error);
                    }
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
         * 文件上传
         */
        handleUploadFileSuccess(data) {
            this.sendData.fileId = data && data.fileId || null;
        }
    }
};
</script>
