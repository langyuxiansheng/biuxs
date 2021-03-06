<template>
    <dialog-container :dialog-conf="dialogConf">
        <el-row class="app-form" :gutter="$store.state.config.dialogFormGutterWidth">
            <el-form ref="AppForm" :model="sendData" :label-position="$store.state.config.labelPosition" :rules="rules" label-width="125px" @submit.native.prevent>
                <el-col :span="12">
                    <el-form-item label="网站标题" prop="title">
                        <el-input v-model="sendData.title" placeholder="请输入网站标题" />
                    </el-form-item>
                    <el-form-item label="网站域名" prop="url">
                        <el-input v-model="sendData.url" placeholder="请输入网站域名" />
                    </el-form-item>
                    <el-form-item label="网站站长">
                        <el-input v-model="sendData.admin" placeholder="请输入网站站长" />
                    </el-form-item>
                    <el-form-item label="站长的联系方式">
                        <el-input v-model="sendData.contact" placeholder="请输入站长的联系方式" />
                    </el-form-item>
                    <el-form-item label="选择分类">
                        <WebsiteTypesSelect v-model="sendData.typeId" />
                    </el-form-item>
                    <el-form-item label="网站logo">
                        <div class="logo-upload">
                            <el-button type="primary" @click="showDialog ({ type:'logo' })">
                                点击上传
                            </el-button>
                            <div v-if="sendData.logo" class="priview-content">
                                <img :src="sendData.logo">
                            </div>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="网站排序">
                        <el-input v-model="sendData.sort" placeholder="请输入网站排序" />
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
                    <el-form-item label="网站快照">
                        <UploadFile v-model="sendData.photo" remark="网站快照" />
                    </el-form-item>
                    <el-form-item label="网站简介">
                        <el-input v-model="sendData.brief" :rows="4" type="textarea" placeholder="请输入网站简介" />
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
        <upload-logo ref="UploadLogo" @success="handleUploadLogo" />
    </dialog-container>
</template>
<script type="text/ecmascript-6">
import util from '@/lib/util';
import { updateIncludeLink } from '@/http';
import UploadLogo from './UploadLogo';
export default {
    name: 'IncludeLinkForm',
    components: { UploadLogo },
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
            initData: {
                title: null, //网站标题
                url: null, //网站域名
                admin: null, //网站站长
                contact: null, //站长的联系方式
                logo: null, //网站logo
                photo: null, //网站快照
                brief: null, //网站简介
                typeId: null, //分类ID
                remark: null, //备注
                sort: null, //排序
                status: 3
            },
            rules: {
                account: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
                ],
                pwd: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 4, max: 32, message: '长度在 4 到 32 个字符', trigger: 'blur' }
                ],
                checkPwd: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                    { min: 4, max: 32, message: '长度在 4 到 32 个字符', trigger: 'blur' }
                ],
                adminName: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
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
                        let res = await this.$axios[updateIncludeLink.method](updateIncludeLink.url, this.sendData);
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
            this.sendData.logo = path;
        }

    }
};
</script>
