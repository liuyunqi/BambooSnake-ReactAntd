import React, { ReactElement } from 'react';
import { Modal, Popconfirm } from 'antd';
import { rcColumnItemConf, rcColumnItemSet, enumEventType, enumViewMode, confrimConf, RowData, sActions } from './index.d';
import styles from './creator.less';

/*
  应用场景说明：

  事件类型 - 
  
  callback适用于所有场景，modal及popconfirm适用于一些简单的显示方式，例若是复杂的modal建议走callback，与具体业务页面进行定制重写；

*/


// 操作渲染
export const ColumnRender_operationAction = (text: string, record: RowData, index: number, actions: sActions[]): JSX.Element => {

  // console.log('===<>>record', record);
  // console.log('===<>>text', text);

  let insetDom: JSX.Element[] = [];

  // 分配
  const allocation = (eventType: enumEventType, eventSubstance: Function | confrimConf) => {

    if (eventType === enumEventType.CALLBACK) {
      (eventSubstance as Function)(record);
    } else {
      let { title, content, ok, cancel } = eventSubstance as confrimConf;

      if (eventType === enumEventType.MODALBOX) {
        creatModal({ title, content, ok, cancel });
      } else if (eventType === enumEventType.POPCONFIRM) {
        // antd HTML bind
      }
    }
  }

  // 模态确认框
  const creatModal = ({ title, content, ok, cancel }: confrimConf) => {
    Modal.confirm({
      title,
      content,
      onOk() {
        ok(record);
      },
      onCancel() {
        cancel();
      }
    });
  }

  // 气泡确认框
  const creatPopconfirm = (xHtml: JSX.Element, _index: number, { title, content, ok, cancel }: confrimConf): JSX.Element => {
    return (
      <Popconfirm
        placement="topRight"
        title={ title }
        onConfirm={() => ok(record)}
        onCancel={() => cancel()}
        okText={'是'}
        cancelText={'否'}
        key={ _index }
      >
        { xHtml }
      </Popconfirm>
    );
  }

  // btn.style class
  const buttonStyleSetClass = ({ isLocked, isHide, isTransparent }: {[x:string]: boolean}): string => {
    let setStyle = '';
    if (isHide) {
      setStyle = styles.actionStateHide;
    } else if (isTransparent) {
      setStyle = styles.actionStateTransparent;
    } else if (isLocked) {
      setStyle = styles.actionStateLocked;
    }

    return `${styles.operationButton} ${setStyle}`;
  }

  // render actions
  actions.forEach((_item: sActions, _idx: number) => {

    const {
      text,
      icon,
      eventType = enumEventType.CALLBACK,
      eventSubstance,
      viewMode,
      condition
    } = _item;

    let btn: JSX.Element | null = null;
    let isLocked: boolean = false;
    let isHide: boolean = false;
    let isTransparent: boolean = false;
    // let isEventType: enumEventType | null = null;

    if (!eventSubstance) throw Error('操作单项的事件资产配置必须存在，请编码人员补齐。(components/Table/creator.tsx - eventSubstance)');

    // 渲染类型 锁定、占位隐藏、隐藏
    if (
      condition &&
      JSON.stringify(condition) !== '{}' &&
      (condition.locked || condition.hide || condition.transparent)
    ) {
      const { locked, hide, transparent } = condition;

      if (locked) isLocked = eval(locked as string);
      if (hide) isHide = eval(hide as string);
      if (transparent) isTransparent = eval(transparent as string);
    }

    // 根据状态得出classString
    let getButtonStyleClass: string = buttonStyleSetClass({ isLocked, isHide, isTransparent });
    // 事件阻断
    let stopExecute: boolean = isLocked || isTransparent;

    // 渲染类型
    if (!viewMode || viewMode === enumViewMode.DEFAULT) {

      btn = <a
        className={ getButtonStyleClass }
        onClick={
          () => !stopExecute && allocation(eventType, eventSubstance)
        }
        key={ _idx }>
          { text }
      </a>;

    } else if (viewMode === enumViewMode.ICON) {

      btn = <div
        className={ getButtonStyleClass }
        onClick={
          () => !stopExecute && allocation(eventType, eventSubstance)
        }
        title={ text }
        key={ _idx }
      >
        <i className={ styles.operationIcon }>{ icon }</i>
      </div>;

    } else if (viewMode === enumViewMode.ICONTEXT) {

      btn = <div
        className={ getButtonStyleClass }
        onClick={
          () => !stopExecute && allocation(eventType, eventSubstance)
        }
        key={ _idx }
      >
        <i className={ styles.operationIcon }>{ icon }</i>
        <a className={ styles.operationText }>{ text }</a>
      </div>;
    }

    // 气泡确认模式 - 由受限于 antd 的 jsxhtml 结构要求。（无法脚本api调用）
    if (eventType === enumEventType.POPCONFIRM && btn && !stopExecute) {
      btn = creatPopconfirm(btn as JSX.Element, _idx, eventSubstance as confrimConf);
    }

    insetDom.push(btn as JSX.Element);
  });

  return (
    <div>
      {
        insetDom.map(item =>
          item
        )
      }
    </div>
  )
}

// 数据合并
export const columnItemMerge = (settings: rcColumnItemSet) => {
  const { key, name } = settings;
  return {
    ...settings,
    title: name,
    dataIndex: key
  }
}

// column-item 补齐填充函数
export const columnItemDecorator = (configJSON: rcColumnItemConf, KEYS?: any) => {
  let columnsConf: any = {};

  for (let key in configJSON) {
    let cItem = columnItemMerge({
      //key: (KEYS ? KEYS[key] : key),
      key,
      ...configJSON[key]
    });
    columnsConf[key] = cItem;
  }

  return columnsConf;
}