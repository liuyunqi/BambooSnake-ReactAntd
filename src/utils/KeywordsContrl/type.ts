// 按键代码
export enum keywordsContrl_keyCode {
  top = 38,
  bottom = 40,
  left = 37,
  right = 39,
  enter = 13
}

// 事件类型定义
export enum keywordsContrl_eventType {
  prev = 'prev',
  next = 'next',
  top  = 'top',
  right = 'right',
  bottom = 'bottom',
  left = 'left',
  enter = 'enter',
  focus = 'focus',
  blur = 'blur',
  tableIsReady = 'tableIsReady',
  init = 'init'
}

// 状态定义
export enum keywordsContrl_state {
  isFocus = 'isFocus',

}

// 基本配置定义
export interface keywordsContrl_defaultOptions {
  [str: string]: any;
}