<template>
    <card-container>
        <el-form :inline="true" :model="table.params" class="demo-form-inline">
            <el-form-item>
                <el-button type="primary" icon="el-icon-circle-plus" plain @click="showDialog({type:'add'})">
                    添加轮播图
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
            <el-form-item label="标题">
                <el-input v-model="table.params.title" placeholder="请输入标题" />
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
                <template v-else-if="data.col.key == 'image'">
                    <template v-if="data.row.image">
                        <el-image
                            fit="cover"
                            :src="data.row.image"
                            :preview-src-list="[data.row.image]"
                        />
                    </template>
                    <!-- <template v-if="data.row.image">
                        <el-image
                            fit="cover"
                            :src="$BASE_IMG_URL + data.row.image"
                            :preview-src-list="[$BASE_IMG_URL + data.row.image]"
                        />
                    </template> -->
                    <template v-else>
                        暂无封面
                    </template>
                </template>
                <template v-else-if="['createdTime','updatedTime','expiration'].includes(data.col.key)">
                    {{ data.row[data.col.key] | formatDateYearMonthDayAndHms }}
                </template>
                <template v-else-if="data.col.key === 'type'">
                    {{ data.row[data.col.key] | formatType }}
                </template>
                <template v-else-if="data.col.key === 'status'">
                    <el-tag :type="$appFilters.formatTagType(data.row[data.col.key])">
                        {{ data.row[data.col.key] | formatStatus }}
                    </el-tag>
                </template>
                <template v-else>
                    {{ [null, undefined].includes(data.row[data.col.key]) ? '-' : data.row[data.col.key] }}
                </template>
            </template>
        </app-table>
        <banner-form ref="BannerForm" @refresh="init()" />
    </card-container>
</template>
<script>
import { getBannerList, delBannerByIds } from '@/http';
import pager from '@/mixins/pager';
import BannerForm from './BannerForm';
export default {
    name: 'Banner',
    components: { BannerForm },
    filters: {
        formatType(value) {
            switch (value) {
            case 1:
                return '站内链接';
            case 2:
                return '站外链接';
            case 3:
                return '仅展示';
            default:
                return '其它';
            }
        }
    },
    mixins: [pager()],
    head: {
        title: '轮播图管理'
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
                        key: 'title',
                        label: '标题'
                    },
                    {
                        key: 'image',
                        label: '图片'
                    },
                    {
                        key: 'type',
                        label: '类型'
                    },
                    {
                        key: 'link',
                        label: '链接'
                    },
                    {
                        key: 'expiration',
                        label: '过期时间'
                    },
                    {
                        key: 'status',
                        label: '状态' //状态:1正常,2停用
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
                const { data: { total, list } } = await this.$axios[getBannerList.method](getBannerList.url, { params: this.table.params });
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
                this.$refs.BannerForm.init({ type, title: '添加轮播图' });
            } else if (type === 'update') {
                this.$refs.BannerForm.init({ type, data, title: '编辑轮播图' });
            }
        },

        /**
         * 删除
         */
        handleDel ({ bannerId, ids }) {
            this.$confirm(`此操作将会删除此数据,是否继续?`, '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning',
                center: true,
                customClass: 'bg-warning'
            }).then(async () => {
                const { code } = await this.$axios[delBannerByIds.method](delBannerByIds.url, {
                    data: { ids: ids || [bannerId], isDelete: true }
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
            this.deleteData.ids = list.map(item => item.bannerId);
        },

        /**
         * 导出表格的数据
         */
        exportExcel() {
            this.$refs.AppTable.exportExcel({
                data: this.table.data,
                ignores: ['operation'],
                fileName: '轮播数据',
                format: (data, key) => {
                    return data[key];
                }
            });
        }
    }
};
</script>
