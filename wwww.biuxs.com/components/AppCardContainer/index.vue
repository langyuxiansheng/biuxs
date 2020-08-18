<template>
    <div class="app-card-container">
        <h3 class="card-title" :style="{fontSize:size}">
            <span>
                <i v-if="!hideIcon" class="iconfont" :class="icon" :style="{fontSize:size}" />
                <template v-if="title">
                    {{ title }}
                </template>
                <template v-else>
                    <slot name="title" />
                </template>
            </span>
            <a v-if="link" :href="link" :target="target" title="更多">
                <i class="iconfont icongengduo card-more" />
            </a>
        </h3>
        <div class="card-content">
            <slot />
        </div>
    </div>
</template>
<script>
export default {
    name: 'AppCardContainer',
    props: {
        icon: {
            required: false,
            type: [String],
            default: 'iconicon_work'
        },
        title: {
            required: false,
            type: [String],
            default: null
        },
        link: {
            required: false,
            type: [String],
            default: null
        },
        target: {
            required: false,
            type: [String],
            default: null
        },
        size: {
            required: false,
            type: [String],
            default: '16px'
        },
        hideIcon: {
            required: false,
            type: [Boolean],
            default: false
        }

    }
};
</script>
<style lang="less" scoped>
@import url('~@/assets/styles/common/constant');
.app-card-container{
    background: @app-bg-color;
    border-radius: 4px;
    margin-bottom: 20px;
    .card-title{
        padding: 20px 15px;
        font-size: 16px;
        border-bottom: 1px dashed @app-theme-boder;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 100%;
        font: inherit;
        .iconfont{
            color: @app-theme-color;
            margin-right: 10px;
        }
        .card-more{
            color: @app-font-color;
            transition: color .2s ease-in;
            &:hover{
                color: @app-hover-color;
            }
        }
    }
    .card-content{
        padding: 10px 15px;
    }
}
</style>
