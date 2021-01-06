// 载入puppeteer
const puppeteer = require('puppeteer-extra');
const genericPool = require('generic-pool');
const { PendingXHR } = require('pending-xhr-puppeteer');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

module.exports = class extends zuoyan.Service {
  constructor() {
    super();
  }

  /**
* 初始化一个 Puppeteer 池
* @param {Object} [options.puppeteerArgs={}] puppeteer.launch 启动的参数
* @param {Function} [options.validator=(instance)=>Promise.resolve(true))] 用户自定义校验 参数是 取到的一个实例
* @param {Object} [options.otherConfig={}] 剩余的其他参数
* @return {Object} pool
*/
  initPuppeteerPool() {
    if (global.pptPoll) {
      global.pptPoll.drain().then(() => global.pptPoll.clear());
    };
    const options = Object.assign(tools.config('puppeteer'), {
      validator: () => Promise.resolve(true),
    });
    const factory = {
      create: () =>
        puppeteer.launch(options.start).then(instance => {
          // 创建一个 puppeteer 实例 ，并且初始化使用次数为 0
          instance.useCount = 0;
          return instance;
        }),
      destroy: instance => {
        instance.close()
      },
      validate: instance => {
        // 执行一次自定义校验，并且校验 实例已使用次数。 当 返回 reject 时 表示实例不可用
        return options.validator(instance).then(valid => Promise.resolve(valid && (options.maxUses <= 0 || instance.useCount < options.maxUses)));
      }
    };
    const pool = genericPool.createPool(factory, options)
    const genericAcquire = pool.acquire.bind(pool)
    // 重写了原有池的消费实例的方法。添加一个实例使用次数的增加
    pool.acquire = () =>
      genericAcquire().then(instance => {
        instance.useCount += 1
        return instance
      });

    pool.use = fn => {
      let resource;
      return pool
        .acquire()
        .then(r => {
          resource = r;
          return resource;
        })
        .then(fn)
        .then(
          result => {
            // 不管业务方使用实例成功与后都表示一下实例消费完成
            pool.release(resource);
            return result;
          },
          err => {
            pool.release(resource);
            throw err;
          }
        )
    }
    return pool;
  }


  async init() {
    global.pptPoll = this.initPuppeteerPool();
  }

  /**
   * 
   */
  async htmlRender(url = 'http://127.0.0.1:8181/', isMobile = false) {
    // 在业务中取出实例使用
    return await global.pptPoll.use(async instance => {
      return new Promise(async (resolve, reject) => {
        try {
          const page = await instance.newPage();
          //如果是移动端则设置UA和视图
          if (isMobile) {
            let iPhoneX = tools.config('mobileRender');
            await page.setUserAgent(iPhoneX.userAgent);
            // await page.setViewport(iPhoneX.viewport);
          }

          const pendingXHR = new PendingXHR(page);
          // 开启请求拦截, 无头模式下有效
          const blockTypes = ['image', 'media', 'font', 'manifest', 'other', 'texttrack', 'websocket'];
          await page.setRequestInterception(true); //开启请求拦截
          page.on('request', async request => {
            const type = request.resourceType();
            if (blockTypes.indexOf(type) > -1) {
              //直接阻止请求
              return request.abort();
            } else {
              return request.continue({
                headers: Object.assign({}, request.headers(), {
                  'ppt': 'true'
                })
              });
            }
          });
          //响应
          page.on('response', async response => {
            logger.info(await response.url() + ' ' + await response.request().method() + ' ' + await response.status() + ' ' + await response.request().resourceType());
          });
          const timeStart = new Date().getTime();
          try {
            await page.goto(url, {
              // waitUntil: "networkidle0",
              timeout: tools.config('pageTimeout')
            });
          } catch (e) {

          }

          await pendingXHR.waitForAllXhrFinished();
          const html = await page.content();
          logger.warn(url + ' ' + (new Date().getTime() - timeStart) + 'ms');
          page.close();
          resolve(html);
        } catch (e) {
          logger.error(url, e);
          reject(e);
        }

      });
    });

  };
};