<template>
    <app-dialog class="app-user-form" :show.sync="dialogConf.isShow" :width="dialogConf.width" :btns="dialogConf.btns">
        <h5 class="form-title">
            <i class="iconfont iconbiulogo" />
            <span>个性化主页</span>
        </h5>
        <div class="app-form">
            <form @submit.prevent="submit()">
                <biu-check-box v-model="sendData.showTypeName">
                    <span>显示分类名称</span>
                </biu-check-box>
                <div class="bg-libs">
                    <ul class="libs">
                        <template v-for="img in images">
                            <li :key="img.id" class="image" :style="{backgroundImage:`url(${formatPath(img)})`}" @click="handleBgClick(img)">
                                <!-- <img :src="formatPath(img)" alt=""> -->
                            </li>
                        </template>
                    </ul>
                </div>
                <!-- 提交 -->
                <div class="form-item">
                    <button class="form-item-submit" type="submit">
                        保存设置
                    </button>
                </div>
            </form>
        </div>
    </app-dialog>
</template>
<script>
import { getBackgroundLibs } from '@/http';
import util from '@/lib/util';
// import config from '@/base/config';
export default {
    name: 'CustomForm',
    data() {
        return {
            dialogConf: {
                width: '600px',
                isShow: false,
                btns: false
            },
            sendData: {
                showTypeName: false, //显示分类标题
                background: '#fff' //主背景
            },
            images: [],
            backgroundEl: null
        };
    },
    mounted() {
        this.initCache();
    },
    methods: {

        initCache() {
            const res = util.getCache(util.getMD5UC('__CUSTOM-SETTING'));
            if (res) {
                console.log(this.backgroundEl);
                this.backgroundEl = this.createBackground();
                this.backgroundEl.style.backgroundImage = `url(${res.background})`;
                for (const key in res) {
                    this.sendData[key] = res[key];
                }
                this.$store.dispatch('user/setCustomSetting', res);
            }
        },

        /**
		 * 初始化
		 */
        async init () {
            this.dialogConf.isShow = true;
            this.getBackgrounds();
        },

        /**
         * 获取背景图
         */
        async getBackgrounds() {
            try {
                const { data } = await this.$axios[getBackgroundLibs.method](getBackgroundLibs.url);
                this.images = data || [];
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * 格式化路径
         */
        formatPath({ type, path }) {
            return type ? path : `${this.$IMAGE_PATH}${path}`;
        },

        /**
         * 提交
         */
        async submit() {
            try {
                util.setCache(util.getMD5UC('__CUSTOM-SETTING'), this.sendData);
                this.$store.dispatch('user/setCustomSetting', util.deepCloneObject(this.sendData));
                this.$message.success('保存成功');
                this.dialogConf.isShow = false;
            } catch (error) {
                console.error(`提交出错：`, error);
            }
        },

        /**
         * 背景图点击
         */
        handleBgClick(img) {
            const background = img.type ? img.path : `${this.$IMAGE_PATH}${img.path}`;
            if (this.backgroundEl) {
                if (this.backgroundEl) this.backgroundEl.style.backgroundImage = `url(${background})`;
            } else {
                this.backgroundEl = this.createBackground();
                this.backgroundEl.style.backgroundImage = `url(${background})`;
            }
            this.sendData.background = background;
        },

        /**
         * 创建背景标签
         */
        createBackground() {
            const bg = document.createElement('div');
            bg.setAttribute('id', 'app--background');
            bg.style.position = 'fixed';
            bg.style.top = '0';
            bg.style.left = '0';
            bg.style.width = '100%';
            bg.style.height = '100%';
            bg.style.transition = 'background 2s ease-in-out';
            bg.style.backgroundRepeat = 'no-repeat';
            bg.style.backgroundSize = 'cover';
            bg.style.backgroundPositionY = '50%';
            bg.style.zIndex = -1;
            document.body.appendChild(bg);
            return bg;
        }
    }
};
</script>
<style lang="less" scoped>
@import url('~@/assets/styles/common/constant');
.app-user-form{
    color: @app-theme-color;
    .form-title{
        margin-bottom: 40px;
        text-align: center;
        font-size: 24px;
        .iconfont{
            font-size: 24px;
        }
    }
    .app-form{
        .bg-libs{
            .libs{
                display: flex;
                flex-wrap: wrap;
                margin: 0 -12px 20px;
                .image{
                    margin: 10px 12px;
                    width: 120px;
                    height: 60px;
                    background-size: cover;
                    background-repeat: no-repeat;
                    opacity: .8;
                    transition: all .2s ease-in;
                    cursor: pointer;
                    &:hover{
                        opacity: 1;
                    }
                }
            }
        }
        .form-item{
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            .form-item-submit{
                display: block;
                margin: 0 auto;
                width: 30%;
                height: 40px;
                line-height: 40px;
                border: 1px solid @app-theme-color;
                color: #fff;
                background: @app-theme-color;
                border-radius: 3px;
                cursor: pointer;
                opacity: .8;
                font-size: 16px;
                outline: none;
                &:hover{
                    opacity: 1;
                }
            }
        }
    }
}
</style>
