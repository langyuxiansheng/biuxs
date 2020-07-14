<template>
    <card-container>
        <app-tables :table="table" :utils="table.utils" @pageChange="handleCurrentChange" @selectionChange="handleSelectionChange">
            <template>
                <el-button slot="add" type="primary" icon="el-icon-circle-plus" plain @click="showDialog({type:'add'})">
                    添加分类
                </el-button>
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
                <SearchTypesSelect slot="select" v-model="table.queryData.stid" @change="handleSelect()" />
            </template>
            <template slot="column" slot-scope="{data}">
                <template v-if="data.col.key === 'operation'">
                    <el-button-group>
                        <el-button title="编辑" type="warning" icon="el-icon-edit" @click="showDialog({type:'update',data:data.row})" />
                        <el-button title="删除" type="danger" icon="el-icon-delete" @click="handleDel(data.row)" />
                    </el-button-group>
                </template>
                <template v-else-if="['createdTime','updatedTime'].includes(data.col.key)">
                    {{ data.row[data.col.key] | formatDateYearMonthDayAndHms }}
                </template>
                <template v-else-if="data.col.key === 'icon'">
                    <template v-if="data.row.icon">
                        <el-image
                            fit="cover"
                            :src="data.row.icon"
                            :preview-src-list="[data.row.icon]"
                        />
                    </template>
                    <template v-else>
                        暂不支持预览
                    </template>
                </template>
                <template v-else-if="data.col.key === 'status'">
                    <el-tag :type="$appFilters.formatTagType(data.row[data.col.key])">
                        {{ data.row[data.col.key] | formatStatus }}
                    </el-tag>
                </template>
                <template v-else>
                    {{ data.row[data.col.key] || '-' }}
                </template>
            </template>
        </app-tables>
        <type-tag-form ref="TypeTagForm" @refresh="init()" />
    </card-container>
</template>
<script>
import { getSearchTagList, delSearchTagByIds } from '@/http';
import TypeTagForm from './TypeTagForm';
export default {
    head: {
        title: '搜索链接配置'
    },
    components: { TypeTagForm },
    data () {
        return {
            table: {
                queryData: {
                    keyword: null,
                    isDelete: null, //筛选被删除的文件
                    page: 1, //获取第几页的数据，默认为1
                    limit: 10//每页数据条数，默认为10
                },
                data: [], //表格数据
                total: 0, //总页数
                tableType: 1, //表格类型
                utils: { //表格工具栏
                    left: [{ slot: 'add' }, { slot: 'delete' }, { slot: 'select' }],
                    right: [{ slot: 'search' }],
                    cols: [12, 12]
                },
                cols: [ //表格列配置
                    {
                        key: 'label',
                        label: '链接名'
                    },
                    {
                        key: 'icon',
                        label: '图标'
                    },
                    {
                        key: 'searchUrl',
                        label: '链接'
                    },
                    {
                        key: 'sort',
                        label: '排序'
                    },
                    {
                        key: 'status',
                        label: '状态'
                    },
                    {
                        key: 'createdTime',
                        label: '创建时间'
                    },
                    {
                        key: 'tips',
                        label: 'Tips'
                    },
                    {
                        key: 'remark',
                        label: '备注'
                    },
                    {
                        key: 'updatedTime',
                        label: '最后修改时间'
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
                const { data: { total, list } } = await this.$axios[getSearchTagList.method](getSearchTagList.url, { params: this.table.queryData });
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
                this.$refs.TypeTagForm.init({ type, title: '添加搜索链接' });
            } else if (type === 'update') {
                this.$refs.TypeTagForm.init({ type, data, title: '编辑搜索链接' });
            }
        },

        /**
         * 删除
         */
        handleDel ({ typeId, ids }) {
            this.$confirm(`此操作将会删除此数据,是否继续?`, '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning',
                center: true,
                customClass: 'bg-warning'
            }).then(async () => {
                const { code } = await this.$axios[delSearchTagByIds.method](delSearchTagByIds.url, {
                    data: { ids: ids || [typeId], isDelete: true }
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
            this.deleteData.ids = list.map(item => item.typeId);
        },

        /**
         * 选择回调
         */
        handleSelect() {
            this.table.queryData.page = 1;
            this.init();
        }
    }
};
</script>
