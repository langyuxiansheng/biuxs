<template>
    <div class="app-form">
        <form @submit.prevent="submit()">
            <slot />
        </form>
    </div>
</template>
<script>
export default {
    name: 'BiuForm',
    methods: {
        submit() {
            this.$emit('submit');
        }
    }
};
</script>
<style lang="less" scoped>
@import url('~@/assets/styles/common/constant');
.app-form{
    .form-item{
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .form-item-input{
            border: 1px solid @app-theme-color;
            padding: 10px 15px;
            height: 40px;
            line-height: 40px;
            flex: 1;
            border-radius: 3px;
            outline: none;
            color: @app-theme-color;
            font-size: 14px;
        }
        input[type=checkbox]{
            visibility: hidden;
            display: none;
        }
        .form-item-checkbox{
            & + label{
                display: block;
                width: 16px;
                height: 16px;
                cursor: pointer;
                border: 1px solid @app-theme-color;
            }
            &:checked + label::before{
                display: block;
                content: "\2714";
                text-align: center;
                font-size: 12px;
                color: @app-theme-color;
            }
        }
        .form-item-checkbox-label{
            margin-right: 10px;
        }
        .checkbox-label{
            font-size: .875rem;
            color: #828282;
            .reset-pwd{
                color: @app-theme-color;
                margin-left: 10px;
                &:hover{
                    color: #f00;
                }
            }
        }
        .form-item-submit{
            display: block;
            width: 100%;
            height: 40px;
            line-height: 40px;
            border: 1px solid @app-theme-color;
            color: #fff;
            background: @app-theme-color;
            border-radius: 3px;
            cursor: pointer;
            opacity: .8;
            font-size: 18px;
            outline: none;
            &:hover{
                opacity: 1;
            }
        }
        .link-label{
            font-size: .875rem;
            color: #828282;
            a{
                color: @app-theme-color;
                &:hover{
                    color: #f00;
                }
            }
        }
    }
    .form-item-error{
        position: relative;
        .form-item-error-msg{
            width: 100%;
            position: absolute;
            left: 0;
            bottom: -16px;
            color: #f00;
            font-size: 12px;
        }
        .form-item-input{
            border: 1px solid #f00;
        }
    }
}
</style>
