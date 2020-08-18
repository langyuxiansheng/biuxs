<template>
    <div class="form-item" :class="{'form-item-error':errorMsg}">
        <slot name="prepend" />
        <textarea v-if="type == 'textarea'" v-model="input" :rows="rows" :cols="cols" class="form-item-input" :type="type" :placeholder="placeholder" @change="handleChange" @blur="handleBlur" @focus="handleFocus" />
        <input v-else v-model="input" :name="name" class="form-item-input" :type="type" :placeholder="placeholder" @change="handleChange" @blur="handleBlur" @focus="handleFocus">
        <slot name="append" />
        <p v-if="errorMsg" class="form-item-error-msg">
            {{ errorMsg }}
        </p>
    </div>
</template>
<script>
export default {
    name: 'BiuInput',
    model: {
        event: 'change',
        prop: 'value'
    },
    props: {
        value: {
            type: [String, Number],
            required: false,
            default: null
        },
        rows: {
            type: [String, Number],
            required: false,
            default: 4
        },
        cols: {
            type: [String, Number],
            required: false,
            default: 5
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
            input: null
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
            this.$emit('change', this.input);
        },
        handleBlur() {
            this.$emit('blur', this.input);
        },
        handleFocus() {
            this.$emit('focus', this.input);
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
    position: relative;
    .form-item-input{
        border: 1px solid @app-theme-color;
        padding: 10px 15px;
        min-height: 40px;
        flex: 1;
        border-radius: 3px;
        outline: none;
        color: @app-theme-color;
        font-size: 14px;
    }
}
.form-item-error{
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
