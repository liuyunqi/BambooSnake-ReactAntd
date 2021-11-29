import { organizationHierarchyCode } from './type';

// 门店数据筛查 - 介于公司目前请求到的 组织结构数据 并不能完整筛查出纯粹的门店数据。
const transformCompanyTreeData = (treeData: any[], select: string) => {
  let defKey = {
    hierarchy: 'hierarchy',
    children: 'children',
    storeCode: 'storeCode'
  };
  let nodeData: any[] = [];
  treeData.forEach(item => {
    if (item[defKey.hierarchy] === organizationHierarchyCode.department && !item[defKey.children]) return;

    if (item[defKey.children]) {
      item[defKey.children] = transformCompanyTreeData(item[defKey.children], select);
    }

    let isStore = item[defKey.hierarchy] === select && select === organizationHierarchyCode.store;    // 设定层级是门店 且 当前数据是门店
    if (isStore) {
      item.key = item[defKey.storeCode];
    }

    nodeData.push(item);
  });
  return nodeData;
}

export * from './type';
export default transformCompanyTreeData;