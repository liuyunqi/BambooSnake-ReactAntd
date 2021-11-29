
export interface recursionDataKeyTransformConf {
  isChildrenKey: string;          // 层级数据字段
  [key: string]: any;
}

export interface recursionDataKeyTransformOpt {
  needDeleteBefore: boolean;      // 是否删除原先数据
}
