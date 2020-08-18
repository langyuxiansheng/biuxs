<template>
    <div class="app-cropper-container">
        <div class="app-cropper-warpper">
            <div class="app-cropper">
                <vue-cropper
                    ref="cropper"
                    :img="option.img"
                    :output-size="option.size"
                    :output-type="option.outputType"
                    :info="true"
                    :fixed-box="option.fixedBox"
                    :auto-crop="option.autoCrop"
                    :auto-crop-width="option.autoCropWidth"
                    :auto-crop-height="option.autoCropHeight"
                    :center-box="option.centerBox"
                    :high="option.high"
                    :enlarge="option.enlarge"
                    @realTime="realTime"
                    @imgLoad="imgLoad"
                    @cropMoving="cropMoving"
                />
                <div class="upload-button">
                    <label class="btn" for="uploads">上传图片</label>
                    <input id="uploads" type="file" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
                    <label class="btn btn-save" @click="uploadImgToServer()">保存图片</label>
                </div>
            </div>
            <div class="priview">
                <div class="priview-t">
                    上传预览
                </div>
                <div class="priview-content">
                    <img :src="previews.url" :style="previews.img">
                </div>
                <div class="priview-tips">
                    <div class="text">
                        1.点击上传图片选择一张您喜欢的图片。
                    </div>
                    <div class="text">
                        2.拖动裁剪框可以裁剪图片。
                    </div>
                    <div class="text">
                        3.鼠标滚轮可以缩放图片。
                    </div>
                    <div class="text">
                        4.修整完成的图片点击保存按钮即可。
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { uploadFile } from '@/http';
export default {
    name: 'AppCropper',
    data() {
        return {
            previews: {},
            option: {
                img: '',
                size: 1,
                outputType: 'png',
                canMove: true,
                fixedBox: true, //固定截图框大小 不允许改变
                canMoveBox: true,
                autoCrop: true,
                // 只有自动截图开启 宽度高度才生效
                autoCropWidth: 120,
                autoCropHeight: 120,
                centerBox: false,
                high: false,
                cropData: {},
                enlarge: 1,
                mode: 'contain',
                maxImgSize: 2000
            },
            fileName: null,
            fileData: null //文件上传成功后的回调
        };
    },
    methods: {
        down(type) {
            // event.preventDefault()
            // 输出
            if (type === 'blob') {
                this.$refs.cropper.getCropBlob(data => {
                    this.downImg = window.URL.createObjectURL(data);
                    if (window.navigator.msSaveBlob) {
                        var blobObject = new Blob([data]);
                        window.navigator.msSaveBlob(blobObject, 'demo.png');
                    } else {
                        this.$nextTick(() => {
                            this.$refs.downloadDom.click();
                        });
                    }
                });
            } else {
                this.$refs.cropper.getCropData(data => {
                    this.downImg = data;
                    if (window.navigator.msSaveBlob) {
                        var blobObject = new Blob([data]);
                        window.navigator.msSaveBlob(blobObject, 'demo.png');
                    } else {
                        this.$nextTick(() => {
                            this.$refs.downloadDom.click();
                        });
                    }
                });
            }
        },

        uploadImg(e, num) {
            //上传图片
            // this.option.img
            var file = e.target.files[0];
            console.log(`file`, file);
            if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
                alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种');
                return false;
            }
            this.fileName = file.name;
            var reader = new FileReader();
            reader.onload = e => {
                let data;
                if (typeof e.target.result === 'object') {
                    // 把Array Buffer转化为blob 如果是base64不需要
                    data = window.URL.createObjectURL(new Blob([e.target.result]));
                } else {
                    data = e.target.result;
                }
                if (num === 1) {
                    this.option.img = data;
                } else if (num === 2) {
                    this.example2.img = data;
                }
            };
            // 转化为base64
            // reader.readAsDataURL(file)
            // 转化为blob
            reader.readAsArrayBuffer(file);
        },
        imgLoad(msg) {
            console.log(msg);
        },

        // 实时预览函数
        realTime(data) {
            var previews = data;
            var h = 0.5;
            var w = 0.2;

            this.previewStyle1 = {
                width: previews.w + 'px',
                height: previews.h + 'px',
                overflow: 'hidden',
                margin: '0',
                zoom: h
            };

            this.previewStyle2 = {
                width: previews.w + 'px',
                height: previews.h + 'px',
                overflow: 'hidden',
                margin: '0',
                zoom: w
            };

            this.previewStyle3 = {
                width: previews.w + 'px',
                height: previews.h + 'px',
                overflow: 'hidden',
                margin: '0',
                zoom: (100 / previews.w)
            };

            this.previewStyle4 = {
                width: previews.w + 'px',
                height: previews.h + 'px',
                overflow: 'hidden',
                margin: '0',
                zoom: (100 / previews.h)
            };
            this.previews = data;
        },

        cropMoving(data) {
            this.option.cropData = data;
        },

        /**
         * 上传图片到服务器
         */
        uploadImgToServer() {
            // 获取截图的blob数据
            this.$refs.cropper.getCropBlob(async (blob) => {
                try {
                    let file = new File([blob], this.fileName);
                    let fm = new FormData();
                    fm.append('file', file);
                    fm.append('remark', '用户头像图片');
                    const { code, data } = await this.$axios[uploadFile.method](uploadFile.url, fm);
                    if (code == 200) {
                        this.$emit('success', data);
                        console.log(data);
                    }
                } catch (error) {
                    this.$emit('error', error);
                    console.error(`upload Img To Server Error`, error);
                }
            });
        }
    }
};
</script>
<style lang="less" scoped>
@import url('~@/assets/styles/common/constant');
.app-cropper-container{
    min-height: 350px;
    .app-cropper-warpper{
        display: flex;
        .app-cropper{
            width: 400px;
            height: 300px;
        }
        .priview{
            flex: 1;
            margin-left: 10px;
            .priview-t{
                margin-bottom: 20px;
                text-align: center;
            }
            .priview-content{
                margin: 0 auto;
                width: 120px;
                height: 120px;
                border-radius: 60px;
                overflow: hidden;
                position: relative;
                background: #f9f9f9;
                border: 1px dashed @app-theme-color;
            }
            .priview-tips{
                margin-top: 20px;
                color: #ccc;
                .text{
                    margin-bottom: 10px;
                    font-size: 12px;
                }
            }
        }
    }
    .upload-button{
        margin-top: 20px;
        text-align: center;
        .btn{
            cursor: pointer;
            outline: none;
            background: @app-theme-color;
            color: #fff;
            border: 1px solid @app-theme-color;
            padding: 6px 14px;
            min-width: 80px;
            border-radius: 2px;
            opacity: 0.8;
            transition: all .2s ease-in;
            &:hover{
                opacity: 1;
            }
        }
        .btn-save{
            margin-left: 20px;
        }
    }
}
</style>
