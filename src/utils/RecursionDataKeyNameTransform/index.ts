// 嵌套层级字符替换数据转换函数
/*
  desc: 将对象数组数据进行无限递归转换，替换数据原字段为自定义字段。（且可选是否移除原字段数据）

  @data: [{...}, ...],  // 源数据
  @tranConf: {          // 转换字段配置
    O:N,                // 【O】:old，转换目标字段。【N】:new，更新的定义字段。
    ...
  },
  @options:             // 相关配置
*/
import { recursionDataKeyTransformConf, recursionDataKeyTransformOpt } from './type';


const recursionDataKeyNameTransform =  <T>(
  data: T[],
  tranConf: recursionDataKeyTransformConf = { isChildrenKey: 'children' },
  options: recursionDataKeyTransformOpt = {
    needDeleteBefore: true
  }
): T[] => {

  if (Object.keys(tranConf).length === 1) return data;

  let childrenKey = tranConf[tranConf.isChildrenKey];     // isChildrenKey 中配置的字段的value必须存在于tranConf的key中。
  if (!childrenKey) throw Error('recursionDataKeyNameTransform Function Error: the transformConfig "isChildrenKey" is notfind.');

  let oldKeys = Object.keys(tranConf);
  const { needDeleteBefore } = options;

  // 转换函数
  const trans = (item: any) => {
    // 遍历在册字段
    oldKeys.forEach(oKey => {
      if (oKey === tranConf.isChildrenKey) return;
      let value = item[oKey];
      if (value) {
        item[tranConf[oKey]] = value;
        (needDeleteBefore && oKey!==tranConf[oKey]) && delete item[oKey];
        // needDeleteBefore && delete item[oKey];
      }
    });

    if (item[tranConf.isChildrenKey]) {
      let childrenArr = item[tranConf.isChildrenKey].map((citem: {}) => {
        return trans(citem);
      });
      item[childrenKey] = childrenArr;
      (needDeleteBefore && childrenKey!==tranConf.isChildrenKey) && delete item[tranConf.isChildrenKey];
    }
    return item;
  }

  return JSON.parse(JSON.stringify(data)).map((item: T) => {
    return trans(item);
  });
}

export * from './type';
export default recursionDataKeyNameTransform;