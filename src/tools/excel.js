/**
 * @Author: 左盐
 * @Date:   2018-03-05 23:30:57
 * @Email:  huabinglan@163.com
 * @Last modified by:   左盐
 * @Last modified time: 2018-03-06 12:11:27
 */


const path = require('path');
const XLSX = require('xlsx');
const fsExtra = require('fs-extra');
const range = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const rangeArr = range.split('');

module.exports = class {
  /**
   * 格式数据
   * @param  {[type]}  data [description]
   * @return {Promise}      [description]
   */
  formatData(data, column) {
    let json = {};
    json.data = data;
    json.fieldLen = 0;
    json.head = {};
    if (json.data[0]) {
      json.fieldLen = column.length; //Object.keys(json.data[0]).length;
      json.head = this.formatHead(json.data[0], column);
    }

    json.len = json.data.length;
    json.headRange = this.formatHeadRange(json.fieldLen, json.len + 1);

    return json;
  }
  /**
   * 组织范围
   * @type {String}
   */
  formatHeadRange(len, dataLen) {
    let headRange = 'A1:';
    if (len <= 26) {
      headRange += (rangeArr[len - 1] + dataLen);
    } else {
      headRange += (rangeArr[parseInt(len / 26) - 1] + rangeArr[len % 26 - 1] + dataLen);
    }
    return headRange;
  }
  /**
   * 格式化head
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  formatHead(data, column) {
    let head = {};
    let index = 0;
    if (column.length == 0) {
      for (let key in data) {
        if (index > 26) {
          head[rangeArr[parseInt(index / 26) - 1] + rangeArr[index % 26 - 1] + "1"] = key;
        } else {
          head[rangeArr[index] + "1"] = {
            v: key
          };
        }
        index++;
      }
    } else {
      for (let i = 0, len = column.length; i < len; i++) {
        if (index > 26) {
          head[rangeArr[parseInt(index / 26) - 1] + rangeArr[index % 26 - 1] + "1"] = column[i].label;
        } else {
          head[rangeArr[index] + "1"] = {
            v: column[i].label
          };
        }
        index++;
      }
    }
    return head;
  }


  /**
   * 生成excel
   * @return {Promise} [description]
   */
  create(data, column = [], param = {}) {
    let doc = this.formatData(data, column);

    //workbook
    let workbook = {
      SheetNames: ["reports"],
      Sheets: {
        'reports': {
          '!ref': doc.headRange,
        }
      }
    };

    let mySheet1 = Object.assign(workbook.Sheets.reports, doc.head);
    let index = 0;

    for (let i = 0; i < doc.len; i++) {
      index = 0;
      let dataItem = doc.data[i];
      for (let j = 0, len = column.length; j < len; j++) {
        if (index <= 26) {
          mySheet1[rangeArr[index] + (i + 2)] = {
            v: dataItem[column[j].field],
            t: this.formatCell(dataItem[column[j].field])
          }
        } else {
          mySheet1[rangeArr[parseInt(index / 26) - 1] + rangeArr[parseInt(index % 26) - 1] + (i + 2)] = {
            v: dataItem[column[j].field],
            t: this.formatCell(dataItem[column[j].field])
          }
        }
        index++;
      }

      // for (let key in dataItem) {
      //   if (index <= 26) {
      //     mySheet1[rangeArr[index] + (i + 2)] = {
      //       v: dataItem[key],
      //       t: this.formatCell(dataItem[key])
      //     }
      //   } else {
      //     mySheet1[rangeArr[parseInt(index / 26) - 1] + rangeArr[parseInt(index % 26) - 1] + (i + 2)] = {
      //       v: dataItem[key],
      //       t: this.formatCell(dataItem[key])
      //     }
      //   }
      //   index++;
      // }
    }
    let file = param.path + '/'; //path.join(param.path, 'www/xlsx/'); //think.RESOURCE_PATH + '/xlsx/';
    let fileName = param.fileName + '.xlsx';

    fsExtra.ensureDirSync(file);
    XLSX.writeFile(workbook, file + fileName);

    return file + fileName; //返回
  }
  /**
   * 判断单元格格式
   * @param  {[type]}  val [description]
   * @return {Boolean}     [description]
   */
  formatCell(val) { //cell type: b Boolean, n Number, e error, s String, d Date
    let t = 's';
    let v = parseInt(val);
    if (!isNaN(v)) {
      t = 'n';
    }
    return t;
  }

}