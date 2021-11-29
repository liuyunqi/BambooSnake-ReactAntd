// 存取器 - 过期限制
export interface accessOverdue_defaultOption {
  projectAlias: string;
  saveObject: accessOverdue_saveObjectEnum;
  overdueTimeSecond: number;
}

export enum accessOverdue_saveObjectEnum {
  sessionStorage = 'sessionStorage',
  localStorage = 'localStorage'
}

export interface accesItem {
  creatertime: number;    // is Date.getTime()
  value: any;
}