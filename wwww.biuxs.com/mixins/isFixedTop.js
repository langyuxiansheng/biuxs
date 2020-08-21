/**
 * 通用粘贴布局
 * @res 返回的字段
 */
export default (top = 100, dom) => {
    return {
        data() {
            return {
                isFixedTop: false
            };
        },
        mounted() {
            if (dom) {
                document.querySelector(dom).addEventListener('scroll', this.handleScroll);
            } else {
                window.addEventListener('scroll', this.handleScroll);
            }
        },
        methods: {
            /**
             * 滑动到顶部的时候固定tabs
             */
            handleScroll (e) {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                if (dom) {
                    scrollTop = e.target.scrollTop;
                }
                console.log(scrollTop);
                if (scrollTop >= top) {
                    this.isFixedTop = true;
                } else {
                    this.isFixedTop = false;
                }
            }
        }
    };
};
