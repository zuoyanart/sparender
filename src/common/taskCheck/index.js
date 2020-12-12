const Datastore = require('nedb-promises');
const path = require('path');

module.exports = class {
  constructor(path = '') {
    this.dataSource = Datastore.create(path);
    this.dataSource.persistence.setAutocompactionInterval(1000 * 100); //自动压缩数据库，单位ms，>5000ms
  }

  async init() {
    await this.dataSource.update({
      isexe: 1
    }, {
      '$set': {
        isexe: 0
      }
    }, {
      multi: true
    });
  }
  /**
   * 获取任务信息
   * @param {*} name 
   */
  async start(name) {
    let doc = await this.dataSource.findOne({
      name
    });
    if (tools.isEmpty(doc)) {
      doc = {
        name,
        isexe: 0,
        lasttime: 0,
        create_time: tools.getUnixTime()
      };
      await this.dataSource.insert(doc);
    }
    if (doc.isexe === 0) {
      await this.dataSource.update({
        name
      }, {
        '$set': {
          isexe: 1
        }
      });
    } else {
      logger.warn('[' + name + ']正在执行，此调度将被终止');
    }
    return doc;
  }
  /**
   * 任务结束但未完成
   * @param {*} name 
   */
  async end(name) {
    await this.dataSource.update({
      name
    }, {
      '$set': {
        isexe: 0
      }
    });
  }

  /**
   * 任务完成
   * @param {*} name 
   */
  async finish(name, lasttime = tools.getUnixTime()) {
    await this.dataSource.update({
      name
    }, {
      '$set': {
        isexe: 0,
        lasttime,
      }
    });
  }



};