
export default {
    mode: 'universal',
    dir: {

    },
    head: {
        title: '笔优小说网-极致的阅读体验',
        meta: [
            { charset: 'utf-8' },
            { 'http-equiv': 'Content-Type', content: 'text/html', charset: 'utf-8' },
            { 'http-equiv': 'X-UA-Compatible', content: 'IE=Edge,chrome=1' },
            { name: 'viewport', content: 'width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0' },
            { name: 'renderer', content: 'webkit' },
            { hid: 'keywords', name: 'keywords', content: `笔优小说网,免费小说,网络小说,最新小说排行,小说阅读器,笔趣阁学习` },
            { hid: 'description', name: 'description', content: `笔优小说网,是一个免费的小说网,此站仅供学习使用,数据素材等来源于网络,版权归原作者所有.` }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'stylesheet', href: '//at.alicdn.com/t/font_1622620_w5sak51tysi.css' }
        ],
        script: [
            { src: './js/autosize.js', type: 'text/javascript', charset: 'utf-8' }
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
        { src: '@/plugins/vue-swiper', ssr: false },
        { src: '@/plugins/dialog', ssr: false }
    ],
    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/proxy',
        '@nuxtjs/style-resources'
    ],
    styleResources: {
        less: [
            './assets/styles/common/constant.less'
        ]
    },
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
        // postcss: [
        //     require("postcss-px2rem")({
        //         remUnit: 37.5
        //     })
        // ],
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
