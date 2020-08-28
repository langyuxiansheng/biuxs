<template>
    <transition name="fade">
        <div v-if="show" class="app-dialog-mask">
            <div class="dialog-wrapper">
                <div class="dialog-container" :style="{width}">
                    <i title="关闭" class="iconfont iconicon_roundadd dialog-close" @click="close" />
                    <div v-if="title" class="dialog-header">
                        {{ title }}
                    </div>
                    <slot v-else name="title" />
                    <div class="dialog-body">
                        <slot />
                    </div>
                    <div v-if="btns" class="dialog-footer app-flex app-flex-center">
                        <button class="dialog-btn dialog-cancel-btn" @click="cancel">
                            {{ cancelText }}
                        </button>
                        <button class="dialog-btn dialog-confirm-btn" @click="confirm">
                            {{ confirmText }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
export default {
    name: 'AppDialog',
    props: {
        title: {
            required: false,
            type: [String],
            default: null
        },
        cancelText: {
            required: false,
            type: [String],
            default: '取消'
        },
        confirmText: {
            required: false,
            type: [String],
            default: '确定'
        },
        width: {
            required: false,
            type: [String],
            default: '800px'
        },
        show: {
            required: false,
            type: [Boolean],
            default: false
        },
        btns: {
            required: false,
            type: [Boolean],
            default: true
        }
    },
    methods: {
        confirm() {
            console.log(`确定`);
            this.$emit('confirm');
        },
        cancel() {
            console.log(`取消`);
            this.$emit('cancel');
            this.$emit('update:show', false);
        },
        close() {
            console.log(`关闭`);
            this.$emit('close');
            this.$emit('update:show', false);
        }
    }
};
</script>
<style lang="less" scoped>
@import url('~@/assets/styles/common/constant');
.app-dialog-mask{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 9999;
    .dialog-wrapper{
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .dialog-container{
            width: 800px;
            background: @app-bg-color;
            border-radius: 5px;
            padding: 20px;
            position: relative;
            .dialog-header{
                text-align: center;
                margin-bottom: 10px;
            }
            .dialog-close{
                display: inline-block;
                position: absolute;
                right: 8px;
                top: 8px;
                cursor: pointer;
                font-size: 24px;
                color: #a7a7a7;
                transition: all .2s ease-in;
                transform: rotate(45deg);
                &:hover{
                    color: @app-theme-color;
                    transform: rotate(225deg);
                }
            }
        }
        .dialog-footer{
            .dialog-btn{
                display: inline-block;
                margin: 0 20px;
                width: 80px;
                height: 36px;
                line-height: 36px;
                border: 1px solid #eee;
                border-radius: 4px;
                cursor: pointer;
                padding: 0;
                transition: all .2s ease-in;
                outline: none;
            }
            .dialog-cancel-btn{
                &:hover{
                    background: @app-hover-bg;
                    border: 1px solid @app-theme-color;
                    color: @app-theme-color;
                }
            }
            .dialog-confirm-btn{
                background: @app-theme-color;
                color: #fff;
                &:hover{
                    opacity: .7;
                }
            }
        }
    }
}
</style>
