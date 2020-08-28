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
     * 格式化时间 2018-07-02
     * @param {*} value
     */
    formatDateYearMonthDay(value) {
        return util.formatDateYearMonthDay(value);
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
     * 数组转字符串
     * @param {*} value
     */
    formatArrJoinStr(arr) {
        return Array.isArray(arr) ? arr.join(',') : arr;
    }

};
