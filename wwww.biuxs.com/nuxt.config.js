
export default {
    mode: 'universal',
    head: {
        title: '笔优网-快捷安全的网址分类与互联网资讯', //笔优网址导航-快捷安全的网址分类导航页
        meta: [
            { charset: 'utf-8' },
            { 'http-equiv': 'Content-Type', content: 'text/html', charset: 'utf-8' },
            { 'http-equiv': 'X-UA-Compatible', content: 'IE=Edge,chrome=1' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { name: 'renderer', content: 'webkit' },
            { hid: 'keywords', name: 'keywords', content: `笔优网址导航,网址大全,导航服务,网址分类,云书签自定义,互联网资讯` },
            { hid: 'description', name: 'description', content: `笔优网址导航,是一个快捷安全方便的上网导航,专注于及时收录各种分类的优秀网站,提供简单便捷的上网分类导航服务和自定义书签导航服务` }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'stylesheet', href: '//at.alicdn.com/t/font_1622620_gn279em8b7q.css' }
        ],
        script: [
            {
                type: 'text/javascript',
                src: 'https://v1.cnzz.com/z_stat.php?id=1278668303&web_id=1278668303',
                async: true
            }
        ]
    },
    loading: { color: '#3acbff' },
    css: [
        '@/assets/styles/common/reset.css',
        '@/assets/styles/common/theme.default.less',
        '@/assets/styles/common/page-transletion.less'
    ],
    plugins: [
        { src: '@/plugins/components', ssr: true },
        // { src: '@/plugins/i18n', ssr: false },
        { src: '@/plugins/message', ssr: false },
        { src: '@/plugins/filters', ssr: false },
        { src: '@/plugins/axios', ssr: true },
        { src: '@/plugins/baidu.tj', ssr: false },
        { src: '@/plugins/vue-cropper', ssr: false },
        { src: '@/plugins/dialog', ssr: false }
    ],
    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/proxy'
    ],
    proxy: {
        '/biunavapi': {
            target: 'http://localhost:3010/', // 代理地址
            changeOrigin: true,
            pathRewrite: {
                '^/biunavapi': '' //将 /api 替换掉
            }
        }
    },
    build: {
        analyze: false,
        maxChunkSize: 300000,
        extend(config, ctx) {
            if (ctx.isDev && ctx.isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                });
            };
        },
        assetFilter: (fname) => fname.endsWith('.js'),
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: false,
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    chunks: 'initial',
                    priority: -10,
                    reuseExistingChunk: false,
                    test: /node_modules\/(.*)\.js/
                },
                styles: {
                    name: 'styles',
                    test: /\.(less|css)$/,
                    chunks: 'all',
                    minChunks: 1,
                    reuseExistingChunk: true,
                    enforce: true
                }
            }
        }

    }
};
