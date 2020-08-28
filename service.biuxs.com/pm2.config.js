const path = require('path');
console.log(path.join(__dirname, './server-dist/index.js'));
module.exports = {
    apps: [{
        name: 'BiuServerAdmin',
        // script: './server/index.js',
        script: path.join(__dirname, './server-dist/index.js'),
        cwd: './',
        // script: 'cross-env NODE_ENV=production nodemon ./server/index.js --exec babel-node',
        watch: ['server'], // 默认关闭watch 可替换为 ['src']
        ignore_watch: ['node_modules', 'build', 'logs', 'client'],
        // out_file: './logs/out.log', // 日志输出
        // error_file: './logs/error.log', // 错误日志
        instance_var: 'INSTANCE_ID',
        max_memory_restart: '2G', // 超过多大内存自动重启，仅防止内存泄露有意义，需要根据自己的业务设置
        env: {
            NODE_ENV: 'production'
        },
        exec_mode: 'cluster', // 开启多线程模式，用于负载均衡
        instances: 'max', // 启用多少个实例，可用于负载均衡
        autorestart: true, // 程序崩溃后自动重启.
        log_date_format: 'YYYY-MM-DD HH:mm:ss'
    }]
};
