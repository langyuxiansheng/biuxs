const path = require('path'); //路径模块

/**
 * 主配置
 * @description https://www.cnblogs.com/yanguobin/p/11446967.html mac install redis
 */
module.exports = {
    superAdminRoleId: '76FECC8FBBE58239A4220B1B2CB08773', //超级管理员的角色id, 54088
    port: 3010, // default: 3000
    host: '127.0.0.1', // default: '127.0.0.1',
    jwtPublicKey: '5B84C811B758B0C2DE36E481AC95F4DB', //公钥, 加解密jwt使用,建议使用自定义复杂的字符串 jwtPublicKey + saltMD5 加密
    sign: {
        isOpen: !true, //是否启用验签
        signatureKey: 'DFEBAC47B8DD2D803FE2FFADC4990E13', //签名验证私钥key SIGNATUREKEY + saltMD5 加密
        maxAge: 60 * 5 //单位秒
    },
    isNuxtRender: true, //是否启用nuxt渲染 true启用管理后台界面,false 不使用管理后台,只是使用API服务器
    uploadDir: path.join(__dirname, `../public/uploads/tmp`), //上传文件缓存路径,相对于 server.base.config.js 的路径
    staticPath: path.join(__dirname, `../public`), //静态文件路径,相对于 server.base.config.js 的路径
    crawler: {
        isOpen: true, //是否开启爬虫系统
        settimeout: 1 //延时多少s启动
    },
    keys: ['keys', '76FECC8FBBE58239A4220B1B2CB08773'], //设置keys
    saltMD5: '_SERVICE.BIUXS.COM', //md5 加盐的字符,随意更改可能会造成密码错误等.
    filePrefix: 'BIUXS_WEB_', //上传的文件名前缀
    imgCodeCookieKey: '4FE00225AB108B12AE9F5E67582DDF78', //图片验证码cookie key IMG-CODE-VALIDATE-DATA
    emailCodeKey: 'DBD75E91983C8F483FA43E2385FDD88F', //邮件验证码cookie key EMAIL-CODE-VALIDATE-DATA
    email: {
        host: 'smtp.exmail.qq.com', //邮箱服务器地址
        port: 465, //服务器端口 默认 465
        subject: '来自笔优小说的邮件', //主题
        fromUser: '"笔优小说" <admin@biunav.com>', //发送人
        secureConnection: true, //仅安全连接模式
        // 我们需要登录到网页邮箱中，然后配置SMTP和POP3服务器的密码
        auth: {
            user: 'admin@biunav.com',
            pass: 'i5hCh9qu4BFzKWb9'
        }
    },
    sessionConfig: {
        key: `service:76FECC8FBBE58239A4220B1B2CB08773`,
        maxAge: 1000 * 60 * 5, /** cookie 的过期时间 */
        autoCommit: true, /** (boolean) automatically commit headers (default true) */
        overwrite: true, /** (boolean) can overwrite or not (default true) */
        httpOnly: true, /** (boolean) httpOnly or not (default true) */
        signed: true, /** (boolean) signed or not (default true) */
        rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
        renew: false
    },
    redisConfig: {
        prefix: 'BIUXSSESS',
        dataPrefix: 'BIUXSDATA',
        port: 6379,
        host: 'localhost',
        password: '', //biuxs.com
        db: 0,
        ttl: 60 * 60 * 24, //过期时间(默认为24小时)
        options: {}
    },
    dbs: { //数据源配置
        BiuDB: {
            name: 'BiuDB', //ORM中使用的名称 建议和key一样的名称
            type: 'sequelize', //orm类型 类型可选sequelize redis等
            config: {
                username: 'biuxs_db', // 数据库用户名(测试)
                password: '5Fd8JP8YJ64Nzkae', // 数据库密码(测试)
                database: 'biuxs_db', // 数据库名称(测试)
                options: { //配置项
                    dialect: 'mysql', // 数据库类型
                    host: 'cdb-86m6bq78.cd.tencentcdb.com', // 服务器地址
                    port: 10159, // 数据库端口号
                    dialectOptions: { // MySQL > 5.5，其它数据库删除此项
                        charset: 'utf8mb4',
                        supportBigNumbers: true,
                        bigNumberStrings: true
                    },
                    define: {
                        underscored: false, //	转换列名的驼峰命名规则为下划线命令规则
                        freezeTableName: true, //设置为true时，sequelize不会改变表名，否则可能会按其规则有所调整
                        charset: 'utf8mb4',
                        timestamps: false //为模型添加 createdAt 和 updatedAt 两个时间戳字段
                    },
                    pool: {
                        max: 50, // 连接池中最大连接数量
                        min: 0, // 连接池中最小连接数量
                        idle: 10000 // 如果一个线程 10 秒钟内没有被使用过的话，那么就释放线程
                    }
                }
            }
        }
    },
    unlessPath: [ //url白名单 如果不设置默认都是没权限访问的,会返回{code:401}
        /^\/public/, //公共资源
        /^\/uploads/, //公共资源
        /^\/_nuxt/, //nuxt页面
        /^\/login/, //登录
        /^\/favicon.ico/,
        /^\/__webpack_hmr/,
        /^\/System/, //系统设置
        /^\/Home/, //主页
        /^\/Website/, //系统设置
        /^\/Crawlers/, //爬虫系统
        /^\/Member/, //会员中心
        /^\/Book/, //搜索配置
        /^\/403/,
        //api部分
        /^\/v1\/api\/common\/utils\/getImgValidate/, //图片验证码
        /^\/v1\/api\/common\/utils\/getEmailValidateCode/, //邮件验证码
        /^\/v1\/api\/common\/utils\/sendEmail/, //邮件
        /^\/v1\/api\/common\/login\/userLoginForSysAdmin/, //登录接口
        // /^\/v1\/api\/member\/utils\/userRegister/, //用户注册接口
        // /^\/v1\/api\/member\/sendUserRegisterEmailCode/, //用户注册发送邮件验证码接口
        // /^\/v1\/api\/member\/userLogin/, //用户登录接口
        // /^\/v1\/api\/member\/userResetPwd/, //重置密码接口
        // /^\/v1\/api\/member\/sendUserResetPwdEmailCode/, //重置密码发送邮件验证码接口
        /^\/v1\/api\/biuxs\/site/, //site接口面认证
        /^\/v1\/api\/biuxs\/book/ //前端书籍接口面认证
    ],
    signUnlessPath: [ //免签名url白名单 如果不设置会返回{code:400,mag:"签名无需"}
        /^\/public/, //公共资源
        /^\/uploads/, //公共资源
        /^\/_nuxt/, //nuxt页面
        /^\/login/, //登录
        /^\/favicon.ico/,
        /^\/__webpack_hmr/,
        /^\/System/, //系统设置
        /^\/Crawlers/, //爬虫系统
        /^\/Home/ //主页
    ]
};
