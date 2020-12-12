const Datastore = require('nedb-promises');
const path = require('path');

module.exports = class {
  constructor() {
    this.dataSource = Datastore.create(path.resolve('.', './src/common/taskCheck/task.db'));
  }

  /**
   * 获取任务信息
   * @param {*} name 
   */
  async pageAll() {
    try {
      let doc = await this.dataSource.find({}).sort({
        'create_time': -1
      });
      return doc;
    } catch (e) {
      return [];
    }
  }

};