/**
 * 用户账户
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export default {
    /**
     * 必填项目验证
     * @param {*} msg
     * @param {*} trigger
     */
    required(msg, trigger) {
        const defMsg = trigger == 'blur' ? '请输入必填项目' : '请选择必填项目';
        return {
            required: true, message: msg || defMsg, trigger: trigger || 'blur'
        };
    },

    /**
     * 必填项目验证
     * @param {*} msg
     * @param {*} trigger
     */
    inputLen(min = 1, max = 20, required = true) {
        return { min, max, required, message: `长度在 ${min} 到 ${max} 个字符`, trigger: 'blur' };
    }
};
