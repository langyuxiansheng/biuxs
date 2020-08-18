
export default {
    /**
     * 验证年龄
     * @param {*} msg
     */
    checkAge(msg) {
        return {
            validator (rule, value, callback) {
                if (!value) {
                    return callback(new Error(msg || '年龄不能为空'));
                }
                setTimeout(() => {
                    if (!Number.isInteger(value)) {
                        callback(new Error('请输入数字值'));
                    } else {
                        if (value < 18) {
                            callback(new Error('必须年满18岁'));
                        } else {
                            callback();
                        }
                    }
                }, 1000);
            },
            trigger: 'blur'
        };
    },

    /**
     * 通用必填验证
     * @param {*} message
     * @param {*} trigger
     */
    required(message, trigger = 'blur') {
        return { required: true, message, trigger };
    },

    /**
     * 通用输入长度限制
     * @param {*} min
     * @param {*} max
     * @param {*} message
     * @param {*} trigger
     */
    length(min = 1, max = 100, message, trigger = 'change') {
        return { min, max, message: message || `长度在 ${min} 到 ${max} 个字符`, trigger };
    },

    /**
     * 新密码验证
     * @param {*} checkPwd
     * @param {*} validateField
     * @param {*} required
     * @param {*} trigger
     * @param {*} msg
     *  * @description
     * newPassword(this.sendData.checkPwd,()=>{
     *    this.$refs.AppForm.validateField('checkPwd');
     * },false,'change')
     */
    newPassword(checkPwd, validateField, required = true, trigger = 'blur', msg = '请输入密码') {
        return {
            required,
            validator(rule, value, callback) {
                if (value === null) {
                    callback(new Error(msg));
                } else {
                    if (checkPwd !== null) {
                        validateField();
                    }
                    callback();
                }
            },
            trigger
        };
    },

    /**
     * 重复密码验证
     * @param {*} newPwd
     * @param {*} msg
     */
    checkNewPasswordVal(newPwd, msg) {
        return {
            validator (rule, value, callback) {
                if (value === null) {
                    callback(new Error(msg || '请再次输入密码'));
                } else if (value !== newPwd) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            },
            trigger: 'blur'
        };
    }
};
