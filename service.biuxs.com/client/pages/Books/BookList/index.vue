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
                <el-input slot="title" v-model="table.queryData.title" placeholder="书名" />
                <el-input slot="title" v-model="table.queryData.author" placeholder="作者" />
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
                <template v-else-if="['createdTime','updatedTime'].includes(data.col.key)">
                    {{ data.row[data.col.key] | formatDateYearMonthDayAndHms }}
                </template>
                <template v-else-if="data.col.key === 'status'">
                    <el-tag :type="$appFilters.formatTagType(data.row[data.col.key])">
                        {{ data.row[data.col.key] | formatBookStatus }}
                    </el-tag>
                </template>
                <template v-else>
                    {{ data.row[data.col.key] || '-' }}
                </template>
            </template>
        </app-tables>
        <!-- <type-item-form ref="TypeItemForm" @refresh="init()" /> -->
    </card-container>
</template>
<script>
import { getBookListByAdmin, delBookAdminByIds } from '@/http';
// import TypeItemForm from './TypeItemForm';
export default {
    name: 'Books',
    head: {
        title: '搜索分类'
    },
    // components: { TypeItemForm },
    data () {
        return {
            table: {
                queryData: {
                    title: null,
                    author: null,
                    isDelete: null, //筛选被删除的文件
                    page: 1, //获取第几页的数据，默认为1
                    limit: 10//每页数据条数，默认为10
                },
                data: [], //表格数据
                total: 0, //总页数
                tableType: 1, //表格类型
                utils: { //表格工具栏
                    left: [{ slot: 'add' }, { slot: 'delete' }],
                    right: [{ slot: 'search' }],
                    cols: [12, 12]
                },
                cols: [ //表格列配置
                    {
                        key: 'title',
                        label: '书名'
                    },
                    {
                        key: 'author',
                        label: '作者'
                    },
                    {
                        key: 'image',
                        label: '图片'
                    },
                    // {
                    //     key: 'brief',
                    //     label: '书本简介'
                    // },
                    // {
                    //     key: 'letterCount',
                    //     label: '总字数'
                    // },
                    {
                        key: 'chapterCount',
                        label: '总章节数'
                    },
                    {
                        key: 'readCount',
                        label: '阅读总数'
                    },
                    {
                        key: 'type',
                        label: '分类'
                    },
                    // {
                    //     key: 'pinyin',
                    //     label: '拼音'
                    // },
                    // {
                    //     key: 'tags',
                    //     label: '小说标签'
                    // },
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
                const { data: { total, list } } = await this.$axios[getBookListByAdmin.method](getBookListByAdmin.url, { params: this.table.queryData });
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
                this.$refs.TypeItemForm.init({ type, title: '添加搜索分类' });
            } else if (type === 'update') {
                this.$refs.TypeItemForm.init({ type, data, title: '编辑搜索分类' });
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
                const { code } = await this.$axios[delBookAdminByIds.method](delBookAdminByIds.url, {
                    data: { ids: ids || [stid], isDelete: true }
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
            this.deleteData.ids = list.map(item => item.stid);
        }
    }
};
</script>
