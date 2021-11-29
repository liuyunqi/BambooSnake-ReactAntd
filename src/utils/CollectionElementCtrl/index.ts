/**
 * author: dn
 * name: HTML元素集合控制器
 * 
 * desc:
 * 
 * 针对元素对象集合进行遍历操作。
 * 内置索引记录器，可以通过使用指令对其进行遍历，对遍历目标元素进行 Attr 属性赋值（如class、style），对非当前active元素进行清理值。
 * 可结合class.KeywordsContrl的键盘事件搭配使用。
 * 比如：操作一个表格，通过键盘（上下左右）指令在表格的row及td中的元素进行操作。
 * 
 */
import { CollectionElementCtrl_options } from './type';

export default class CollectionElementCtrl {

  private collectionsElements: HTMLTableRowElement[] | Element[] = [];      // 集合
  private indexRecord: number = 0;                // 行索引 - rowIndex
  private columnIndex: number = 0;                // 列索引 - 锁定单元格
  private prevRecordIndex: number | null = null;  // 前一个索引 - 发生indexRecord响应事件改变后 null -> number

  // 默認配置
  defaultOptions = {
    // 当前对象【响应】包含的class - (举例:当前使用的是antd)
    activeClass: 'CollectionElementCtrl-Active',
    // 当前对象【响应】包含的style - (举例:当前使用的是antd)
    activeStyle: 'background-color: #eee;',
    // 当前对象【默认】包含的class - (举例:当前使用的是antd, 某个元素上默认存在的class)
    normalClass: '',
    // 当前对象【默认】包含的style - (举例:当前使用的是antd)     
    normalStyle: '',

    needFoucusHTMLElementInput: true    // 是否聚焦input - 是否需要检查当前 纵及列<td>单元格内是否包含input

  };

  constructor({ collectionsElements, indexRecord, columnIndex, ...options }: CollectionElementCtrl_options = {}) {
    collectionsElements && (this.collectionsElements = collectionsElements);
    indexRecord && (this.indexRecord = indexRecord);
    columnIndex && (this.columnIndex = columnIndex);

    this.defaultOptions = {
      ...options,
      ...this.defaultOptions
    };
  }

  // 日志合集
  console() {
    console.log(this.indexRecord);
    console.log(this.columnIndex);
    console.log(this.collectionsElements);
  }

  // 设置集合元素
  setCollectionsElements(setElementArray: HTMLTableRowElement[] | Element[]) {
    this.collectionsElements = setElementArray;
  }

  // 设置row行索引
  setIndexRecord(n: number) {
    this.indexRecord = n;
    return this;
  }

  // 设置列索引
  setColumnIndex(n: number) {
    this.columnIndex = n;
    return this;
  }

  // 减
  reduce() {
    this.prevRecordIndex = this.indexRecord;

    let index = this.indexRecord - 1;
    if (index < 0) index = 0;
    this.indexRecord = index;

    this.setRowStyle_normal();
    this.setRowStyle_active();
    this.focusInsideInput();
  }

  // 加
  addition() {
    this.prevRecordIndex = this.indexRecord;

    let index = this.indexRecord + 1;
    let maxLen = this.collectionsElements.length > 0 ? this.collectionsElements.length : 0;

    if (maxLen > 0 && index >= maxLen) {  // isMax
      index = maxLen - 1;
    }
    this.indexRecord = index;

    this.setRowStyle_normal();
    this.setRowStyle_active();
    this.focusInsideInput();
  }

  // 设置行样式 - 动作响应
  setRowStyle_active(index?: number) {
    try {
      const tIndex = index || this.indexRecord;
      const activeElement = this.collectionsElements[tIndex];
      const { activeClass, activeStyle } = this.defaultOptions;

      activeElement.setAttribute('class', `${activeClass}`);
      activeElement.setAttribute('style', `${activeStyle}`);

    } catch (err) {
      if (this.collectionsElements.length === 0) {
        console.log('errLog: CollectionElementCtrl, the collectionsElements<Element[]> array is length 0.');
      } else console.log('errLog: CollectionElementCtrl.setRowStyle_active Error.');
    }
  }

  // 设置行样式 - 默认
  setRowStyle_normal(index?: number) {
    try {
      const tIndex = index || this.prevRecordIndex || 0;
      const normalElement = this.collectionsElements[tIndex];
      const { normalClass, normalStyle } = this.defaultOptions;

      normalElement.setAttribute('class', `${normalClass}`);
      normalElement.setAttribute('style', `${normalStyle}`);
      
    } catch (err) {
      if (this.collectionsElements.length === 0) {
        console.log('errLog: CollectionElementCtrl, the collectionsElements<Element[]> array is length 0.');
      } else console.log('errLog: CollectionElementCtrl.setRowStyle_normal Error.');
    }
  }

  // 聚焦内部input
  focusInsideInput(index?: number) {
    const tIndex = index || this.indexRecord;
    const element = this.collectionsElements[tIndex];
    element.children[this.columnIndex].querySelector('input')?.focus();
  }

  // 重置
  clearAllRow() {
    this.collectionsElements.forEach((element: Element, index: number) => {
      this.setRowStyle_normal(index);
    });
  }

}
