<template>
    <div class="form-item" :class="{'form-item-error':errorMsg}">
        <input :id="did" v-model="input" :name="name" class="form-item-checkbox" type="checkbox" @change="handleChange">
        <label class="form-item-checkbox-label" :for="did" />
        <span class="checkbox-label">
            <slot />
        </span>
        <p v-if="errorMsg" class="form-item-error-msg">
            {{ errorMsg }}
        </p>
    </div>
</template>
<script>
export default {
    name: 'BiuCheckBox',
    model: {
        event: 'change',
        prop: 'value'
    },
    props: {
        did: {
            type: [String],
            required: false,
            default: `checkbox-${Date.parse(new Date())}`
        },
        value: {
            type: [Boolean],
            required: false,
            default: false
        },
        type: {
            type: String,
            requered: false,
            default: 'text'
        },
        name: {
            type: String,
            requered: false,
            default: null
        },
        placeholder: {
            type: String,
            requered: false,
            default: null
        },
        errorMsg: {
            type: String,
            requered: false,
            default: null
        }
    },
    data() {
        return {
            input: false
        };
    },
    watch: {
        value(v) {
            this.input = v;
        }
    },
    created() {
        this.input = this.value;
    },
    methods: {
        handleChange() {
            console.log(this.input);
            this.$emit('change', this.input);
        }
    }
};
</script>
<style lang="less" scoped>
@import url('~@/assets/styles/common/constant');
.form-item{
    display: flex;
    align-items: center;
    margin-bottom: 20px;
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
</style>
