/**
 * author: dn
 * name: 基础工具函数
 * desc: 常规通用的非业务偏向的辅助工具函数。
*/

import { enumDataMode } from './type';

// Date对象 转换为 时间字符串(多种款)
const dateTransformer = (dt: Date | number, viewMode?: enumDataMode): string => {  // dt= new Date(1823811128时间戳) , viewMode = 显示模式

  if (typeof dt === 'number') {
    dt = new Date(dt);
  }

  let year = dt.getFullYear(),
      month = addZero(dt.getMonth()+1),
      date = addZero(dt.getDate()),
      hour = addZero(dt.getHours()),
      minute = addZero(dt.getMinutes()),
      second = addZero(dt.getSeconds());

  function addZero(numb: number): string | number {
    let rNum: string | number = numb;
    if (numb >= 0 && numb <= 9) rNum = '0' + numb;
    return rNum;
  }

  let dateStr = '';
  
  if (viewMode === enumDataMode.FULL || !viewMode) {
    dateStr = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
  } else if (viewMode === enumDataMode.YMD) {
    dateStr = year + '-' + month + '-' + date;
  } else if (viewMode === enumDataMode.YMDHM) {
    dateStr = year + '-' + month + '-' + date + ' ' + hour + ':' + minute;
  } else if (viewMode === enumDataMode.YMDHMS) {
    dateStr = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
  } else if (viewMode === enumDataMode.HMS) {
    dateStr = hour + ':' + minute + ':' + second;
  } else if (viewMode === enumDataMode.HM) {
    dateStr = hour + ':' + minute;
  }
  return dateStr;
}

// 路径合并, 去除拼接处 多或少的 '/'
const mergeUrl = (arr: string[]): string => {
  let url = '';
  arr.forEach((iur: string, index: number) => {
    let even = iur;
    if (index > 0) {
      let prev = arr[index - 1];
      if (prev[prev.length - 1] === '/' && iur[0] === '/') {
        even = iur.substring(1);
      } else if (prev[prev.length - 1] !== '/' && iur[0] !== '/') {
        even = '/' + iur;
      }
    }
    url += even;
  });
  return url;
}

// 数组转换 - 一维转二维
const ArrayVeidooTransfrom = (
  list = [],            // [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19] --transfer--> [[...], [...], ...]
  mo = 6
) => {
  let resl: any[] = [];
  let ev: any[] = [];

  list.forEach((item, index) => {

    if (index % mo === 0) ev = [];

    ev.push(item);

    if (index % mo === mo -1 || index == list.length -1) resl.push(ev);
  });
  return resl;
}







export * from './type';
export default {
  dateTransformer,
  mergeUrl,
  ArrayVeidooTransfrom,
  // Debounced,
  // Throttle
}
