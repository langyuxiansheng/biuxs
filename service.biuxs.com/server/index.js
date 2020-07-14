const path = require('path');
const ROOT_PATH = path.join(__dirname, '../');
const SRC_PATH = path.join(__dirname, `./src`);
//映射目录别名
require('best-require')(ROOT_PATH, {
    root: ROOT_PATH,
    src: SRC_PATH,
    controllers: path.join(SRC_PATH, '/controllers'),
    models: path.join(SRC_PATH, '/models'),
    routes: path.join(SRC_PATH, '/routes'),
    crawlers: path.join(SRC_PATH, '/crawlers'),
    services: path.join(SRC_PATH, '/services'),
    middleware: path.join(SRC_PATH, '/middleware'),
    lib: path.join(SRC_PATH, '/lib'),
    config: path.join(SRC_PATH, '/config'),
    logs: path.join(SRC_PATH, '/logs')
});
//运行服务
require('./src/bin/Server').run();
