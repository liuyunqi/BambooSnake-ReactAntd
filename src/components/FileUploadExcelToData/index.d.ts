
 import { RcFile } from 'antd/lib/upload/interface'; 

export interface fileTypeStr {
  override: boolean;    // 是否覆盖
  names: string[];      // 文件类型编码
}

export type onSuccess = ((body: any, xhr: XMLHttpRequest) => void) | undefined;       // antd - Function onSuccess
export type fuetdCallback = (data: { jsonData: any[], excelColumns: string[] }, onSuccess: onSuccess, file: string | Blob | RcFile ) => void;   // 组件回调函数