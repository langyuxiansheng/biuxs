import util from '@/lib/util';
export default {

    /**
     * 格式化时间 2018-07-02 13:12:12
     * @param {*} value
     */
    formatDateYearMonthDayAndHms(value) {
        return util.formatDateYearMonthDayAndHms(value);
    },

    /**
     * 时长
     * @param {*} value
     */
    formatCountTime(value) {
        if (value) {
            return util.secondToDate(value);
        }
        return '0秒';
    },

    /**
     * 格式化书籍状态
     * @param {*} value
     */
    formatBookStatus(value) {
        switch (value) {
        case 1:
            return '完本';
        case 2:
            return '连载';
        case 3:
            return '已下架';
        default:
            return '其它';
        }
    },

    /**
     * 格式化书籍章节状态
     * @param {*} value
     */
    formatBookChapterStatus(value) {
        switch (value) {
        case 1:
            return '已完成';
        case 2:
            return '未完成';
        case 3:
            return '已失败';
        default:
            return '其它';
        }
    },

    /**
     * 格式化状态
     * @param {*} value
     */
    formatStatus(value) {
        switch (value) {
        case 1:
            return '正常';
        case 2:
            return '已下架';
        case 3:
            return '待审核';
        case 4:
            return '禁用';
        case 5:
            return '审核不通过';
        default:
            return '其它';
        }
    },

    /**
     * 格式化标签类型
     * @param {*} value
     */
    formatTagType(value) {
        switch (value) {
        case 1:
            return 'success';
        case 2:
            return 'warning';
        case 3:
            return 'primary';
        case 4:
            return 'danger';
        default:
            return 'info';
        }
    },

    /**
     * 格式化标签类型
     * @param {*} value
     */
    formatOptionType(value) {
        switch (Number(value)) {
        case 1:
            return 'bug提交';
        case 2:
            return '留言信息';
        case 3:
            return '意见反馈';
        case 4:
            return '产品建议';
        default:
            return '其它信息';
        }
    },

    /**
     * 格式化配置项类型
     * @param {*} value
     */
    formatConfigType(value) {
        switch (Number(value)) {
        case 1:
            return '书籍爬虫配置';
        case 2:
            return 'IP代理爬虫配置';
        case 3:
            return '用户阅读器配置';
        default:
            return '-';
        }
    },

    /**
     * 格式化文件大小
     * @param {*} value
     */
    formatFileSize(size) {
        let value = Number(size);
        if (size && !isNaN(value)) {
            const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB'];
            let index = 0;
            let k = value;
            if (value >= 1024) {
                while (k > 1024) {
                    k = k / 1024;
                    index++;
                }
            }
            return `${(k).toFixed(2)}${units[index]}`;
        }
        return '-';
    }

};
