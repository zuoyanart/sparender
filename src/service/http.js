module.exports = class extends zuoyan.Service {
  constructor() {
    super();
    this.renderS = this.service('render');
    // this.articleM = this.model('test/article');
  }

  async getContent(url, userAgent = '') {
    const isMobile = userAgent && tools.checkMobile(userAgent);
    logger.error('isMobile', isMobile);
    const redisKey = this.formatUrlKey(url, isMobile);

    const data = await zyRedis.get(redisKey);
    if (tools.isEmpty(data)) {
      const content = await this.renderS.test(url, isMobile);
      zyRedis.set(redisKey, content, 'ex', tools.config('redis').ex);
      return (content.replace(/<script[^>]*>[\s\S]*?<\/[^>]*script>/gi, ''));
    } else {
      return (data.replace(/<script[^>]*>[\s\S]*?<\/[^>]*script>/gi, ''));
    }
  }

  formatUrlKey(url, isMobile) {
    if (isMobile) {
      return 'm-' + url;
    }
    return url;
  }
};

