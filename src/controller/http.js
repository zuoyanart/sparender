
const http = require('http');
const url = require('url');

module.exports = class extends zuoyan.Controller {
  constructor() {
    super();
    this.routerS = this.service('router');
    global.renderLimit = 0;
  }

  async startServer() {
    const server = http.createServer(async (req, res) => {
      let urlObj = url.parse(req.url, true);
      req.urlObj = urlObj;
      console.log(urlObj, req.url);
      console.log(req.headers['user-agent']);

      //连接关闭事件
      res.on('close', async () => {
        const data = await zyRedis.get(urlObj.href);
        if (data) {
          global.renderLimit--;
          zyRedis.del(urlObj.href);
        }
        // logger.warn('close', req.url);
      });
      this.routerS.router(req, res);
    });


    server.listen(tools.config('port'), function () {
      console.log('服务器启动成功!');
      console.log('正在监听 ' + tools.config('port') + ' 端口');

    });
  }



};

