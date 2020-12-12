const path = require('path');
module.exports = class service {
  constructor() {

  }
  /**
   * 
   * @param {*} name 
   * @param {*} config 
   */
  controller(name = '', ...args) {
    const s = require(path.join(zuoyan.SRC_PATH, './controller/' + name));
    return new s(...args);
  }
  /**
 * 
 * @param {*} name 
 * @param {*} config 
 */
  service(name = '', ...args) {
    const s = require(path.join(zuoyan.SRC_PATH, './service/' + name));
    return new s(...args);
  }
};