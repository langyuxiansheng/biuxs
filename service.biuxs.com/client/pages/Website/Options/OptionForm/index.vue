<template>
    <dialog-container :dialog-conf="dialogConf">
        <el-row class="app-form" :gutter="$store.state.config.dialogFormGutterWidth">
            <el-form ref="AppForm" :model="sendData" :label-position="$store.state.config.labelPosition" :rules="rules" label-width="125px" @submit.native.prevent>
                <el-col :span="12">
                    <el-form-item label="页面标题" prop="title">
                        <el-input v-model="sendData.title" placeholder="请输入页面标题" />
                    </el-form-item>
                    <el-form-item label="页面图标" prop="icon">
                        <el-input v-model="sendData.icon" placeholder="请输入页面图标Class" />
                    </el-form-item>
                    <el-form-item label="页面标识符" prop="menu">
                        <el-input v-model="sendData.menu" placeholder="请输入页面标识符" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="备注">
                        <el-input v-model="sendData.remark" :rows="10" type="textarea" placeholder="请输入备注" />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="页面内容" prop="content">
                        <app-vue-editor v-model="sendData.content" placeholder="请输入页面内容" />
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
import vd from '@/lib/validate';
import { setWebpageBaseByAdmin } from '@/http';
export default {
    name: 'OptionForm',
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
                title: null, //页面标题
                icon: 'default', //页面图标
                content: null, //页面内容
                menu: null, //页面标识符
                remark: null //备注
            },
            rules: {
                title: [vd.required(`请输入标题`), vd.inputLen(1, 50)],
                icon: [vd.required(`请输入标题`), vd.inputLen(1, 50)],
                content: [vd.required(`请输入页面内容`), vd.inputLen(1, 10000)],
                menu: [vd.required(`请输入页面标识符`), vd.inputLen()]
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
            console.log(data);
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
                        res = await this.$axios[setWebpageBaseByAdmin.method](setWebpageBaseByAdmin.url, this.sendData);
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
