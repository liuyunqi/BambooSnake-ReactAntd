import { ColumnsType, ColumnType } from 'antd/es/table';
import { CSSProperties } from 'react';
import { enumDataMode } from '../../utils/BaseTool';


export const customType = 'customType';    // 自定义列项渲染类型 - fix Key

// 自定义的表格列项类型
export enum ColumnCustomType {
  NORMALRENDER = 'NORMALRENDER',  // 默认渲染text
  INPUT = 'INPUT',                // input 输入单框
  LINKBUTTON = 'LINKBUTTON',      // 链接按钮
  DATESTRING = 'DATESTRING',      // date转字符
  TEXTLINESINGLE = 'TEXTLINESINGLE',  // 文本显示单行
  TEXTLINETWO = 'TEXTLINETWO',        // 文本显示2行
}

/* export interface ColumnsTypeMine extends ColumnsType<any> {
    customType?: ColumnCustomType;
} */

interface customSettingsIntef {
  style?: CSSProperties;             // 样式键值对  例 { width: 100, ...}
  isEmptyTempToDefault?: undefined | boolean;    // default is [false/ undefined],  当前值为空时渲染模板是否为它默认的 => ，false - 模板样式, true - '-' (具体参照 - Function emptyReturn)
  dateFormatType?: enumDataMode;      // 显示日期的方式 - 仅生效于日期模板下
}


export interface ColumnsTypeMine extends ColumnsType<any> {
  condition?: [
    boolean | string,
    conditionUnit,
    conditionUnit | [boolean | string, conditionUnit, conditionUnit]
  ] | 
  [
    boolean | string,
    conditionUnit
  ];
  customType?: ColumnCustomType;
  customSettings?: customSettingsIntef;
}

// 全局自定义事件回调
export interface ALLEVENTCallbackType {
  (EVENTTYPE: Enum_ALLEVENT, data: any): void;
}


// 全事件类型枚举
export enum Enum_ALLEVENT {
  // 输入框
  'INPUT_onFocus',
  'INPUT_onChange',
  'INPUT_onPressEnter',
  'INPUT_onBlur',
  // 链接按钮
  'LINKBUTTON_onClick'
}


// 条件单元
export interface conditionUnit {
  customType: ColumnCustomType;           // 自定义的模板枚举TYPE标识
  customSettings?: customSettingsIntef;   // 自定义对【结构】的自由配置处 （例 {style, .... }，根据不同模板使用不同关键值）
  optionsApi?: any;                       // 自定义对【组件】的自由配置处，按组件具体API配置
}


// 表格列重载 - item
export interface rcColumnItem extends ColumnType<any> {
  name: string;
  key?: string;   // is xx enum
  /* customType?: ColumnCustomType;      // 自定义的模板枚举TYPE标识
  customSettings?: any;               // 自定义对【结构】的自由配置处 （例 {style, .... }，根据不同模板使用不同关键值）
  optionsApi?: any;                   // 自定义对【组件】的自由配置处，按组件具体API配置 */

  width?: number | string;
  fixed?: boolean | "left" | "right" | undefined;

  condition?: [
    boolean | string,
    conditionUnit,
    conditionUnit | [boolean | string, conditionUnit, conditionUnit]
  ] | 
  [
    boolean | string,
    conditionUnit
  ];
}

// 表格列重载 - item{conf}
export interface rcColumnItemConf {
  [n: string]: rcColumnItem;
}

// 表格列重载 - must key!
export interface rcColumnItemSet extends rcColumnItem {
  key: string;   // is xx enum
}

// 模板配置函数传参
export interface TABLETEMP_PROPS {
  isItemRender: [boolean, ColumnCustomType];
  reloadApiTable: any;
}

// 事件类型 - 操作栏按钮被点击
export enum enumEventType {
  CALLBACK = 'callback',
  POPCONFIRM = 'popconfirm',
  MODALBOX = 'modalbox'
}

// 结构方式 - 操作栏按钮显示方式
export enum enumViewMode {
  DEFAULT = 'default',
  ICON = 'icon',
  ICONTEXT = 'iconText'
}

// 确认框配置 - modal/ popconfirm
export interface confrimConf {
  title: string;                          // 默认标题
  content: string | JSX.Element | any;    // 内容 TEXT | JSXHTML
  ok: (record: RowData) => void | any;    // 事件 - 确认
  cancel: () => void | any;               // 事件 - 取消
  options?: any;                          // 模态框/ Pop弹窗 官方API （会合并{...}）
}

// 表单行数据
export interface RowData {
  [x: string]: any;
}

// 条件
interface ConditionFace {
  locked?: string | boolean;            // 锁定 - is eval() string
  hide?: string | boolean;              // 隐藏 - is eval() string
  transparent?: string | boolean;       // 占位隐藏 - is eval() string
}

// operation item
export interface sActions {
  text: string;
  icon?: string | ImageData | JSX.Element;
  eventType?: enumEventType;
  eventSubstance?: Function | confrimConf;
  viewMode?: enumViewMode;
  condition?: ConditionFace;
}
