module.exports = class extends zuoyan.Service {
  constructor() {
    super();
    this.renderS = this.service('render');
  }
  /***
   * 获取渲染后的内容
   */
  async getRenderContent(href = '', url, userAgent = '') {
    try {
      if (this._checkRenderUrl(url)) {
        if (this._checkRenderLimit()) {
          const isMobile = userAgent && tools.checkMobile(userAgent);
          logger.error('isMobile', isMobile);
          const redisKey = this._formatUrlKey(url, isMobile);

          const data = await zyRedis.get(redisKey);
          if (tools.isEmpty(data)) {
            global.renderLimit++;
            await zyRedis.set(href, 'limit', 'ex', 1000 * 60);
            const content = await this.renderS.test(url, isMobile);
            zyRedis.set(redisKey, content, 'ex', tools.config('redis').ex);
            return (content.replace(/<script[^>]*>[\s\S]*?<\/[^>]*script>/gi, ''));
          } else {
            return (data.replace(/<script[^>]*>[\s\S]*?<\/[^>]*script>/gi, ''));
          }
        } else {
          return 'error:超出并发限制,请稍后重试';
        }
      } else {
        return 'error:渲染的url不合法';
      }
    } catch (e) {
      // logger.error(e);
      return 'error:' + e.message;
    }
  }
  /**
   * check url地址是否合法
   * @param {*} url 
   */
  _checkRenderUrl(url) {
    if (url && /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/i.test(url)) {
      return true;
    }
    return false;
  }
  /**
   * check render并发限制
   */
  _checkRenderLimit() {
    if (global.renderLimit >= tools.config('renderLimit')) {
      return false;
    } else {
      return true;
    }
  }
  /**
   *  格式化redis的key
   * @param {*} url 
   * @param {*} isMobile 
   */
  _formatUrlKey(url, isMobile) {
    if (isMobile) {
      return 'm-' + url;
    }
    return url;
  }
};

