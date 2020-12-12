/**
 * @Author: 左盐 <zuoyan>
 * @Date:   2017-12-03 16:44:45
 * @Email:  huabinglan@163.com
 * @Project: xxxx
 * @Last modified by:   左盐
 * @Last modified time: 2018-06-06 22:57:30
 */

const fs = require('fs-extra'); // fs
const superagent = require('superagent'); // 爬虫
const crypto = require('crypto'); // 加密
const dayjs = require('dayjs'); // 时间处理
const hmacsha1 = require('hmacsha1'); // 时间处理
const empty = require('is-empty');
const BigNumber = require('bignumber.js');

module.exports = class {
  constructor() {

  }
  /**
   * 
   * @param {*} ms 
   */
  sleep(ms) { // 等待一段时间
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  /**
   * 读取文件
   * @method readFile
   * @param  {[type]} filePath 文件路径
   * @return {[Promise]}          [description]
   */
  readJsonFile(filePath) {
    fs.ensureFileSync(filePath);
    try {
      return fs.readJsonSync(filePath);
    } catch (e) {
      return {}; //fs.readFileSync(filePath);
    }
  };
  /**
   * 写入文件
   * @method writeFile
   * @param  {[type]}  filePath [description]
   * @param  {[type]}  data     [description]
   * @return {[type]}           [description]
   */
  writeJsonFile(filePath, data) {
    fs.ensureFileSync(filePath);
    fs.writeJsonSync(filePath, data);
  };
  /**
   * 获取文件字符编码
   * @param {*} filePath
   */
  async checkFileEncode(filePath) {
    let encoding = 'utf81';
    const readable = fs.createReadStream(filePath, {
      encoding: null,
      start: 0,
      end: 30
    });
    readable.on('data', (chunk) => {
      const item1 = chunk[0].toString(16);
      const item2 = chunk[1].toString(16);
      if (item1 === 'ef' && item2 === 'bb') {
        encoding = 'utf8';
      } else if (item1 === 'bf' && item2 === 'cd') {
        encoding = 'GB2312';
      } else {
        encoding = 'GBK';
      }
    });
    readable.on('end', () => {

    });
    await sleep(20);
    return encoding;
  };
  /**
   * http请求
   * @method httpAgent
   * @param  {[type]}  url    [description]
   * @param  {[type]}  method [description]
   * @param  {[type]}  data   [description]
   * @return {[type]}         [description]
   */
  httpAgent(url, method = 'get', data = '') {
    method = method.toLowerCase();
    if (method == 'get' || method == 'del') {
      return new Promise(function (resolve, reject) {
        superagent[method].call(this, url).query(data).end(function (err, res) {
          if (err || !res.ok) {
            reject(err || res.ok);
          }
          resolve(res.body);
        });
      });
    } else {
      return new Promise(function (resolve, reject) {
        superagent[method].call(this, url).send(data).end(function (err, res) {
          if (err || !res.ok) {
            reject(err || res.ok);
          }
          resolve(res.body);
        });
      });
    }
  };
  /**
   * http请求
   * @method httpAgent
   * @param  {[type]}  url    [description]
   * @param  {[type]}  method [description]
   * @param  {[type]}  data   [description]
   * @return {[type]}         [description]
   */
  httpSpider(url, method = 'get', data = '') {
    const startTime = new Date().getTime();
    method = method.toLowerCase();
    if (method == 'get' || method == 'del') {
      return new Promise(function (resolve, reject) {
        superagent[method].call(this, url).timeout({
          response: 60000
        }).query(data).end(function (err, res) {
          if (err || !res.ok) {
            logger.error(url + '--' + JSON.stringify(data) + '--' + err.message);
            reject(err || res.ok);
          }
          const endTime = new Date().getTime();
          // logger.info('http exe time:' + (endTime - startTime) + 'ms');
          try {
            resolve(JSON.parse(res.text));
          } catch (e) {
            resolve(res.text);
          }
        });
      });
    } else {
      return new Promise(function (resolve, reject) {
        superagent[method].call(this, url).timeout({
          response: 60000
        }).send(data).end(function (err, res) {
          if (err || !res.ok) {
            logger.error(err);
            reject(err || res.ok);
          }
          const endTime = new Date().getTime();
          // logger.info('http exe time:' + (endTime - startTime) + 'ms');
          try {
            resolve(JSON.parse(res.text));
          } catch (e) {
            try {
              resolve(res.text);
            } catch (e) {
              console.log('res', res);
              resolve(res.text);
            }
          }
        });
      });
    }
  };
  /**
   * 格式化http参数,组合成字符串的形式
   * @method formatHttpParam
   * @return {[type]}        [description]
   */
  httpParam(param) {
    var s = '';
    for (var key in param) {
      s += key + '=' + param[key] + '&';
    }
    if (s != '') {
      s = s.substring(0, s.length - 1);
    }
    return s;
  };
  /**
   * sha1加密
   * @param str 将加密的字符串
   * @returns {*}
   */
  sha1(str) {
    return crypto.createHash('sha1').update(str).digest('hex');
  };
  /**
   * 生成随机字符串
   * @method randomChar
   * @return {[type]}   [description]
   */
  randomChar(len, charType) {
    const en = 'qwertyioplkjhgfsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM';
    const number = '0123456789';
    const special = '~!@#$%^&*()_+{}[]:<>,.?';
    let x = en + number;
    if (charType == 'number') {
      x = number;
    } else if (charType == 'en') {
      x = en;
    } else if (charType === 'special') {
      x = en + number + special;
    }
    let tmp = '';
    for (var i = 0; i < len; i++) {
      tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
    }
    return tmp;
  };
  /**
   * 格式化：201903011024 这种类型的时间为unix时间戳
   */
  formatStrTime(timeStr) {
    timeStr = timeStr + '';
    const y = timeStr.substring(0, 4);
    const M = timeStr.substring(4, 6);
    const d = timeStr.substring(6, 8);
    const h = timeStr.substring(8, 10);
    const m = timeStr.substring(10, 12);
    const s = timeStr.substring(12, 14);
    const time = y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;
    // logger.warn(timeStr, time, Math.round(new Date(time).getTime() / 1000));
    return Math.round(new Date(time).getTime() / 1000);
  }
  /**
   * 获取unix时间
   * @method
   * @return {[type]} [description]
   */
  getUnixTime() {
    return Math.round(new Date().getTime() / 1000);
  };
  /**
   * 获取字符串长度,却分中英文
   * @method
   * @param  {[type]} str [description]
   * @return {[type]}     [description]
   */
  getCharLen(str) {
    return str.replace(/[^\x00-\xff]/g, 'rr').length;
  };
  /**
   *  生成订单id
   * @param {*} prix
   */
  orderid(prefix = 'OD') {
    return prefix + new Date().getTime() + this.randomChar(3).toUpperCase();
  };
  /**
   * 截取字符串， 区分中英文
   * @param s
   * @param l   长度
   * @param st   补充的结尾字符
   * @returns {*}
   */
  subStr(s, l = 200, st = '') {
    var T = false;
    if (this.getCharLen(s) > l) {
      l -= this.getCharLen(st);
      var S = escape(s);
      var M = S.length;
      var r = '';
      var C = 0;
      for (var i = 0; i < M; i++) {
        if (C < l) {
          var t = S.charAt(i);
          if (t == '%') {
            t = S.charAt(i + 1);
            if (t == 'u') {
              r += S.substring(i, i + 6);
              C += 2;
              i += 5;
            } else {
              r += S.substring(i, i + 3);
              C++;
              i += 2;
            }
          } else {
            r += t;
            C++;
          }
        } else {
          T = true;
          break;
        }
      }
    }
    return T ? unescape(r) + st : s;
  };
  /**
   * 时间格式化，传值为unix时间
   * @method function
   * @param  {[type]} format [description]
   * @return {[type]}        [description]
   */
  formatTime(time = tools.getUnixTime(), format = 'YYYY-MM-DD HH:mm:ss') {
    if (time.toString().length === 13) {
      return dayjs(time).format(format);
    }
    return dayjs.unix(time).format(format);
  };
  /**
   * 
   * @param {*} format 
   */
  toUnixTime(time) { //2018-12-05 02:07:10
    return new Date(time).getTime() / 1000;
  }
  /**
   * 转换value是否是int值，如果不是则用default代替
   * @method
   * @return {[type]} [description]
   */
  getInt(value, def = 0) {
    value = parseInt(value);
    if (isNaN(value) || value == null) {
      return def;
    }
    return parseInt(value);
  };

  getFloat(value, def = 0) {
    value = parseFloat(value);
    if (isNaN(value) || value == null) {
      return def;
    }
    return parseFloat(value);
  };
  /**
   * 去除所有的html代码
   * @param  {[type]} str =             "" [description]
   * @return {[type]}     [description]
   */
  removeHtml(str = '') {
    return str.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '');
  };
  /**
   * 是否是错误对象
   * @param {} value 
   */
  isError(value) {
    switch (Object.prototype.toString.call(value)) {
      case '[object Error]':
        return true;
      case '[object Exception]':
        return true;
      case '[object DOMException]':
        return true;
      default:
        return value instanceof Error;
    }
  }
  /**
   * 
   * @param {*} value 
   */
  isEmpty(value) {
    return empty(value);
  }
  /**
   * 返回状态码等
   */
  stateJson(data = '', code = 200) {
    return {
      code: code,
      data: data
    };
  };

};