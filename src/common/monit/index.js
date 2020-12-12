const blessed = require('blessed');
const contrib = require('blessed-contrib');
const Datastore = require('nedb-promises');
const Nedb = require('./nedb');
const Tools = require('./tools');
const Tail = require('nodejs-tail');
const path = require('path');

class Monit {
  constructor() {
    this.tools = new Tools();
    // this.logTail = 
    ////
    this.screen = blessed.screen({
      fullUnicode: true
    });
    this.grid = new contrib.grid({
      rows: 12,
      cols: 12,
      screen: this.screen
    });
    this.screen.key(['escape', 'q', 'C-c'], function (ch, key) {

      return process.exit(0);
    });
  }

  /**
   * 
   */
  async start() {
    //布局
    this.screen.render();
    //运行状态
    await this.runStatus();
    await this.runLog();
  }
  //运行状态
  async runStatus() {
    let table = this.grid.set(0, 0, 5, 12, contrib.table, {
      keys: true,
      fg: 'white',
      selectedFg: 'white',
      selectedBg: 'blue',
      interactive: true,
      label: 'runtime',
      width: '100%',
      height: '100%',
      border: {
        type: "line",
        fg: "cyan"
      },
      columnSpacing: 1, //in chars,
      columnWidth: [30, 30, 20] /*in chars*/
    });

    table.focus();
    this.screen.append(table)

    setInterval(async () => {
      const nedb = new Nedb();
      const taskList = await nedb.pageAll();
      let tableData = [];
      for (let i = 0, len = taskList.length; i < len; i++) {
        const item = [taskList[i].name, this.tools.formatTime(taskList[i].lasttime, 'MM-DD HH:mm:ss'), taskList[i].isexe === 1 ? 'run' : 'sleep'];
        tableData.push(item);

      }
      table.setData({
        headers: ['name', 'lastTime', 'state'],
        data: tableData
      });
      this.screen.render();
    }, 1000);
  }

  async runLog() {
    const log = this.grid.set(5, 0, 7, 12, contrib.log, {
      fg: "green",
      selectedFg: "green",
      label: 'Runtime Log',
      height: "20%",
      tags: true,
      border: {
        type: "line",
        fg: "cyan"
      }

    });
    this.screen.append(log);
    const tail = new Tail(path.resolve('.', './runtime/logs/app.' + this.tools.formatTime(this.tools.getUnixTime(), 'YYYY-MM-DD') + '.log'));

    tail.on('line', (line) => {
      log.log(line);
    });
    tail.watch();

  }
};

const moint = new Monit();
moint.start();