<template>
    <dialog-container :dialog-conf="dialogConf">
        <el-row class="app-form" :gutter="$store.state.config.dialogFormGutterWidth">
            <el-form ref="AppForm" :model="sendData" :label-position="$store.state.config.labelPosition" :rules="rules" label-width="125px" @submit.native.prevent>
                <el-col :span="12">
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="sendData.title" placeholder="请输入标题" />
                    </el-form-item>
                    <el-form-item label="类型" prop="type">
                        <el-select v-model="sendData.type" class="select-block" placeholder="请选择类型">
                            <el-option
                                v-for="item in types"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <template v-if="sendData.type != 3">
                        <el-form-item label="链接" prop="link">
                            <el-input v-model="sendData.link" placeholder="请输入链接" />
                        </el-form-item>
                    </template>
                    <el-form-item label="状态" prop="status">
                        <StatusSelect v-model="sendData.status" placeholder="请选择状态" />
                    </el-form-item>
                    <el-form-item label="封面图" prop="image">
                        <div class="image-upload">
                            <el-button type="primary" @click="showDialog ({ type:'upload' })">
                                点击上传
                            </el-button>
                            <div v-if="sendData.image" class="priview-content">
                                <img :src="sendData.image">
                            </div>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="有效期">
                        <el-date-picker
                            v-model="expirationTime"
                            class="select-block"
                            type="datetime"
                            :value-format="$config.datePrickValueFormat"
                            placeholder="请选择有效期"
                            default-time="23:59:59"
                            align="center"
                            @change="handleExpirationTimeChange"
                        />
                    </el-form-item>
                    <el-form-item label="排序">
                        <el-input v-model="sendData.sort" placeholder="请输入网站排序" />
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
        <upload-img ref="UploadImg" @success="handleUploadLogo" />
    </dialog-container>
</template>
<script type="text/ecmascript-6">
import util from '@/lib/util';
import { addBanner, updateBanner } from '@/http';
import UploadImg from './UploadImg';
export default {
    name: 'BannerForm',
    components: { UploadImg },
    data () {
        const { dialogFormWidth } = this.$store.state.config;
        return {
            dialogConf: {
                width: dialogFormWidth,
                isShow: false,
                center: true,
                title: null
            },
            expirationTime: null,
            sendData: {},
            initData: {
                title: null, //标题
                type: 3, //类型
                image: null, //封面图
                link: null, //链接
                expiration: null, //有效期
                sort: null, //有效期
                status: 1, //排序
                remark: null
            },
            rules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' },
                    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
                ],
                link: [
                    { required: true, message: '请输入链接', trigger: 'blur' },
                    { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
                ],
                image: [
                    { required: true, message: '请上传封面图', trigger: 'change' }
                ],
                type: [
                    { required: true, message: '请选择类型', trigger: 'change' }
                ],
                status: [
                    { required: true, message: '请选择状态', trigger: 'change' }
                ]
            },
            type: 'add',
            types: [
                {
                    label: '站内链接',
                    value: 1
                },
                {
                    label: '站外链接',
                    value: 2
                },
                {
                    label: '仅展示',
                    value: 3
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
                if (data.expiration) this.expirationTime = data.expiration * 1000;
            }
        },

        /**
		 * 提交表单
		 */
        submitForm (formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    let res = null;
                    if (this.type == 'add') { //添加
                        res = await this.$axios[addBanner.method](addBanner.url, this.sendData);
                    } else { //编辑
                        res = await this.$axios[updateBanner.method](updateBanner.url, this.sendData);
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
         * 有效时间
         */
        handleExpirationTimeChange(v) {
            this.sendData.expiration = Date.parse(new Date()) / 1000;
        },

        /**
	     * 弹出层控制
	     */
        showDialog ({ type, data }) {
            if (type === 'upload') {
                this.$refs.UploadImg.init({ type, title: '上传图片' });
            }
        },

        /**
         * file回调
         */
        handleUploadLogo({ fileId, path }) {
            console.log(path);
            this.sendData.image = path;
        }
    }
};
</script>
.<style lang="less" scoped>
.app-form{
    .image-upload{
        width: 375px;
        height: 160px;
        .priview-content{
            margin-top: 20px;
        }
    }
}
</style>
