/**
 * 通用粘贴布局
 * @res 返回的字段
 */
export default (top = 100) => {
    return {
        data() {
            return {
                isFixedTop: false
            };
        },
        mounted() {
            window.addEventListener('scroll', this.handleScroll);
        },
        methods: {
            /**
             * 滑动到顶部的时候固定tabs
             */
            handleScroll () {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                if (scrollTop >= top) {
                    this.isFixedTop = true;
                } else {
                    this.isFixedTop = false;
                }
            }
        }
    };
};
