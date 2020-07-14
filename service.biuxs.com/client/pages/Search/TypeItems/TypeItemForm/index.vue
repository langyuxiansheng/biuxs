<template>
    <dialog-container :dialog-conf="dialogConf">
        <el-row class="app-form" :gutter="$store.state.config.dialogFormGutterWidth">
            <el-form ref="AppForm" :model="sendData" :label-position="$store.state.config.labelPosition" :rules="rules" label-width="125px" @submit.native.prevent>
                <el-col :span="24">
                    <el-form-item label="搜索分类名" prop="name">
                        <el-input v-model="sendData.name" placeholder="请输入分类名" />
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
                    <template v-if="type =='update'">
                        <el-form-item label="排序">
                            <el-input v-model="sendData.sort" type="number" placeholder="请输入排序值" />
                        </el-form-item>
                    </template>
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
import { addSearchType, updateSearchType } from '@/http';
export default {
    name: 'TypeItemForm',
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
                name: null,
                value: null,
                status: 1, //排序
                remark: null
            },
            rules: {
                name: [
                    { required: true, message: '请输入搜索分类名', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
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
                            res = await this.$axios[addSearchType.method](addSearchType.url, this.sendData);
                        } else { //编辑
                            res = await this.$axios[updateSearchType.method](updateSearchType.url, this.sendData);
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
