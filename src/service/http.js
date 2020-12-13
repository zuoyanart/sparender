
module.exports = class extends zuoyan.Service {
  constructor() {
    super();
    this.renderS = this.service('render');
    // this.articleM = this.model('test/article');
  }

  async getContent(url) {
    const data = await zyRedis.get(url);
    if (tools.isEmpty(data)) {
      // global.renderLimit++;
      const content = await this.renderS.test(url);
      zyRedis.set(url, content, 'ex', tools.config('redis').ex);
      // global.renderLimit--;
      return (content.replace(/<script[^>]*>[\s\S]*?<\/[^>]*script>/gi, ''));
    } else {
      return (data.replace(/<script[^>]*>[\s\S]*?<\/[^>]*script>/gi, ''));
    }
  }
};

