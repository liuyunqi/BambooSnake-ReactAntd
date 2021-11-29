/**
 * author: dn
 * name: 会过期的存储器
 * desc: 可自定义某个存储于session/ local 中数据期限存储，时间长度可以自定义。
*/

import { accessOverdue_defaultOption, accessOverdue_saveObjectEnum, accesItem } from './type';


export * from './type';
export default class AccessorOverdue {

  public defaultOptions: accessOverdue_defaultOption = {
    projectAlias: 'baseToolAccessOverdue',                            // 命名空间
    saveObject: accessOverdue_saveObjectEnum.sessionStorage,          // 存储对象 'sessionStorage' | 'localStorage'
    overdueTimeSecond: 60                                             // 过期时间 - 1 = 1s (单位/秒) 
  };

  constructor(options: {} = {}) {
    this.defaultOptions = {
      ...this.defaultOptions,
      ...options
    };
  }

  // 获取当前时间戳
  private getDateNumber (): number {
    return new Date().getTime();
  }

  // 获取sessionKey
  private getKeyName (key: string): string {
    return this.defaultOptions.projectAlias + '-' + key;
  }

  // 获取存储对象
  private getAccessObject (TYPE?: accessOverdue_saveObjectEnum) {

    const { saveObject } = this.defaultOptions;
    var result: any;

    switch(saveObject) {
      case accessOverdue_saveObjectEnum.sessionStorage: {
        result = sessionStorage;
      };
      break;
      case accessOverdue_saveObjectEnum.localStorage: {
        result = localStorage;
      }
    }

    return result;
  }

  // 写入存储
  setItem (key: string, data: any) {
    const sKey = this.getKeyName(key);
    const access: Storage = this.getAccessObject();
    const setData: accesItem = {
      creatertime: this.getDateNumber(),
      value: data
    };

    access.setItem(sKey, JSON.stringify(setData));
  }

  // 提取存储
  getItem (key: string, overdueTimeSecond?: number) {
    const sKey = this.getKeyName(key);
    const access: Storage = this.getAccessObject();
    const oTime = overdueTimeSecond || this.defaultOptions.overdueTimeSecond;
    let _isInvalid = false;     // 失效状态
    let getData: accesItem;
    let emptyData = {
      creatertime: 0,
      value: 'undefined'
    };

    try {
      getData = JSON.parse(access.getItem(sKey) as any);
    } catch (err) {
      getData = emptyData;
      _isInvalid = true;
    }

    if (getData === null) {
      getData = emptyData;
      _isInvalid = true;
    }
    
    return {
      isInvalid: (
        _isInvalid ||
        (this.getDateNumber() - getData.creatertime) / 1000) > oTime,
      value: getData
    };
  }

  // 指定删除
  removeItem (keys: string | string[]) {
    const fKeys = Array.isArray(keys) ? keys : [keys];
    const access: Storage = this.getAccessObject();

    fKeys.forEach(key => {
      const sKey = this.getKeyName(key);
      access.removeItem(sKey);
    });
  }
}