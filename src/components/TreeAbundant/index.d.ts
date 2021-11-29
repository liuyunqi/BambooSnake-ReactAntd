

// 回调事件枚举
export enum enumEVENTTYPE {
  RADIO_CHANGE = 'RADIO_CHANGE',
  TREE_EXPEND  = 'TREE_EXPEND',
  TREE_CHECKED = 'TREE_CHECKED',
  TREE_SELECT  = 'TREE_SELECT'
}

// 公共回调事件
export interface intfEventHandle {
  (TYPE: enumEVENTTYPE, data: any) : void;           
}

// 切换卡item数据
export interface intfTabsItem {
  label: string;
  value: string;
}

// tree关键结构字段自定义配置
export interface intfDataNodeKeyConf {
  title: string;
  key: string;
  children: string;
}
