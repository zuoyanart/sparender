/**
 * model
 */
module.exports = class extends zuoyan.Model {
  /**
   *  根据父节点获取所有子节点
   * @method checkUserLogin
   * @param  {[type]}       username [description]
   * @param  {[type]}       password [description]
   * @return {[type]}                [description]
   */
  async page(kw, nodeid, cp, mp) {
    const rows = await this.alias('a').join({
        table: 'node',
        as: 'node',
        join: 'inner',
        on: ['nodeid', 'node.id']
      }).join({
        table: 'user_admin',
        as: 'user',
        join: 'inner',
        on: ['uid', 'id']
      })
      .where({
        'node.nodepath': ['like', '%,' + nodeid + ',%'],
        'title': ['like', '%' + kw + '%']
      }).field('a.*,node.name as nodename,user.username')
      .order('a.id desc')
      .limit((cp - 1) * mp, mp).countSelect();
    return {
      data: rows.data,
      total: rows.count
    };
  }
  /**
   * 获取文章by id
   * @method get
   * @param  {[type]} nodeid [description]
   * @return {[type]}        [description]
   */
  async get(id) {
    const row = await this.where({
      id: id
    }).find();
    return row;
  }
  /**
   * 更新节点
   * @method update
   * @param  {[type]} node [description]
   * @return {[type]}      [description]
   */
  async edit(id, articleInfo) {
    const row = await this.where({
      id
    }).update(articleInfo);
    return row;
  }
  /**
   * 创建文章
   * @method create
   * @param  {[type]} node [description]
   * @return {[type]}      [description]
   */
  async create(article) {
    const id = await this.add(article);
    return id;
  }
  /**
   * 更新审核状态
   * @method pass
   * @param  {[type]} id     [description]
   * @param  {[type]} ispass [description]
   * @return {[type]}        [description]
   */
  async pass(id, ispass) {
    const row = await this.where({
      id: ['IN', id.split(',')]
    }).update({
      pass: ispass,
      update_time: tools.getUnixTime()
    });
    return row;
  }
  /**
   * 删除文章
   * @method del
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  async del(id) {
    const row = await this.where({
      id: ['IN', id.split(',')]
    }).delete();
    return row;
  }
};