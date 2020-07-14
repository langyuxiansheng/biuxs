<template>
    <card-container>
        <app-tables :table="table" :utils="table.utils" @pageChange="handleCurrentChange" @selectionChange="handleSelectionChange">
            <template>
                <el-input slot="title" v-model="table.queryData.title" placeholder="网站标题" />
                <WebsiteTypesSelect slot="select" v-model="table.queryData.typeId" is-all @change="handleSelect()" />
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
                <template v-else-if="data.col.key === 'logo'">
                    <template v-if="data.row.logo">
                        <el-image
                            fit="cover"
                            :src="data.row.logo"
                            :preview-src-list="[data.row.logo]"
                        />
                    </template>
                    <template v-else>
                        暂不支持预览
                    </template>
                </template>
                <template v-else>
                    {{ data.row[data.col.key] || '-' }}
                </template>
            </template>
        </app-tables>
        <include-link-form ref="IncludeLinkForm" @refresh="init()" />
    </card-container>
</template>
<script>
import { getIncludeLinkList, delIncludeLinkByIds } from '@/http';
import IncludeLinkForm from './IncludeLinkForm';
export default {
    head: {
        title: '站点管理'
    },
    components: { IncludeLinkForm },
    data () {
        return {
            table: {
                queryData: {
                    title: null,
                    typeId: null, //筛选被删除的文件
                    page: 1, //获取第几页的数据，默认为1
                    limit: 10//每页数据条数，默认为10
                },
                data: [], //表格数据
                total: 0, //总页数
                tableType: 1, //表格类型
                utils: { //表格工具栏
                    left: [{ slot: 'delete' }, { slot: 'title' }, { slot: 'select' }, { slot: 'search' }],
                    cols: [24]
                },
                cols: [ //表格列配置
                    {
                        key: 'title',
                        label: '网站标题'
                    },
                    {
                        key: 'url',
                        label: '网站域名'
                    },
                    {
                        key: 'admin',
                        label: '网站站长'
                    },
                    {
                        key: 'contact',
                        label: '联系方式'
                    },
                    {
                        key: 'logo',
                        label: '网站logo'
                    },
                    {
                        key: 'language',
                        label: '网站语言'
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
                const { data: { total, list } } = await this.$axios[getIncludeLinkList.method](getIncludeLinkList.url, { params: this.table.queryData });
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
         * 选择回调
         */
        handleSelect() {
            this.table.queryData.page = 1;
            this.init();
        },

        /**
	     * 弹出层控制
	     */
        showDialog ({ type, data }) {
            if (type === 'update') {
                this.$refs.IncludeLinkForm.init({ type, data, title: '编辑站点' });
            }
        },

        /**
         * 删除
         */
        handleDel ({ linkId, ids }) {
            this.$confirm(`此操作将会删除此数据,是否继续?`, '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning',
                center: true,
                customClass: 'bg-warning'
            }).then(async () => {
                const { code } = await this.$axios[delIncludeLinkByIds.method](delIncludeLinkByIds.url, {
                    data: { ids: ids || [linkId], isDelete: true }
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
            this.deleteData.ids = list.map(item => item.linkId);
        }
    }
};
</script>
