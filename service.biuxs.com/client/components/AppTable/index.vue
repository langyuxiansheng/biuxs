<template>
    <div class="app-table">
        <!-- 普通表格 -->
        <el-table
            ref="DefaultTable"
            :data="table.data"
            :row-key="table.rowKey"
            :tree-props="table.treeProps"
            :height="table.height"
            :cell-style="table.cellStyle"
            :header-cell-style="table.headerCellStyle"
            :highlight-current-row="table.highlight || false"
            :border="table.border"
            :default-expand-all="table.defaultExpandAll"
            @selection-change="handleCurrentSelectionChange"
            @row-click="handleCurrentRowClick"
        >
            <el-table-column
                v-if="table.indexShow"
                type="index"
                width="70"
                align="center"
                :label="table.indexTitle"
                :index="indexMethod"
            />
            <el-table-column
                v-if="table.selection"
                type="selection"
                align="center"
                :reserve-selection="true"
                width="55"
            />
            <template v-if="table.tableType == 1">
                <el-table-column
                    v-for="(col,k) in table.cols"
                    :key="k"
                    :show-overflow-tooltip="col.key !== 'operation' && !col.overflow"
                    :align="col.align || 'center'"
                    :width="col.width || 'auto'"
                    :label="col.label"
                >
                    <template slot-scope="{$index,row}">
                        <slot name="column" :data="{row,col,index:$index}" />
                    </template>
                </el-table-column>
            </template>
            <template v-else-if="table.tableType == 2">
                <template v-for="(col,k) in table.cols">
                    <el-table-column
                        v-if="col.types && col.types.includes(include)"
                        :key="k"
                        :show-overflow-tooltip="col.key !== 'operation' && !col.overflow"
                        :align="col.align || 'center'"
                        :width="col.width || 'auto'"
                        :label="col.label"
                    >
                        <template slot-scope="{$index,row}">
                            <slot name="column" :data="{row,col,index:$index}" />
                        </template>
                    </el-table-column>
                </template>
            </template>
        </el-table>
        <el-pagination
            v-if="!table.hidePagination"
            background
            class="table-pagination"
            :current-page="table.params.page"
            :page-size="table.pagination.sizes[0]"
            :page-sizes="table.pagination.sizes"
            :layout="table.pagination.layout"
            :total="table.total"
            @current-change="handleCurrentPageChange"
            @size-change="handleCurrentSizeChange"
        />
        <!-- 其它组件 如表格的dialog -->
        <slot name="other" />
    </div>
</template>
<script>
import util from '@/lib/util';
export default {
    props: {
        config: {
            required: false,
            type: Object,
            default: () => null
        },
        include: {
            type: [String, Number, Object],
            default() {
                return {
                    include: null
                };
            }
        }
    },
    data() {
        return {
            table: {
                indexShow: true,
                border: true,
                page: 1, //页码索引
                total: 0, //总页码
                tableType: 1, //1 普通表格 2多类型表格
                hidePagination: false, //是否隐藏分页器
                selection: false, //表格的多选
                rowKey: null, //行数据的 Key
                treeProps: undefined, //渲染嵌套数据的配置选项[Object] { hasChildren: 'hasChildren', children: 'children' }
                height: undefined,
                headerCcellStyleellStyle: null,
                defaultExpandAll: false, //是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效
                headerCellStyle: null,
                indexTitle: '序号', //  序号显示标题
                data: [], //表格的数据
                cols: [], //表格的列配置
                pagination: {
                    layout: 'total, sizes, prev, pager, next, jumper', //配置
                    sizes: [10, 20, 30, 40, 50] //每页x条 默认大小为第一个
                }
            },

            //导出数据配置
            excel: {
                exportData: [],
                tHeader: [],
                filterVal: [],
                fileName: `导出数据 ${util.getThisTime()}` //表名+ 日期
            }
        };
    },
    watch: {
        config: { //监听配置的变化
            handler(val, oldVal) {
                if (val) { //读取配置
                    for (const key in val) {
                        this.table[key] = val[key];
                    }
                }
            },
            deep: true,
            immediate: true
        }
    },
    methods: {

        /**
         * 翻页
         */
        handleCurrentPageChange(page) {
            this.$emit(`pageChange`, page);
        },

        /**
         * 每页条数
         */
        handleCurrentSizeChange(size) {
            this.$emit(`sizeChange`, size);
        },

        /**
         * 多选回调
         */
        handleCurrentSelectionChange(val) {
            this.$emit(`selection-change`, val);
        },

        /**
         * 行点击回调
         */
        handleCurrentRowClick (row, event, column) {
            this.$emit(`handleRowClick`, row, event, column);
        },

        /**
         * 选中指定的行
         */
        toggleRowSelection(row) {
            console.log(`选中指定的行`, row);
            this.$refs.DefaultTable.toggleRowSelection(row);
        },

        /**
         * 取消多类型表格选中
         */
        clear() {
            this.$refs.DefaultTable.clearSelection();
        },

        /**
        * 序号
        */
        indexMethod(index) {
            if (this.table && this.table.params && this.table.params.page && this.table.params.size) {
                return (index + 1) + (this.table.params.page - 1) * this.table.params.size;
            } else {
                return (index + 1);
            }
        },

        /**
         * 导出全部
         * @param list 需要导出的数据列表严格按照 label key的格式
         * @formatJson 过滤函数
         */
        async exportExcel ({ data, ignores = [], format, fileName = '导出数据' }) {
            try {
                const cols = this.table.cols.filter((item) => !ignores.includes(item.key)); //过滤忽略的列
                if (!cols.length) return alert('Export Col Error!');
                const tHeader = cols.map(item => item.label); //Excel表头
                const list = this.____formatJson(data, cols.map(item => item.key), format); //格式化list的数据
                if (!list || list && list.length == 0) return alert('无数据导出!');
                if (!tHeader) return alert('Export Error!');
                const excel = await import ('@/assets/scripts/vendor/Export2Excel');
                excel.export_json_to_excel(tHeader, list, `${fileName} - ${util.getThisTime()}`);
            } catch (error) {
                console.error(`导出数据出错`, error);
            }
        },

        /**
         * 导出过滤器
         * @callback 过滤器函数会执行N次,每次回调参数中v,list中的数据,list中的key值
         * @description 私有方法不对外暴露
         */
        ____formatJson (list, filterVal, callback) {
            if (list && list.length > 0 && filterVal && filterVal.length > 0) {
                return list.map(v => filterVal.map(j => {
                    const res = callback ? callback(v, j) : v[j] || String(v[j]) || '-';
                    //数字类型的需要转换为string类型，否则会被excel转为科学计数法显示
                    return typeof res === 'number' ? String(res) : res;
                }));
            }
            return list;
        }
    }
};
</script>
<style>
.table-pagination {
    /* text-align: right; */
    margin-top: 30px;
}
</style>
