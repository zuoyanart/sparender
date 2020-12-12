const path = require('path');
module.exports = class service {
  constructor() {

  }
  /**
 * 
 * @param {*} name 
 * @param {*} config 
 */
  service(name = '', ...args) {
    // console.log(path.join(zuoyan.ROOT_PATH, './model/' + name));
    const s = require(path.join(zuoyan.SRC_PATH, './service/' + name));
    return new s(...args);
  }
  /**
   * 
   * @param {*} name 
   * @param {*} config 
   */
  model(name = '', modelConfig = '') {
    const dataBaseconfig = tools.config('database');
    if (tools.isEmpty(modelConfig)) {
      modelConfig = 'mysql';
    }
    modelConfig = Object.assign(dataBaseconfig[modelConfig], dataBaseconfig.common);
    const m = require(path.join(zuoyan.SRC_PATH, './model/' + name));
    const modePath = name.split('/');
    return new m(modePath[modePath.length - 1], modelConfig);
  }
};