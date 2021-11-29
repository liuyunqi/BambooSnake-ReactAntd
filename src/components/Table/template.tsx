/*
  自由配置表格模板；
  column里无需配置事件函数，这里会根据必备函数按定制化方式提前编写好；
*/
import React from 'react';
import { Input } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ColumnsTypeMine, ColumnCustomType, customType, conditionUnit, TABLETEMP_PROPS, ALLEVENTCallbackType, Enum_ALLEVENT } from './index.d';
import utils, { enumDataMode } from '../../utils';
import styles from './template.less';

/*
@columnItem:{...}           列配置数据
@text:string | number       当前数据文本
@record:{...}               当前行完整数据 (rowData)
@index:number               index
@options: {
  customSettings: {...}     自定义属性设置
  optionsApi: {...}         组件UI-api (如: antd-ui)
}   
@ALLCALLBACK: Function      统一事件回调入口
*/

export const emptyReturnUNUSE = (value: string, replaceStr: string = '-'): string => {
  return (value === undefined || value === '') ? '-' : value;
}

// 检测文本值是否为 空
export const emptyReturn = (value: string, replaceStr: string = '-'): [ boolean, string ] => {
  let isEmpty = false;              // 是否为空
  let returnValue = replaceStr;     // 返回结果

  if (value === undefined || value === '') {
    isEmpty = true;
  } else {
    returnValue = value;
  }
  return [isEmpty, returnValue];
}

// 默认常规渲染
export const renderNORMALRENDER = (columnItem: ColumnsTypeMine, text: string, record: any, index: number, options: conditionUnit | any = {}, ALLCALLBACK: ALLEVENTCallbackType) => {
  let setProperty = options.customSettings || {};
  let [ isEmpty, setVal ] = emptyReturn(text);
  let defaultProp = {
    title: setVal
  };

  return (
    <div>
      <span { ...{...defaultProp, ...setProperty} }>{ setVal }</span>
    </div>
  )
}

// 默认1行显示
export const renderLINESINGLE = (columnItem: ColumnsTypeMine, text: string, record: any, index: number, options: conditionUnit | any = {}, ALLCALLBACK: ALLEVENTCallbackType) => {
  let setProperty = options.customSettings || {};
  let [ isEmpty, setVal ] = emptyReturn(text);
  let defaultProp = {
    className: styles.LINESINGLE,
    title: setVal
  };

  return (
    <div>
      <span { ...{...defaultProp, ...setProperty} }>{ setVal }</span>
    </div>
  )
}

// 默认2行显示
export const renderLINETWO = (columnItem: ColumnsTypeMine, text: string, record: any, index: number, options: conditionUnit | any = {}, ALLCALLBACK: ALLEVENTCallbackType) => {
  let setProperty = options.customSettings || {};
  let [ isEmpty, setVal ] = emptyReturn(text);
  let defaultProp = {
    className: styles.LINETWO,
    title: setVal
  };

  return (
    <div>
      <span { ...{...defaultProp, ...setProperty} }>{ setVal }</span>
    </div>
  )
}


// 单输入框
export const renderINPUT = (columnItem: ColumnsTypeMine, text: string, record: any, index: number, options: conditionUnit | any = {}, ALLCALLBACK: ALLEVENTCallbackType) => {

  const props = { record, columnItem, index };

  let [ isEmpty, setVal ] = emptyReturn(text);
  let apis = options.optionsApi || {};
  let {
    isEmptyTempToDefault              // 为空渲染
  } = options.customSettings || {};
  let setApis = { ...apis };

  setApis = {...apis, ...{
    value: text
  }, ...{
    onFocus: (e: MouseEvent | KeyboardEvent) => ALLCALLBACK(Enum_ALLEVENT.INPUT_onFocus, { e, ...props }),
    onChange: (e: MouseEvent | KeyboardEvent) => ALLCALLBACK(Enum_ALLEVENT.INPUT_onChange, { e, ...props }),
    onPressEnter: (e: MouseEvent | KeyboardEvent) => ALLCALLBACK(Enum_ALLEVENT.INPUT_onPressEnter, { e, ...props }),
    onBlur: (e: MouseEvent | KeyboardEvent) => ALLCALLBACK(Enum_ALLEVENT.INPUT_onBlur, { e, ...props }),
  }}

  return (
    <div>
      {
        (isEmpty && !isEmptyTempToDefault) ?
        <span>{ setVal }</span>
        :
        <Input { ...setApis }/>
      }
    </div>
  )
}


// 链接按钮 - 可着色
export const renderLINKBUTTON = (columnItem: ColumnsTypeMine, text: string, record: any, index: number, options: conditionUnit | any = {}, ALLCALLBACK: ALLEVENTCallbackType) => {
  const props = { record, columnItem, index };
  const { condition: { customSettings } }: any = columnItem;
  let setStyle = {};
  let emptyValue = undefined;

  // console.log('renderLINKBUTTON', columnItem, options);

  if (customSettings && customSettings.style) setStyle = customSettings.style;

  let setProperty = options.customSettings || {};
  let setApis = options.optionsApi || {};

  if (setProperty && setProperty.style) setStyle = setProperty.style;
  if (setProperty && setProperty.emptyValue) emptyValue = setProperty.emptyValue;
  let [ isEmpty, setVal ] = emptyReturn(text, emptyValue);

  setApis = {...setApis, ...{
    style: { ...setStyle },
    onClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => ALLCALLBACK(Enum_ALLEVENT.LINKBUTTON_onClick, { e, ...props })
  }}
  
  return (
    <div>
      {
        isEmpty ?
        <span>{ setVal }</span>
        :
        <a { ...setApis } > { text } </a>
      }
    </div>
  )
}

// Date 转 日期字符串
export const renderDATESTRING = (columnItem: ColumnsTypeMine, text: string | number, record: any, index: number, options: conditionUnit | any = {}, ALLCALLBACK: ALLEVENTCallbackType) => {
  let setProperty = options.customSettings || {};
  let {
    dateFormatType
  } = setProperty;
  let [ isEmpty, setVal ] = emptyReturn( text ? text.toString() : '');
  let toNumber = parseInt(text as any);

  return (
    <div>
      <span { ...setProperty }>{
        isEmpty ?
        <span>{ setVal }</span>
        :
        utils.dateTransformer(new Date(toNumber), dateFormatType || enumDataMode.FULL)
      }
      </span>
    </div>
  )
}


// 模板渲染配置器 (廢棄)
export const TABLETEMPX_UNUSE = (columns: ColumnsTypeMine, eventAllCallback: ALLEVENTCallbackType): ColumnsType<any> => {
  // 识别是否定义渲染的类型模式 - customType [ date时间/ input/ any more... ]
  
  return columns.map((item: any, index: number) => {
    const CKEY = item[customType];
    let callback: Function | null = null;

    if (CKEY) {
      if (CKEY === ColumnCustomType.INPUT) {
        callback = renderINPUT;
      } else if (CKEY === ColumnCustomType.LINKBUTTON) {
        callback = renderLINKBUTTON;
      }
    }

    if (typeof callback === 'function') {
      /*
        @item: column-item: 当表格多列都出现同个组件渲染时，可作类似symbol效果做不同数据在回调事件中的区分.
        @record: table-rowData
      */
      item.render = (text: string, record: any, index: number) => {
        
        return (callback as Function)(item, text, record, index, (item.optionsApi || {}), eventAllCallback)
      }
    }
    return item;
  })
}


export const TABLETEMP = (columns: ColumnsTypeMine, eventAllCallback: ALLEVENTCallbackType, props: TABLETEMP_PROPS): ColumnsType<any> => {
  // 识别是否定义渲染的类型模式 - customType [ date时间/ input/ any more... ]

  let { isItemRender, reloadApiTable = {} } = props;
  let { size } = reloadApiTable;

  return columns.map((item: any, index: number) => {
    const isConditionRender = item.condition;       //

    if (isConditionRender) {
      if (!Array.isArray(isConditionRender)) {
        throw Error('表格配置错误，请检查。正确格式为： condition:[boolean, render1, render2 | recursionCondition?:[...]]');
      }

      item.render = (text: string, record: any, index: number) => {
        const [ renderCall, setConf ] = recursiveCondition(isConditionRender as any, record);

        !(setConf as conditionUnit).optionsApi && ((setConf as conditionUnit).optionsApi = {});
        (setConf as conditionUnit).optionsApi = {
          ...(setConf as conditionUnit).optionsApi,
          size
        }

        return (renderCall as Function)(item, text, record, index, ((setConf as conditionUnit) || {}), eventAllCallback);
      }
    } else if (isItemRender[0]) {

      let setNormalTemp = {
        customType: isItemRender[1]
      };

      // 避免覆盖已配置的render-function, 否则会执行报错！
      item.render === undefined && (
        item.render = (text: string, record: any, index: number) => {
        const [ renderCall, setConf ] = recursiveCondition([true, setNormalTemp] as any, record);

        !(setConf as conditionUnit).optionsApi && ((setConf as conditionUnit).optionsApi = {});
        (setConf as conditionUnit).optionsApi = {
          ...(setConf as conditionUnit).optionsApi,
          size
        }
        
        return (renderCall as Function)(item, text, record, index, ((setConf as conditionUnit) || {}), eventAllCallback);
        }
      )
    }

    return item;
  });
}

// 递归条件
function recursiveCondition(conditArr: [
  boolean | string,
  conditionUnit,
  conditionUnit | [boolean | string, conditionUnit, conditionUnit]
], record:any) {
  let unit0 = conditArr[0];       // boolean | eval(string)
  let unit1 = conditArr[1];
  let unit2 = conditArr[2];
  let rz: boolean = false;        // 是否执行 c1
  let result: [Function, conditionUnit | {}];

  if (typeof unit0 === 'boolean') {
    rz = unit0;
  } else if (typeof unit0 === 'string') {
    rz = eval(unit0);
  }

  if (rz) {
    result = [(allocationTemp as Function)(unit1), unit1];
  } else {
    // if (unit2 === undefined) throw Error('unit2必须配置。');

    if (unit2 === undefined) {
      result = [ renderNORMALRENDER, {} ];
    } else {
      if (Array.isArray(unit2)) {
        result = recursiveCondition(unit2, record);
      } else if (typeof unit2 === 'object') {
        result = [(allocationTemp as Function)(unit2), unit2];
      } else {
        throw Error('配置的unit2参数类型不正确，请检查配置内容。');
      }
    }
  }
  return result;
}


// 模板分配
function allocationTemp(unit: conditionUnit):Function | never | null {
  const CKEY = unit[customType];
  let callback: Function | null = null;

  // 此处有修改的空间，让今后使用者能够外部定义模板及模板类型名称
  if (CKEY) {
    if (CKEY === ColumnCustomType.NORMALRENDER) {
      callback = renderNORMALRENDER;
    } else if (CKEY === ColumnCustomType.INPUT) {
      callback = renderINPUT;
    } else if (CKEY === ColumnCustomType.LINKBUTTON) {
      callback = renderLINKBUTTON;
    } else if (CKEY === ColumnCustomType.DATESTRING) {
      callback = renderDATESTRING;
    } else if (CKEY === ColumnCustomType.TEXTLINESINGLE) {
      callback = renderLINESINGLE;
    } else if (CKEY === ColumnCustomType.TEXTLINETWO) {
      callback = renderLINETWO;
    }
  }
  
  if (typeof callback !== 'function') {
    throw Error('配置的模板类型名称不正确，请检查。');
  }
  return callback;
}



/*

// 类似 if else 方式
{
  name: '补货数量',
  condition: [
    true,
    {
      customType: ColumnCustomType.INPUT,
      optionsApi: {
        style: { width: 56 },
        maxLength: 4
      }
    },{
      customType: ColumnCustomType.TEXT,
      optionsApi: {
        style: { width: 56 },
        maxLength: 4
      }
    }
  ]
}

// 递归无限层级
{
  name: '补货数量',
  condition: [
    true,
    {
      customType: ColumnCustomType.INPUT,
      optionsApi: {
        style: { width: 56 },
        maxLength: 4
      }
    },[
      true,
      {
        customType: ColumnCustomType.TEXT,
        optionsApi: {
          style: { width: 56 },
          maxLength: 4
        }
      }, [ 无限层级... ]
    ]
  ]
}

*/
