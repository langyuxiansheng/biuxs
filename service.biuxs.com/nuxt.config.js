const pkg = require('./package.json');
module.exports = {
    mode: 'spa', //非单页   //universal
    buildDir: 'nuxt-dist', //打包输出文件夹
    srcDir: 'client/', //设置 Nuxt.js 应用的源码目录
    telemetry: false,
    head: {
        title: pkg.title,
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: pkg.description }
        ],
        link: [
            { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' },
            { rel: 'stylesheet', href: 'https://at.alicdn.com/t/font_1622620_y1qz401ucr.css' }
        ]
    },
    loading: { color: '#fff' },
    css: [
        '@/assets/styles/default-theme/theme/index.css',
        '@/assets/styles/common/reset.css',
        '@/assets/styles/common/theme.default.less'
    ],
    plugins: [
        '@/plugins/element-ui',
        '@/plugins/components',
        '@/plugins/i18n',
        '@/plugins/filters',
        '@/plugins/axios',
        { src: '@/plugins/vue-cropper', ssr: false }
    ],
    modules: [
        '@nuxtjs/axios'
    ],
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
