/**
 * excel导入配置项
 */
export interface ExcelConfig {
  file: any;            // 文件对象 必填
  columns: column[];    // 有效字段列组 (该处cnKey匹配的内容将会被转换成配置的key及对应的数据格式)
  sheet?: number;       // 读取的excel sheet名字 可选
  startIndex?: Number;  // 开始校验行 可选
  max?: number;         // 最大行数默认500 可选
  warn?: number;        // 预警行数默认500 可选
  isDebugger?: boolean; // 是否开启调试模式，开启会打印警告信息 可选
  mimeType?: Array<string>; // 文件类型
}

// 规则枚举
export enum ExcelRule {
  NUMBRE = "number",        // 整数
  MOBILE = "mobile",        // 手机
  IDCARD = "idcard",        // 身份证
  NUMERIC = "numeric",      // 小数
  NOT_EMPTY = "not_empty",  // 非空值
  CUSTOMER = "customer",    // 自定义验证
}

// 列类型枚举
export enum ExcelType {
  NUMBRE = "number",        // 整数
  STRING = "string",        // 字符串
  BOOLEAN = "boolean",      // 布尔
  DATE = "date",            // 日期 年月日格式
  DATETIME = "dateTime",    // 年月日时分秒格式
  TIME = "time",            // 时间格式
  FLOAT = "float",          // 小数
}

/**
 * rule 规则类型
 */
export type rule = {
  type: ExcelRule | string;   // 校验类型
  msg: string;                // 错误消息
  valid?: (data: any) => boolean; // 自定义验证函数 可选
};

/**
 * column数据格式
 */
interface column {
  key: string;      // excel列头字段，比如商品编码
  toKey?: string;   // 列头字段需要转换成的字段，比如goodCode 可选
  rules?: rule[];   // 校验规则可选
  type?: ExcelType;
}