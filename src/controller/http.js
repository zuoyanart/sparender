
const http = require('http');
const url = require('url');



module.exports = class extends zuoyan.Controller {
  constructor() {
    super();
    this.httpS = this.service('http');
    global.renderLimit = 0;
    // this.articleM = this.model('test/article');
  }

  async startServer() {
    const server = http.createServer(async (req, res) => {
      try {
        console.log(('limit', global.renderLimit));
        var urlObj = url.parse(req.url, true);
        var query = urlObj.query;
        //连接关闭事件
        res.on('close', () => {
          if (urlObj.pathname === '/render' && query.url) {
            global.renderLimit--;
          }
          logger.warn('close', req.url);
        });
        if (urlObj.pathname === '/render' && query.url) {
          if (global.renderLimit >= tools.config('renderLimit')) {
            this.sendHtml(res, '超出并发限制,请稍后重试');
            return;
          } else {
            global.renderLimit++;
            this.sendHtml(res, await this.httpS.getContent(query.url));
          }
        } else {
          this.sendHtml(res, '请求地址非法');
        }

      } catch (e) {
        logger.error(e);
        this.sendHtml(res, e.message);
      }


    });


    server.listen(tools.config('port'), function () {
      console.log('服务器启动成功!');
      console.log('正在监听 ' + tools.config('port') + ' 端口');

    });
  }


  sendHtml(res, content = '未知错误') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.write(content);
    res.end();
  }


};

