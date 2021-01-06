const mysql = require('think-model-mysql');
module.exports = {
  port: 3001,
  renderLimit: 10,
  pageTimeout: 1000 * 20,
  redis: {
    port: 6379,
    host: '127.0.0.1',
    ex: 60 * 60 * 24 * 7
  },
  mobileRender: {
    name: 'iPhone X',
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
    viewport: {
      width: 375,
      height: 812,
      deviceScaleFactor: 3,
      isMobile: false,
      hasTouch: false,
      isLandscape: false,
    }
  },
  puppeteer: {
    max: 4,//最多产生多少个 puppeteer 实例 。如果你设置它，请确保 在引用关闭时调用清理池。 pool.drain().then(()=>pool.clear())
    min: 1,//保证池中最少有多少个实例存活
    maxUses: 2048,//每一个 实例 最大可重用次数，超过后将重启实例。0表示不检验
    testOnBorrow: true,// 在将 实例 提供给用户之前，池应该验证这些实例。
    autostart: false,//是不是需要在 池 初始化时 初始化 实例
    idleTimeoutMillis: 1000 * 60 * 60,//如果一个实例 60分钟 都没访问就关掉他
    evictionRunIntervalMillis: 1000 * 60 * 3,//每 3分钟 检查一次 实例的访问状态
    start: {
      headless: true,
      devtools: false,
      ignoreHTTPSErrors: true,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        "--disable-xss-auditor",//关闭 XSS Auditor
        '--no-first-run',
        '--no-sandbox',
        '–disable-extensions',
        '--no-zygote',
        '--single-process',
        '--disable-web-security',
        '--blink-settings=imagesEnabled=false',
        '--enable-features=NetworkService',
        '--disable-popup-blocking'
      ]
    }
  },
  database: {
    common: { // 通用配置
      logConnect: true, // 是否打印数据库连接信息
      logSql: true, // 是否打印 SQL 语句
      logger: msg => logger.info(msg) // 打印信息的 logger
    },
    mysql: {
      handle: mysql,
      database: 'cms',
      prefix: 'pz_',
      encoding: 'utf8',
      host: '127.0.0.1',
      port: '',
      user: 'root',
      password: '123456',
      dateStrings: true,
      supportBigNumbers: true,
      bigNumberStrings: true,
      connectionLimit: 10, // 连接池的连接个数，默认为 1
      debounce: false, // 关闭 debounce 功能
    }
  }
};