module.exports = class extends zuoyan.Model {
  get tableName() {
    return 'pz_user';
  }

  /**
   * 获取列表
   * @param  {[type]}  kw [description]
   * @param  {[type]}  cp [description]
   * @param  {[type]}  mp [description]
   * @return {Promise}    [description]
   */
  async page(kw = '', cp = 1, mp = 30) {
    let where = '1=1';
    if (!tools.isEmpty(kw)) {
      where = {
        name: ['like', '%' + kw + '%'],
      };
    }
    const rows = await this.where(where)
      .order('id desc')
      .limit((cp - 1) * mp, mp).select();
    return rows;
  }

  /**
   * 获取列表
   * @param  {[type]}  kw [description]
   * @param  {[type]}  cp [description]
   * @param  {[type]}  mp [description]
   * @return {Promise}    [description]
   */
  async pageByPid(pid = '', cp = 1, mp = 30) {
    let where = {
      pid
    };
    const rows = await this.where(where)
      .order('sort desc,id desc')
      .select();
    return rows;
  }
  /**
   * 创建
   * @method create
   * @param  {[type]} node [description]
   * @return {[type]}      [description]
   */
  async create(json) {
    if (tools.isEmpty(json.create_time)) {
      json.create_time = tools.getUnixTime();
    }
    const id = await this.add(json);
    return id;
  }

  /**
   * 获取
   * @method get
   * @param  {[type]} nodeid [description]
   * @return {[type]}        [description]
   */
  async get(id) {
    const row = await this.where({
      id
    }).find();
    return row;
  }
  /**
   *
   * @param  {[type]}  json [description]
   * @return {Promise}      [description]
   */
  async edit(id, json) {
    if (tools.isEmpty(json.update_time)) {
      json.update_time = tools.getUnixTime();
    }
    const row = await this.where({
      id
    }).update(json);
    return row;
  }
  /**
   * 删除
   * @param  {[type]}  id [description]
   * @return {Promise}    [description]
   */
  async del(id) {
    const row = await this.where({
      id
    }).delete();
    return row;
  }


};