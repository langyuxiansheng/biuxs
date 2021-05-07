<template>
    <app-table ref="AppTable" :config="table" @pageChange="handleCurrentChange" @sizeChange="handleSizeChange">
        <template slot="column" slot-scope="{data}">
            <template v-if="data.col.key === 'operation'">
                <el-button-group>
                    <el-button title="更新章节" type="primary" icon="el-icon-refresh" @click="handleUpdateBook(data.row)" />
                    <el-button title="删除" type="danger" icon="el-icon-delete" @click="handleDel(data.row)" />
                </el-button-group>
            </template>
            <template v-else>
                {{ data.row[data.col.key] || '-' }}
            </template>
        </template>
    </app-table>
</template>
<script>
import pager from '@/mixins/pager';
export default {
    name: 'Books',
    mixins: [pager()],
    data () {
        return {
            table: {
                params: { //查询参数
                    title: null,
                    author: null,
                    page: 1, //获取第几页的数据，默认为1
                    limit: 10//每页数据条数，默认为10
                },
                data: [], //表格数据
                total: 0, //总页数
                cols: [ //表格列配置
                    {
                        key: 'title',
                        label: '书名',
                        children: [ //多级表头只需要把这里配置一下即可
                            {
                                key: 'author',
                                label: '作者',
                                width: '150px',
                                fixed: true //冻结列
                            },
                            {
                                key: 'image',
                                label: '图片',
                                width: '100px',
                                fixed: true
                            },
                            {
                                key: 'chapterCount',
                                label: '章节数',
                                width: '100px',
                                fixed: true
                            },
                            {
                                key: 'readCount',
                                label: '阅读数'
                            }
                        ]
                    },
                    {
                        key: 'type',
                        label: '分类'
                    },
                    {
                        key: 'sourceName',
                        label: '来源名称'
                    },
                    {
                        key: 'sourceUrl',
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
                        key: 'operation',
                        width: '180px',
                        label: '操作'
                    }
                ]
            }
        };
    },
    created() {
        this.init();
    },

    methods: {

        async init () {
            try {
            //   const { data: { total, list } } = http
                this.table.data = [];
                this.table.total = 0;
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * 删除
         */
        handleDel ({ stid, ids }) {
            this.$confirm(`此操作将会删除此数据,是否继续?`, '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning',
                center: true,
                customClass: 'bg-warning'
            }).then(async () => {
            //todo...
            }).catch(() => {});
        },

        /**
         * 更新章节
         */
        handleUpdateBook ({ bookId }) {
            this.$confirm(`此操作将会更新此书籍的章节,是否继续?`, '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning',
                center: true,
                customClass: 'bg-warning'
            }).then(async () => {
            //todo
            }).catch(() => {});
        },

        /**
         * 批量删除
         */
        handleSelectionChange(list) {
            this.deleteData.ids = list.map(item => item.stid);
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
