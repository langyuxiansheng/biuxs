<template>
    <el-select v-model="value" class="select-block" :placeholder="placeholder" @change="handleChange">
        <slot v-if="isAll">
            <el-option
                label="全部分类"
                :value="null"
            />
        </slot>
        <el-option
            v-for="item in types"
            :key="item.id"
            :label="item.name"
            :value="item.id"
        />
    </el-select>
</template>
<script>
import { getWebsiteTypes } from '@/http';
export default {
    name: 'WebsiteTypesSelect',
    model: {
        prop: 'typeId',
        event: 'change'
    },
    props: {
        typeId: {
            required: false,
            type: [String],
            default: null
        },
        placeholder: {
            required: false,
            type: [String],
            default: `请选择一个分类`
        },
        isAll: { //是否显示全部分类 null
            required: false,
            type: [Boolean],
            default: false
        }
    },
    data() {
        return {
            value: null,
            types: []
        };
    },
    created() {
        this.init();
    },
    methods: {
        async init() {
            try {
                this.value = this.typeId;
                const res = await this.$axios[getWebsiteTypes.method](getWebsiteTypes.url);
                this.types = res && res.data || [];
            } catch (error) {
                console.error(error);
            }
        },
        handleChange(v) {
            this.$emit('change', v);
        }
    }
};
</script>
