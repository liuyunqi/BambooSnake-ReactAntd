
// 控件模板类型(antd)
export enum FreeCustomRowLine_ELEMENTTEMP {
  INPUT,             // 输入框 - 普通
  INPUTNUMBER,       // 输入框 - 数字
  AUTOCOMPLETE,      // 输入框 - 自动完成
  SPAN,              // 文本内容
}

// 模板单item配置
export interface templateRowItemConf {
  elementTEMP: FreeCustomRowLine_ELEMENTTEMP;          // 模板类型
  text?: string;                     // 文本
  value?: string | number;           // inputValue -  仅input [select/ input/ textarea/ ...]类型支持
  style?: CSSStyleDeclaration | {};  // 样式
  placeholder?: string;              // 框内描述      - 仅input类型支持
  maxLength?: string | number;       // 最大输入长度  -  仅input类型支持
  apiOptions?: {[x:string]: any}      // antd-ui api
}

// 完整单行描述
export interface templateRows {
  [index: number]: templateRowItemConf | string | JSX.Element;
  length: number;
  callee: Function;
}

// 回调响应事件类型
export enum FreeCustomRowLine_EVENTTYPE {
  INIT  ='INIT',        // 初始化
  INPUT = 'INPUT',      // 输入响应
  ADD   = 'ADD',        // 新增一行
  DELETE = 'DELETE',    // 删除一行
  FOCUS = 'FOCUS',      // INPUT类型聚焦
  BLUR  = 'BLUR'        // INPUT类型失焦
}

// 单行控制按钮
export enum FreeCustomRowLine_LINEBUTTONS {
  DELETE = 'DELETE',        // 删除一行
  LOCK = 'LOCK',            // 锁定一行
  MOVE_UP = 'MOVE_UP',      // 移动数据向上
  MOVE_DOWN = 'MOVE_DOWN'   // 移动数据向下
}

// 单个按钮配置项
export interface LineButtonItem {
  type: FreeCustomRowLine_LINEBUTTONS;        // 按钮类型
  text?: string;            // 按钮文本
  icon?: any;               // maybe 图标
}

// 一行按钮生效配置格式
export type LineButtonSetting = [ boolean, LineButtonItem ];

// 整体按钮生效配置
export interface LineButtons {
  [index: number]: LineButtonSetting;
  length: number;
  callee: Function;
}

// 行序号
export interface LineSort {
  isShow: boolean;                   // 是否显示
  textTemp?: string;                 // 序号内容及替换符模板 '${index}'
  style?: any;  // 样式
}