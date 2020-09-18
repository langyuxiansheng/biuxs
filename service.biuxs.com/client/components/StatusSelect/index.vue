<template>
    <el-select v-model="value" class="select-block" :placeholder="placeholder" @change="handleChange">
        <slot v-if="isAll">
            <el-option
                label="全部状态"
                :value="null"
            />
        </slot>
        <el-option
            v-for="item in list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
    </el-select>
</template>
<script>
export default {
    name: 'StatusSelect',
    model: {
        prop: 'status',
        event: 'change'
    },
    props: {
        status: {
            required: false,
            type: [String, Number],
            default: null
        },
        placeholder: {
            required: false,
            type: [String],
            default: `请选择一个状态`
        },
        isAll: { //是否显示全部null
            required: false,
            type: [Boolean],
            default: false
        }
    },
    data() {
        return {
            value: null,
            list: [
                {
                    label: '正常',
                    value: 1
                },
                {
                    label: '已下架',
                    value: 2
                },
                {
                    label: '待审核',
                    value: 3
                },
                {
                    label: '禁用',
                    value: 4
                },
                {
                    label: '审核不通过',
                    value: 5
                }
            ]
        };
    },
    watch: {
        status: {
            handler(status) {
                this.value = status;
            },
            immediate: true
        }
    },
    methods: {
        handleChange(v) {
            this.$emit('change', v);
        }
    }
};
</script>
