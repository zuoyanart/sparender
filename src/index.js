const schedule = require('node-schedule');


module.exports = class extends zuoyan.Entry {
  async start(env) {
    //任务列表
    if (env === 'development') {
      const renderS = this.service('render');
      renderS.init();

      const httpC = this.controller('http');
      httpC.startServer();
    } else {
      const renderS = this.service('render');
      renderS.init();

      const httpC = this.controller('http');
      httpC.startServer();
    }
  }
};