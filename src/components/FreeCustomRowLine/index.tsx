import React, { useState, useEffect } from 'react';
import { Button, Input, AutoComplete, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
// import { useCallbackState } from '@/public/utils/hookCallback';
import { FreeCustomRowLine_ELEMENTTEMP, FreeCustomRowLine_EVENTTYPE, FreeCustomRowLine_LINEBUTTONS, LineButtons, LineButtonItem, LineButtonSetting, LineSort, templateRows, templateRowItemConf } from './index.d';

import styles from './index.less';

let eventType: FreeCustomRowLine_EVENTTYPE = FreeCustomRowLine_EVENTTYPE.INIT;


let defLineButtonsConfig = {
  [FreeCustomRowLine_LINEBUTTONS.DELETE]: {
    type: FreeCustomRowLine_LINEBUTTONS.DELETE,
    text: '删除'
  },
  [FreeCustomRowLine_LINEBUTTONS.LOCK]: {
    type: FreeCustomRowLine_LINEBUTTONS.LOCK,
    text: '锁定'
  },
  [FreeCustomRowLine_LINEBUTTONS.MOVE_UP]: {
    type: FreeCustomRowLine_LINEBUTTONS.MOVE_UP,
    text: '向上移动'
  },
  [FreeCustomRowLine_LINEBUTTONS.MOVE_DOWN]: {
    type: FreeCustomRowLine_LINEBUTTONS.MOVE_DOWN,
    text: '向下移动'
  }
}


interface IProps {
  templateRow: templateRows;           // 渲染模板参与内容，确定单行渲染模板         
  lineSort?: LineSort;                 // 行配置
  lineButtons?: LineButtons;           // 单行控制按钮组
  callback?: (EVENTTYPE: FreeCustomRowLine_EVENTTYPE, data: any) => void;    // 组件回调函数
}

const module: React.FC<IProps> = ({
  templateRow = [],

  lineSort = {
    isShow: true,
    textTemp: '条件$[index]：',
    style: {
      width: 65,
      textAlign: 'left'
    }
  },

  lineButtons = [
    // 示例 [ true, { type: FreeCustomRowLine_LINEBUTTONS.DELETE, text: '删除'}],
    [true, { type: FreeCustomRowLine_LINEBUTTONS.DELETE }],
    [false, { type: FreeCustomRowLine_LINEBUTTONS.LOCK }],
    [false, { type: FreeCustomRowLine_LINEBUTTONS.MOVE_UP }],
    [false, { type: FreeCustomRowLine_LINEBUTTONS.MOVE_DOWN }],
  ],

  callback,
  ...props
}) => {

  const [allLineDatas, setAllLineDatas] = useState<any[]>([]);    // 所有行响应数据合集
  const [elmRows, setElmRows] = useState<any[]>([]);            // 所有行渲染
  const [isAddLine, setIsAddLine] = useState(0);                // 新增一行每次更新

  useEffect(() => {
    // initMatrixAdvance();
    toCallback(eventType, { allLineDatas });
  }, ['init']);

  useEffect(() => {
    forEachRenderRows();
  }, [allLineDatas]);

  // 通用事件回归
  const commonEvent_handle = (TYPE: FreeCustomRowLine_EVENTTYPE, e: React.ChangeEvent<HTMLInputElement>, [rowIndex, valIndex, rcIndex]: number[]) => {
    if (FreeCustomRowLine_EVENTTYPE.INPUT === TYPE) {
      inputChange_handle(e, [rowIndex, valIndex, rcIndex]);
    }
  }

  // 输入事件
  const inputChange_handle = (e: React.ChangeEvent<HTMLInputElement>, [rowIndex, valIndex, rcIndex]: number[]) => {

    eventType = FreeCustomRowLine_EVENTTYPE.INPUT;

    let value = e.target.value;

    allLineDatas[rowIndex][valIndex] = { value };

    let setAlldata = JSON.parse(JSON.stringify([...allLineDatas]));

    setAllLineDatas(() => setAlldata);

    setElmRows((prev) => {
      return prev;
    });

    toCallback(eventType, { allLineDatas: setAlldata, rowIndex, valIndex, value });
  }

  // input [数字类型] 输入框
  const inputNumberChange_handle = (value: number | string | null, [rowIndex, valIndex, rcIndex]: number[]) => {
    eventType = FreeCustomRowLine_EVENTTYPE.INPUT;

    allLineDatas[rowIndex][valIndex] = { value };

    let setAlldata = JSON.parse(JSON.stringify([...allLineDatas]));

    setAllLineDatas(() => setAlldata);

    setElmRows((prev) => {
      return prev;
    });
    toCallback(eventType, { allLineDatas, rowIndex, valIndex, value });
  }

  // 聚焦
  const inputFocus_handle = (e: React.ChangeEvent<HTMLInputElement>, [rowIndex, valIndex, rcIndex]: number[]) => {
    eventType = FreeCustomRowLine_EVENTTYPE.FOCUS;
    toCallback(eventType, { allLineDatas, rowIndex, valIndex });
  }

  // 失焦
  const inputBlur_handle = (e: React.ChangeEvent<HTMLInputElement>, [rowIndex, valIndex, rcIndex]: number[]) => {
    eventType = FreeCustomRowLine_EVENTTYPE.BLUR;
    toCallback(eventType, { allLineDatas, rowIndex, valIndex });
  }



  // 回调
  const toCallback = (EVENTTYPE: FreeCustomRowLine_EVENTTYPE, data: any) => {
    callback && callback(EVENTTYPE, data);
  }

  // 循环行
  const forEachRenderRows = () => {
    setElmRows(prev => []);
    allLineDatas.forEach((item, index: number) => {
      addLineFill(index);
    });
  }

  // 新增一行Click
  const add_handle = () => {
    eventType = FreeCustomRowLine_EVENTTYPE.ADD;
    initTempValuesAdvance();
  }

  // 单行 - 全按钮事件
  const lineAllButton_handle = (buttonType: FreeCustomRowLine_LINEBUTTONS, rowIndex: number, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (FreeCustomRowLine_LINEBUTTONS.DELETE === buttonType) {
      delete_handle(e, rowIndex);
    }
  }

  // 删除一行Click
  const delete_handle = (e: React.MouseEvent<HTMLElement, MouseEvent>, rowIndex: number) => {
    eventType = FreeCustomRowLine_EVENTTYPE.DELETE;
    allLineDatas.splice(rowIndex, 1);

    setAllLineDatas((prev) => {
      return [...allLineDatas];
    });

    toCallback(eventType, { allLineDatas, rowIndex });
  }

  // 集合填充
  const addLineFill = (rowIndex: number) => {
    let creatRow = creatJSXelementRow(rowIndex);
    setElmRows(prev => [...prev, creatRow]);
  }

  // 调用模板
  const callTemp = (tempType: FreeCustomRowLine_ELEMENTTEMP, { text, ...props }: any): JSX.Element => {
    switch (tempType) {
      case FreeCustomRowLine_ELEMENTTEMP.INPUT:
        return <Input {...props} />
      case FreeCustomRowLine_ELEMENTTEMP.AUTOCOMPLETE:
        return <AutoComplete {...props} />
      case FreeCustomRowLine_ELEMENTTEMP.INPUTNUMBER:
        return <InputNumber {...props} />
      case FreeCustomRowLine_ELEMENTTEMP.SPAN:
      default: {
        let setProps: any = {};
        props.style && (setProps.style = props.style);
        return <span className={styles.lineSpan} {...setProps}>{text || '-'}</span>
      }
    }
  }

  // 元素模板
  /**
   * @param arg1     配置类型
   * @param rcIndex  当前一行的数据下标（不重要）
   * @param valIndex 当前需存储value的有效下标（重要）
  */
  const elementTempRender = ({ elementTEMP, placeholder = '', maxLength = undefined, text = '', style = {}, apiOptions = {} }: templateRowItemConf, rowIndex: number, rcIndex: number, valIndex: number) => {

    let attrProps: any = {      // 元素属性集合
      ...apiOptions,
      key: String(rowIndex) + '-' + rcIndex,
      value: allLineDatas[rowIndex][valIndex]['value'],
      text
    };

    style && (attrProps['style'] = style);

    if (elementTEMP === FreeCustomRowLine_ELEMENTTEMP.INPUT || elementTEMP === FreeCustomRowLine_ELEMENTTEMP.INPUTNUMBER || elementTEMP === FreeCustomRowLine_ELEMENTTEMP.AUTOCOMPLETE) {
      // bind attr
      placeholder && (attrProps['placeholder'] = placeholder);
      maxLength && (attrProps['maxLength'] = maxLength);

      // bind eventHandle

      attrProps['onFocus'] = (e: React.ChangeEvent<HTMLInputElement>) => inputFocus_handle(e, [rowIndex, valIndex, rcIndex]);
      attrProps['onBlur'] = (e: React.ChangeEvent<HTMLInputElement>) => inputBlur_handle(e, [rowIndex, valIndex, rcIndex]);

      if (elementTEMP === FreeCustomRowLine_ELEMENTTEMP.INPUT || elementTEMP === FreeCustomRowLine_ELEMENTTEMP.AUTOCOMPLETE) {
        attrProps['onChange'] = (e: React.ChangeEvent<HTMLInputElement>) => inputChange_handle(e, [rowIndex, valIndex, rcIndex]);
      }

      if (elementTEMP === FreeCustomRowLine_ELEMENTTEMP.INPUTNUMBER) {
        attrProps['onChange'] = (value: number | string | null) => inputNumberChange_handle(value, [rowIndex, valIndex, rcIndex]);
      }

      if (elementTEMP === FreeCustomRowLine_ELEMENTTEMP.AUTOCOMPLETE) {
        attrProps['onSearch'] = (e: React.ChangeEvent<HTMLInputElement>) => inputFocus_handle(e, [rowIndex, valIndex, rcIndex]);
        attrProps['onSelect'] = (e: React.ChangeEvent<HTMLInputElement>) => inputBlur_handle(e, [rowIndex, valIndex, rcIndex]);
      }
    }

    return callTemp(elementTEMP, attrProps);
  }

  // 初始化数据矩阵
  const initMatrixAdvance = () => {
    let fillArr: any[] = [];

    for (let row = 0; row < 100; row++) {
      fillArr[row] = [];
      for (let col = 0; col < 25; col++) {
        fillArr[row][col] = { value: '' };
      }
    }

    setAllLineDatas(() => fillArr);
  }

  // 预先填充，数据节点占位
  const initTempValuesAdvance = () => {
    let rowValues: any[] = [];         // 单行数据

    // 确认模板所以value数据下标, 每次都执行或首次init执行一次
    (templateRow as any).map((item: templateRowItemConf | string, rcIndex: number) => {
      if (typeof item === 'object') {             // 当类型为配置类型 - 元素/组件 非字符
        let { elementTEMP, value, apiOptions } = item;

        if (
          elementTEMP === FreeCustomRowLine_ELEMENTTEMP.INPUT ||
          elementTEMP === FreeCustomRowLine_ELEMENTTEMP.AUTOCOMPLETE ||
          elementTEMP === FreeCustomRowLine_ELEMENTTEMP.INPUTNUMBER
        ) {
          let setValue = { value: (apiOptions && apiOptions.value) || value || '' };     // 获取是否有默认参数配置
          rowValues.push(setValue);
        }
      }
    });

    let setAlldata = [...allLineDatas, rowValues];

    setAllLineDatas(prev => setAlldata);

    toCallback(eventType, { prevAllLineDatas: allLineDatas, allLineDatas: setAlldata });
  }

  // 创建行间结构
  const creatJSXelementRow = (rowIndex: number) => {
    let domHTML: any[] = [];    // 单行渲染结构
    let iputIndex = 0;
    // JSX.Element 构造
    (templateRow as any).map((item: templateRowItemConf | string, rcIndex: number) => {
      let setElement: JSX.Element | string;       // 行间每个split 节点

      if (typeof item === 'object') {             // 当类型为配置类型 - 元素/组件 非字符
        setElement = elementTempRender(item, rowIndex, rcIndex, iputIndex);
        iputIndex++;
      } else {
        setElement = item;
      }
      domHTML.push(setElement);
    });
    return domHTML;
  }

  // 生成单行的单个按钮
  const creatLineButton = ({ type, text }: LineButtonItem, rowIndex: number, bIndex: number) => {
    return <Button type="link" key={bIndex} onClick={(e) => lineAllButton_handle(type, rowIndex, e)}>
      {text || defLineButtonsConfig[type].text}
    </Button>
  }

  // 创建排序标题
  const creatSortName = (index: number) => {
    return lineSort.textTemp?.replace('$[index]', String(index));
  }

  return (
    <div className={styles.wrapper}>
      {
      // 示例：参考单行模板
      /*
      <div className={ styles.lineBox }>
        <span className={ styles.lineSort }>条件一：</span>
        <div className={ styles.lineContent }>
          整单满
          <Input placeholder="价格" style={ { width: 100 } } onChange={ (e) => someEvent_handle(e) } />
          元，
          赠送
          <Input placeholder="搜索商品" style={ { width: 200 } } onChange={ (e) => someEvent_handle(e) } />，
          <Input placeholder="数量" style={ { width: 100 } } onChange={ (e) => someEvent_handle(e) } />
        </div>
        <div className={ styles.lineCtrlBox }>
          <Button type="link">
            删除
          </Button>
        </div>
      </div> */}

      {
        elmRows.map((telment, index) => {
          return <div className={styles.lineBox} key={`line-${index}`}>
            {
              lineSort.isShow && <span className={styles.lineSort} style={({ ...lineSort.style } || {})}>{creatSortName(index + 1)}</span>
            }
            <div className={styles.lineContent}>
              {
                telment
              }
            </div>
            <div className={styles.lineCtrlBox}>

              {
                lineButtons.map((bitem: LineButtonSetting, bIndex: number) => {
                  if (bitem[0]) {
                    return creatLineButton(bitem[1], index, bIndex);
                  } else return '';
                })
              }
              {/* <Button type="link" onClick={ (e) => delete_handle(e, index) }>
                删除
              </Button> */}
            </div>
          </div>
        })
      }
      <div className={styles.codeCtrlLineBox}>
        <Button type="link" icon={<PlusOutlined />} onClick={add_handle} style={{ paddingLeft: 0 }}>
          增加条件
        </Button>
      </div>
    </div>
  );
}
// export { FreeCustomRowLine_ELEMENTTEMP, FreeCustomRowLine_EVENTTYPE, FreeCustomRowLine_LINEBUTTONS } from './index.d';
export * from './index.d';
export default module;