<template>
    <card-container>
        <app-tables :table="table" :utils="table.utils" @pageChange="handleCurrentChange" @selectionChange="handleSelectionChange">
            <template>
                <!-- <el-button slot="add" type="primary" icon="el-icon-circle-plus" plain @click="showDialog({type:'add'})">
                    添加页面
                </el-button> -->
                <el-input slot="title" v-model="table.queryData.title" placeholder="页面标题" />
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
                <!-- <el-button slot="export" plain @click="excelAllDownload()">
                    导出
                </el-button> -->
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
                <template v-else>
                    {{ data.row[data.col.key] || '-' }}
                </template>
            </template>
        </app-tables>
        <!-- <option-form ref="OptionForm" @refresh="init()" /> -->
    </card-container>
</template>
<script>
import { getUserBaseList, delOptionMsgByIds } from '@/http';
// import OptionForm from './OptionForm';
export default {
    head: {
        title: '反馈留言'
    },
    // components: { OptionForm },
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
                    left: [{ slot: 'delete' }, { slot: 'title' }, { slot: 'search' }],
                    cols: [24]
                },
                cols: [ //表格列配置
                    {
                        key: 'account',
                        label: '账号'
                    },
                    {
                        key: 'phone',
                        label: '手机号'
                    },
                    {
                        key: 'email',
                        label: '邮箱'
                    },
                    {
                        key: 'avatar',
                        label: '头像'
                    },
                    {
                        key: 'nickname',
                        label: '昵称'
                    },
                    {
                        key: 'birthday',
                        label: '生日'
                    },
                    {
                        key: 'birthday',
                        label: '生日'
                    },
                    {
                        key: 'wechat',
                        label: '微信'
                    },
                    {
                        key: 'qq',
                        label: 'QQ'
                    },
                    {
                        key: 'status',
                        label: '状态'
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
                const { data: { total, list } } = await this.$axios[getUserBaseList.method](getUserBaseList.url, { params: this.table.queryData });
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
                this.$refs.OptionForm.init({ type, title: '添加页面' });
            } else if (type === 'update') {
                this.$refs.OptionForm.init({ type, data, title: '编辑页面' });
            }
        },

        /**
         * 删除
         */
        handleDel ({ optionId, ids }) {
            this.$confirm(`此操作将会删除此数据,是否继续?`, '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning',
                center: true,
                customClass: 'bg-warning'
            }).then(async () => {
                const { code } = await this.$axios[delOptionMsgByIds.method](delOptionMsgByIds.url, {
                    data: { ids: ids || [optionId], isDelete: true }
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
            this.deleteData.ids = list.map(item => item.optionId);
        }
    }
};
</script>
