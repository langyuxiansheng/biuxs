<template>
    <el-table-column
        :show-overflow-tooltip="col.key !== 'operation' && !col.overflow"
        :prop="col.key"
        :align="col.align || 'center'"
        :width="col.width || 'auto'"
        :label="col.label"
        :fixed="col.fixed"
    >
        <template slot-scope="{row}">
            <slot :row="row" :col="col" />
        </template>
        <template v-if="col[children] && col[children].length">
            <Column v-for="(item,k) in col[children]" :key="k" :col="item">
                <template slot-scope="{row}">
                    <slot :prow="row" :row="row[col.key] || row" :pcol="col" :col="item" />
                </template>
            </Column>
        </template>
    </el-table-column>
</template>
<script>
export default {
    name: 'Column',
    props: {
        col: {
            type: Object,
            required: true
        },
        children: { //child识别字段
            type: String,
            required: false,
            default: `children`
        }
    }
};
</script>
