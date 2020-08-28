<template>
    <div class="form-item" :class="{'form-item-error':errorMsg}">
        <slot name="prepend" />
        <select id="type" v-model="input" :name="name" class="form-item-select" type="select" @change="handleChange">
            <option :value="null" disabled style="display: none;">
                {{ placeholder }}
            </option>
            <template v-for="item in list">
                <option :key="item.value" :value="item.value">
                    {{ item.label }}
                </option>
            </template>
        </select>
        <slot name="append" />
        <p v-if="errorMsg" class="form-item-error-msg">
            {{ errorMsg }}
        </p>
    </div>
</template>
<script>
export default {
    name: 'BiuSelect',
    model: {
        event: 'change',
        prop: 'value'
    },
    props: {
        list: {
            type: Array,
            required: true,
            default: () => []
        },
        value: {
            type: [String, Number],
            required: false,
            default: null
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
    .form-item-select[type="select"]{
        border: 1px solid @app-theme-color;
        padding: 10px 15px;
        height: 40px;
        line-height: 40px;
        flex: 1;
        border-radius: 3px;
        outline: none;
        // color: @app-theme-color;
        color: #757575;
        font-size: 14px;
        background: #fff;
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
    .form-item-select[type="select"]{
        border: 1px solid #f00;
    }
}
</style>
