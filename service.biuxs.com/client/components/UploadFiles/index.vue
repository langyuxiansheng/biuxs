<template>
    <el-upload
        multiple
        class="app-upload"
        :action="uploadsURL"
        :before-upload="beforeUpload"
        :on-preview="handlePreview"
        :before-remove="handleBeforeRemove"
        :on-success="handleSuccess"
        :file-list="fileList"
        list-type="picture"
        :headers="headers"
    >
        <el-button size="small" type="primary">
            点击上传
        </el-button>
        <div slot="tip" class="el-upload__tip">
            只能上传小于1G的文件
        </div>
    </el-upload>
</template>
<script>
import { deleteFiles } from '@/http';
import util from '@/lib/util';
import { FILE_UPLOAD_URL, FILES_UPLOAD_URL } from '@/http/models/types';
export default {
    name: 'UploadFiles',
    model: {
        prop: 'fileId',
        event: 'upload'
    },
    props: {
        fileId: {
            required: false,
            type: [String],
            default: null
        }
    },
    data() {
        return {
            uploadURL: FILE_UPLOAD_URL, //文件上传地址
            uploadsURL: FILES_UPLOAD_URL, //文件上传地址
            imageUrl: null,
            headers: {
                Authorization: util.getCookie(`BIU-SERVER-ADMIN-JWT`)
            },
            fileList: []
        };
    },
    methods: {

        /**
         * 上传文件
         */
        handlePreview(file) {
            console.log(file);
        },

        /**
         * 文件改变
         */
        handleChange(file, fileList) {
            this.fileList = fileList.slice(-3);
        },

        /**
         * 移除文件
         */
        async handleBeforeRemove(file, fileList) {
            try {
                if (file && file.response && file.response.data) {
                    const { code } = await this.$axios[deleteFiles.method](deleteFiles.url, {
                        data: { ids: [file.response.data.fileId], isDelete: true }
                    });
                    if (code == 200) {
                        this.$message.success(this.$t('msg.deleted_success'));
                        return Promise.resolve(true);
                    } else {
                        return Promise.resolve(false);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * 上传成功回调
         */
        handleSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
            console.log(res);
            if (res && res.code == 200) {
                this.$message.success('上传成功!');
                this.$emit('upload', res.data.path);
                this.$emit('success', res.data);
            } else {
                this.$message.error(res.msg || '上传失败!');
            }
        },

        beforeUpload(file) {
            const isImg = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isImg) {
                this.$message.error('上传头文件只能是图片格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 600kb!');
            }
            return isImg && isLt2M;
        }
    }
};
</script>
<style lang="less">
@import '~@/assets/styles/common/constant';
@size: 128px;
.app-file-uploader {
    .el-upload {
        border: 1px dashed @app-boder-color;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .el-upload:hover {
        border-color: @app-boder-color;
    }
    .app-file-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: @size;
        height: @size;
        line-height: @size;
        text-align: center;
    }
    .upload-view {
        width: @size;
        height: @size;
        display: block;
    }
}
</style>
