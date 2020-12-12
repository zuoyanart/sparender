const Tools = require('./tools');
const Logger = require('./logger/logger');
const path = require('path');
const Model = require('think-model/lib/model');
const Service = require('./service.js');
const Controller = require('./controller');
const Entry = require('./entry');
const taskCheck = require('./taskCheck/index');
const Redis = require('ioredis');



async function start(env) {
  global.tools = new Tools(env); //注册全局helper函数
  global.logger = new Logger(env); //注册全局日志函数
  global.taskCheck = new taskCheck(path.resolve(__dirname, '../../src/common/taskCheck/task.db'));
  if (tools.config('redis')) {
    global.zyRedis = new Redis(tools.config('redis'));
  }
  global.zuoyan = {
    env,
    ROOT_PATH: path.resolve(__dirname, '../../'),
    RUNTIME_PATH: path.resolve(__dirname, '../../runtime'),
    SRC_PATH: path.resolve(__dirname, '../../src'),
    db: {},
    Model,
    Service,
    Controller,
    Entry
  };
  // const load = require('./common/loader');
  // const loader = new load();
  // loader.loadMysql(env);

  //所有的任务调度状态被重置为待执行
  await global.taskCheck.init();

  try {
    const Index = require('../index');
    const index = new Index(env);
    await index.start(env);
  } catch (e) {
    logger.error(e);
  }
};

const App = {
  start
};

module.exports = App;