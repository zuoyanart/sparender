module.exports = class extends zuoyan.Service {
  constructor() {
    super();
    this.httpS = this.service('http');
  }
  /**
   * 路由
   */
  async router(req, res) {
    try {
      let result = '';

      const pathName = req.urlObj.pathname;
      switch (pathName) {
        case '/render':
          req.urlObj.query.url = decodeURIComponent(req.urlObj.query.url || '');
          console.log(req.urlObj.href, req.urlObj.query.url);
          result = await this.httpS.getRenderContent(req.urlObj.href, req.urlObj.query.url, req.headers['user-agent']);
          break;
        default:
          const tUrl = decodeURIComponent(req.urlObj.href.substring(1));
          console.log('tUrl', tUrl);
          result = await this.httpS.getRenderContent(req.urlObj.href, tUrl, req.headers['user-agent']);
          break;
      }

      this._sendResponseHtml(res, result);
    } catch (e) {
      // logger.error(e);
      this._sendResponseHtml(res, e.message);
    }
  }

  //发送html响应
  _sendResponseHtml(res, content = 'error:未知错误') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.write(content);
    res.end();
  }


};

