<template>
    <card-container>
        <app-tables :table="table" :utils="table.utils" @pageChange="handleCurrentChange" @selectionChange="handleSelectionChange">
            <template>
                <el-input slot="title" v-model="table.queryData.title" placeholder="网站标题" />
                <el-button
                    slot="delete"
                    plain
                    type="danger"
                    icon="el-icon-delete"
                    :disabled="!deleteData.ids.length"
                    @click="handleDel(deleteData)"
                >
                    批量删除
                </el-button>
                <el-button slot="search" type="primary" @click="init()">
                    搜索
                </el-button>
                <el-button slot="add" type="primary" icon="el-icon-circle-plus" plain @click="showDialog({type:'add'})">
                    添加
                </el-button>
            </template>
            <template slot="column" slot-scope="{data}">
                <template v-if="data.col.key === 'operation'">
                    <el-button-group>
                        <el-button title="编辑" type="warning" icon="el-icon-edit" @click="showDialog({type:'update',data:data.row})" />
                        <el-button title="删除" type="danger" icon="el-icon-delete" @click="handleDel(data.row)" />
                    </el-button-group>
                </template>
                <template v-else-if="data.col.key === 'status'">
                    <el-tag :type="$appFilters.formatTagType(data.row[data.col.key])">
                        {{ data.row[data.col.key] | formatStatus }}
                    </el-tag>
                </template>
                <template v-else-if="data.col.key === 'path'">
                    <el-image
                        fit="cover"
                        :src="data.row[data.col.key]"
                        :preview-src-list="[data.row[data.col.key]]"
                    />
                </template>
                <template v-else-if="data.col.key === 'type'">
                    {{ data.row[data.col.key] ? '外链' :'本地' }}
                </template>
                <template v-else>
                    {{ data.row[data.col.key] || '-' }}
                </template>
            </template>
        </app-tables>
        <bg-form ref="BgForm" @refresh="init()" />
    </card-container>
</template>
<script>
import { getWebsiteBglibList, delWebsiteBglibByIds } from '@/http';
import BgForm from './BgForm';
import pager from '@/mixins/pager';
export default {
    components: { BgForm },
    mixins: [pager()],
    head: {
        title: '背景图管理'
    },
    data () {
        return {
            table: {
                queryData: {
                    title: null,
                    page: 1, //获取第几页的数据，默认为1
                    limit: 10//每页数据条数，默认为10
                },
                data: [], //表格数据
                total: 0, //总页数
                tableType: 1, //表格类型
                utils: { //表格工具栏
                    left: [{ slot: 'delete' }, { slot: 'title' }, { slot: 'search' }, { slot: 'add' }],
                    cols: [24]
                },
                cols: [ //表格列配置
                    {
                        key: 'title',
                        label: '标题'
                    },
                    {
                        key: 'path',
                        label: '预览'
                    },
                    {
                        key: 'type',
                        label: '类型'
                    },
                    {
                        key: 'status',
                        label: '状态'
                    },
                    {
                        key: 'sort',
                        label: '排序'
                    },
                    {
                        key: 'remark',
                        label: '备注'
                    },
                    {
                        key: 'operation',
                        width: '180px',
                        label: '操作'
                    }
                ]
            },
            deleteData: {
                ids: []
            }
        };
    },
    created() {
        this.init();
    },

    methods: {

        async init () {
            try {
                const { data: { total, list } } = await this.$axios[getWebsiteBglibList.method](getWebsiteBglibList.url, { params: this.table.queryData });
                this.table.data = list;
                this.table.total = total;
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * 分页器回调
         */
        handleCurrentChange(page) {
            this.table.queryData.page = page;
            this.init();
        },

        /**
	     * 弹出层控制
	     */
        showDialog ({ type, data }) {
            if (type === 'add') {
                this.$refs.BgForm.init({ type, title: '添加' });
            } else {
                this.$refs.BgForm.init({ type, data, title: '编辑' });
            }
        },

        /**
         * 删除
         */
        handleDel ({ backgroundId, ids }) {
            this.$confirm(`此操作将会删除此数据,是否继续?`, '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning',
                center: true,
                customClass: 'bg-warning'
            }).then(async () => {
                const { code } = await this.$axios[delWebsiteBglibByIds.method](delWebsiteBglibByIds.url, {
                    data: { ids: ids || [backgroundId], isDelete: true }
                });
                if (code == 200) {
                    this.$message.success(this.$t('msg.deleted_success'));
                    this.init();
                }
            }).catch(() => {});
        },

        /**
         * 批量删除
         */
        handleSelectionChange(list) {
            this.deleteData.ids = list.map(item => item.backgroundId);
        }
    }
};
</script>
