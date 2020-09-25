/**
 * 分页器回调
 * @param callbackName 分页回调函数名称
 */
export default (callbackName = 'init') => {
    return {
        methods: {
            /**
             * 分页翻页
             */
            handleCurrentChange(page) {
                if (this.table && this.table.params && this.table.params.page) {
                    this.table.params.page = page;
                    this[callbackName]();
                };
            },

            /**
             * 分页大小
             */
            handleSizeChange(size) {
                if (this.table && this.table.params && this.table.params.limit) {
                    this.table.params.limit = size;
                    this[callbackName]();
                }
            }
        }
    };
};
