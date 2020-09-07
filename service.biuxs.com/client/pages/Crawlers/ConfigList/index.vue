<template>
    <card-container>
        <el-form :inline="true" :model="table.params" class="demo-form-inline">
            <el-form-item>
                <el-button type="primary" icon="el-icon-circle-plus" plain @click="showDialog({type:'add'})">
                    添加
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
            <el-form-item label="配置项名">
                <el-input v-model="table.params.name" placeholder="请输入配置项名" />
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
                        <el-button title="运行" type="primary" icon="el-icon-s-promotion" @click="runTask(data.row)" />
                        <el-button title="编辑" type="warning" icon="el-icon-edit" @click="showDialog({type:'update',data:data.row})" />
                        <el-button title="删除" type="danger" icon="el-icon-delete" @click="handleDel(data.row)" />
                    </el-button-group>
                </template>
                <template v-else-if="['createdTime','updatedTime'].includes(data.col.key)">
                    {{ data.row[data.col.key] | formatDateYearMonthDayAndHms }}
                </template>
                <template v-else-if="data.col.key === 'status'">
                    <el-tag :type="$appFilters.formatTagType(data.row[data.col.key])">
                        {{ data.row[data.col.key] | formatStatus }}
                    </el-tag>
                </template>
                <template v-else-if="data.col.key === 'type'">
                    {{ data.row[data.col.key] | formatConfigType }}
                </template>
                <template v-else>
                    {{ data.row[data.col.key] || '-' }}
                </template>
            </template>
        </app-table>
        <config-form ref="ConfigForm" @refresh="init()" />
    </card-container>
</template>
<script>
import { getConfigList, delConfigByIds, runTaskByConfigId } from '@/http';
import pager from '@/mixins/pager';
import ConfigForm from './ConfigForm';
export default {
    name: 'Config',
    components: { ConfigForm },
    mixins: [pager()],
    head: {
        title: '配置项管理'
    },
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
                        key: 'name',
                        label: '配置项名'
                    },
                    {
                        key: 'code',
                        label: '标识符'
                    },
                    {
                        key: 'type',
                        label: '类型'
                    },
                    {
                        key: 'userName',
                        label: '设置人名称'
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
                const { data: { total, list } } = await this.$axios[getConfigList.method](getConfigList.url, { params: this.table.params });
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
                this.$refs.ConfigForm.init({ type, title: '添加配置项' });
            } else if (type === 'update') {
                this.$refs.ConfigForm.init({ type, data, title: '编辑配置项' });
            }
        },

        /**
         * 删除
         */
        handleDel ({ configId, ids }) {
            this.$confirm(`此操作将会删除此数据,是否继续?`, '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning',
                center: true,
                customClass: 'bg-warning'
            }).then(async () => {
                const { code } = await this.$axios[delConfigByIds.method](delConfigByIds.url, {
                    data: { ids: ids || [configId], isDelete: true }
                });
                if (code == 200) {
                    this.$message.success(this.$t('msg.deleted_success'));
                    this.init();
                }
            }).catch(() => {});
        },

        /**
         * 运行此配置项的任务
         */
        runTask ({ configId }) {
            this.$confirm(`此操作将会运行此配置项的任务(耗时操作),是否继续?`, '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning',
                center: true,
                customClass: 'bg-warning'
            }).then(async () => {
                const { code } = await this.$axios[runTaskByConfigId.method](runTaskByConfigId.url, {
                    data: { configId }
                });
                if (code == 200) {
                    this.$message.success(this.$t('msg.operation_success'));
                    this.init();
                }
            }).catch(() => {});
        },

        /**
         * 批量删除
         */
        handleSelectionChange(list) {
            this.deleteData.ids = list.map(item => item.configId);
        },

        /**
         * 导出表格的数据
         */
        exportExcel() {
            this.$refs.AppTable.exportExcel({
                data: this.table.data,
                ignores: ['operation'],
                fileName: '配置数据',
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
