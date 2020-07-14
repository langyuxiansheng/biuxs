<template>
    <el-upload
        class="app-file-uploader"
        :style="{width,height}"
        :action="uploadURL"
        :show-file-list="false"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        :headers="headers"
        :data="{remark}"
    >
        <img v-if="path" :src="path" class="upload-view">
        <i v-else class="el-icon-plus app-file-uploader-icon" />
    </el-upload>
</template>
<script>
import { deleteFiles } from '@/http';
import util from '@/lib/util';
import { FILE_UPLOAD_URL, FILES_UPLOAD_URL } from '@/http/models/types';
export default {
    name: 'UploadFile',
    model: {
        prop: 'path',
        event: 'upload'
    },
    props: {
        path: {
            required: false,
            type: [String],
            default: null
        },
        remark: {
            required: false,
            type: [String],
            default: '单文件上传'
        },
        width: {
            required: false,
            type: [String],
            default: '100%'
        },
        height: {
            required: false,
            type: [String],
            default: '100%'
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
            const isLt2M = file.size / 1024 / 1024 < 4;
            if (!isImg) {
                this.$message.error('上传头文件只能是图片格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 4M!');
            }
            return isImg && isLt2M;
        }
    }
};
</script>
<style lang="less">
@import '~@/assets/styles/common/constant';
@size: 100%;
.app-file-uploader {
    width: @size;
    height: @size;
    .el-upload {
        width: @size;
        height: @size;
        border: 1px dashed @app-boder-color;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        &:hover {
            border-color: @app-boder-color;
        }
        .app-file-uploader-icon {
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
}
</style>
