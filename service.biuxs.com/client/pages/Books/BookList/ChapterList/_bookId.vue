<template>
    <card-container>
        <el-form :inline="true" :model="table.params" class="demo-form-inline">
            <el-form-item>
                <el-button type="primary" icon="el-icon-circle-plus" plain @click="showDialog({type:'add'})">
                    添加分类
                </el-button>
            </el-form-item>
            <el-form-item>
                <el-button
                    plain
                    type="danger"
                    icon="el-icon-delete"
                    :disabled="!deleteData.ids.length"
                    @click="handleDel(deleteData)"
                >
                    批量删除
                </el-button>
            </el-form-item>
            <el-form-item label="章节名">
                <el-input v-model="table.params.title" placeholder="请输入章节名" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="init()">
                    查询
                </el-button>
            </el-form-item>
        </el-form>
        <app-table ref="AppTable" :config="table" @pageChange="handleCurrentChange" @sizeChange="handleSizeChange">
            <template slot="column" slot-scope="{data}">
                <template v-if="data.col.key === 'operation'">
                    <el-button-group>
                        <el-button title="编辑" type="warning" icon="el-icon-edit" @click="showDialog({type:'update',data:data.row})" />
                        <el-button title="删除" type="danger" icon="el-icon-delete" @click="handleDel(data.row)" />
                    </el-button-group>
                </template>
                <template v-else-if="data.col.key == 'title'">
                    <reader ref="Reader" :title="data.row.title" :chapter-id="data.row.chapterId">
                        {{ data.row.title }}
                    </reader>
                </template>
                <template v-else-if="data.col.key === 'url'">
                    <a :href="data.row[data.col.key]" target="_blank" rel="noopener noreferrer">
                        {{ data.row[data.col.key] }}
                    </a>
                </template>
                <template v-else-if="['createdTime','updatedTime'].includes(data.col.key)">
                    {{ data.row[data.col.key] | formatDateYearMonthDayAndHms }}
                </template>
                <template v-else-if="data.col.key === 'status'">
                    <el-tag :type="$appFilters.formatTagType(data.row[data.col.key])">
                        {{ data.row[data.col.key] | formatBookChapterStatus }}
                    </el-tag>
                </template>
                <template v-else>
                    {{ data.row[data.col.key] || '-' }}
                </template>
            </template>
        </app-table>
    </card-container>
</template>
<script>
import { getBookChapterListByAdmin, delBookChapterAdminByIds } from '@/http';
import pager from '@/mixins/pager';
import Reader from './Reader';
export default {
    name: 'Books',
    components: { Reader },
    mixins: [pager()],
    head: {
        title: '搜索分类'
    },
    data () {
        const { bookId } = this.$route.params;
        return {
            table: {
                params: { //查询参数
                    bookId,
                    title: null,
                    page: 1, //获取第几页的数据，默认为1
                    limit: 10//每页数据条数，默认为10
                },
                data: [], //表格数据
                total: 0, //总页数
                cols: [ //表格列配置
                    {
                        key: 'title',
                        label: '章节名'
                    },
                    {
                        key: 'url',
                        label: '来源地址'
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
                        key: 'updatedTime',
                        label: '修改时间'
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
                const { data: { total, list } } = await this.$axios[getBookChapterListByAdmin.method](getBookChapterListByAdmin.url, { params: this.table.params });
                this.table.data = list;
                this.table.total = total;
            } catch (error) {
                console.error(error);
            }
        },

        /**
	     * 弹出层控制
	     */
        showDialog ({ type, data }) {
            if (type === 'add') {
                this.$refs.TypeItemForm.init({ type, title: '添加搜索分类' });
            } else if (type === 'update') {
                this.$refs.TypeItemForm.init({ type, data, title: '编辑搜索分类' });
            }
        },

        /**
         * 删除
         */
        handleDel ({ chapterId, ids }) {
            this.$confirm(`此操作将会删除此数据,是否继续?`, '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning',
                center: true,
                customClass: 'bg-warning'
            }).then(async () => {
                const { code } = await this.$axios[delBookChapterAdminByIds.method](delBookChapterAdminByIds.url, {
                    data: { ids: ids || [chapterId], isDelete: true }
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
            this.deleteData.ids = list.map(item => item.chapterId);
        },

        /**
         * 导出表格的数据
         */
        exportExcel() {
            this.$refs.AppTable.exportExcel({
                data: this.table.data,
                ignores: ['operation'],
                fileName: '书籍数据',
                format: (data, key) => {
                    // if (key == 'roleList') {
                    //     const roleList = data[key].map((item) => {
                    //         return item.roleName;
                    //     });
                    //     return roleList;
                    // } else if (key == 'deptList') {
                    //     const deptList = data[key].map((item) => {
                    //         return item.name;
                    //     });
                    //     return deptList;
                    // } else {
                    //     return data[key];
                    // }
                    return data[key];
                }
            });
        }
    }
};
</script>
