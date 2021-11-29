# bamboosnaketool
演示上传npm包

# 快速上手
## 安装
```shell
npm install bamboosnaketool
```

#### 基本依赖

```typescript
import Bamboo, { enumDataMode as _enumDataMode } from 'bamboosnaketool';
import { Utiles, Components } from 'bamboosnaketool';

// 包含大量的工具函数 及 组件模块
const { AccessorOverdue, dateTransformer: _dateTransformer, CollectionElementCtrl, Table } = Bamboo;
const { Table: { default: KTTable } } = Components;

let xsdate = _dateTransformer(new Date(), _enumDataMode.FULL);

```


 

#### 工具函数/ 小工具合集

内置基本工具函数。

```typescript
// Date对象 转换为 时间字符串(多种款)
dateTransformer = (dt: Date, viewMode?: enumDataMode): string

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
recursionDataKeyNameTransform = <T>(data: T[], tranConf: recursionDataKeyTransformConf = { isChildrenKey: 'children' }, options: recursionDataKeyTransformOpt = {
  needDeleteBefore: true
}): T[]
```


```typescript
import Bamboo from 'bamboosnaketool';
const { dateTransformer, mergeUrl, ArrayVeidooTransfrom } = Bamboo;

// 日期转换器 - dateTransformer
dateTransformer = (dt: Date | number, viewMode?: enumDataMode): string;

// 路径合并, 去除拼接处 多或少的 '/'
mergeUrl = (arr: string[]): string;

// 一维数组转二维切割
ArrayVeidooTransfrom = (list: any[], mo: number) :array[];
```



##### AccessorOverdue - 存取器 - 过期限制 （save data to localSession）：

```typescript
import Bamboo from 'bamboosnaketool';
const { AccessorOverdue } = Bamboo;

// 创建实例
const xAccessorOverdue = new AccessorOverdue({  // 过期存储
  overdueTimeSecond: 3600     // 单位-秒
});

// 实例可调用的api
{
  setItem (key: string, data: any): void        // 写入存储
  getItem (key: string, overdueTimeSecond?: number): { isInvalid: boolean, value: { creatertime: number, value: any }}  // 提取存储
  removeItem (keys: string | string[]): void    // 指定删除
}
```


##### Debounced / Throttle - 防抖/ 节流 （control event frequency）：

防止高频触发、开销；
防抖 - 短暂时间内的多次执行，以最后一次执行为触发；
节流 - 一段周期内只执行一次；

```typescript
import Bamboo from 'bamboosnaketool';
const { Debounced, Throttle } = Bamboo;

// 防抖 - 创建实例
const debounced = new Debounced().use((fn: Function) => {
  typeof fn === 'function' && fn();
}, 500);

// 调用-防抖
debounced(() => {
  // u can do any things...
});

// 实例可调用的api
{
  /**
   * @param func 需要包装的函数
   * @param delay 延迟时间，单位ms
   * @param immediate 是否默认执行一次(第一次不延迟)
   */
  use = (func: Function, delay: number, immediate: boolean = false): Function
}

---------------------------[ 不华丽且低调的分割线 ]----------------------------------

// 节流 - 创建实例
const throttle = new Throttle().use((fn: Function) => {
  typeof fn === 'function' && fn();
}, 500);

// 调用
destroy();     // 销毁
open();        // 开启
close();       // 关闭

{
  /**
   * @param func 需要包装的函数
   * @param delay 延迟时间，单位ms
   * @param immediate 是否默认执行一次(第一次不延迟)
   */
  use = (func: Function, delay: number, immediate: boolean = false): Function
}

```


#### 公共组件

React、antd-UI

组件：

##### Table - 表格组件：(github)

内置pagination、支持单元格自定义模板渲染、ACTIONS操作栏多功能渲染等；
详细内容参考（https://github.com/liuyunqi/cms-template-react-antd-dva-umi/blob/main/README.md）
  
  
##### TreeAbundant - 丰富的树组件 （Tabs + Tree）：

使用antd的 tree + tabs 组件拼搭的封装组件。

基本调用：
```typescript
import Bamboo, { Utiles, Components } from 'bamboosnaketool';

const { TreeAbundant } = Bamboo;
const { enumEVENTTYPE, intfTabsItem, intfEventHandle } = Utiles;

// 丰富树组件 - 全事件回调
const treeAbundant_eventHandle: intfEventHandle = (TYPE, data) => {
  if (enumEVENTTYPE.RADIO_CHANGE === TYPE) {
    let value = data;
  } else if (enumEVENTTYPE.TREE_CHECKED === TYPE) {
    let { checkedKeysValue, checkedNodes } = data;
  }
}

// 门店-丰富树props配置
const setTreeAbund = {
  treeDataSource: storeTreeDatasource,        // 树状嵌套数组数据
  defaultTreeExpandedKeys: storeTreeDatasource.length > 0 ? [storeTreeDatasource[0].key] : [],   // 默认展开yf首层级
  effectTreeCheckedKeys: storeConfrimCodes,   // array
  isShowTabs: false,                          // 是否显示tabs
  eventHandle: treeAbundant_eventHandle
};

// render ...
<TreeAbundant { ...setTreeAbund }/>

```

*为确保同步更新，<kbd>effectTreeCheckedKeys</kbd>必须始终配置，如果有没配置则填入空数组“[]”。

api参考
```typescript
interface IProps  {
  dispatch: Dispatch;
  
  treeDataSource: any[];                    // tree组件数据
  eventHandle: intfEventHandle;             // 公共回调事件
  effectTreeCheckedKeys: React.Key[];       // 再次定义多选 (default: 'key')

  dataNodeKeyConf?: intfDataNodeKeyConf;    // 关键字段自定义配置 [title, key, children]
  isShowTabs?: boolean;                     // tab选项卡 - 是否显示
  tabsItems?: intfTabsItem[];               // tab选项卡渲染数据  [{ label: string, value: string }, ...]
  defaultRadioValue?: string;               // 默认radioValue
  defaultTreeExpandedKeys?: React.Key[];    // 设置默认展开 (default: 'key')
  defaultTreeCheckedKeys?: React.Key[];     // 设置默认多选 (default: 'key')
  defaultSelectedKeys?: React.Key[];        // 设置默认选中 (default: 'key')
  treeOptiosApis?: TreeProps;               // 树组件 apis - antd

  mainStyle?: React.CSSProperties;          // 主结构样式自定义
  tabBoxStyle?: React.CSSProperties;        // tab容器结构样式自定义
  treeBoxStyle?: React.CSSProperties;       // 树容器结构样式自定义
}
```



##### echart - 图形

-

#### 导入excel获取数据插件

###### 基本使用
场景：想把excel的中文列头转成英文字段并且拿到转换后的数组，key是excel的列头中文，toKey是需要将原来的中文列头转成什么字段，type表示列值的类型，如果设置了type，那么转换后的数据类型会转成设置的type类型，类型枚举可使用ExcelType，目前包括的枚举(STRING, NUMBER, BOOLEAN, DATETIME, DATE, TIME, FLOAT)
``` javascript
import Bamboo, { Utiles, Components } from 'bamboosnaketool';
const { ImportFileExcelDataVerifyTool } = Bamboo; 
const { ExcelRule } = Utiles;

new importFileExcelDataVerifyTool({
  file: ev.target.files[0], //file对象 必传
  columns: [
    { 
      key: "列名比如商品编码", 
      type: ExcelType.STRING, //数据类型，用于转换数据，具体类型可以查看ExcelType枚举
      toKey: "把列头字段转换成的字段比如goodCode", 
    },
  ],
})
.valid() // 开始进行数据校验 必须有
.then((res)=>{
  // 没有任何错误，将返回数据
  // res 为 { total: 总行数, data: 数据数组 }
  console.log(res);
})
```

###### 设置预警值
场景：有限定用户excel数据量大小，并且需要告知用户数据量已经超出询问用户是否继续导入
``` javascript
import Bamboo, { Utiles, Components } from 'bamboosnaketool';
const { ImportFileExcelDataVerifyTool } = Bamboo; 
const { ExcelRule } = Utiles;

new importFileExcelDataVerifyTool({
  file: ev.target.files[0], //file对象 必传
  columns: [
    { 
      key: "列名比如商品编码", 
      type: 'string|number|boolean|float', //数据类型，用于转换数据
      toKey: "把列头字段转换成的字段比如goodCode", 
    },
  ],
})
.warn((msg, confirm, cancel)=>{
  //配置了warn字段必须加
  // confirm() // 调用此函数表示继续操作
  // cancel() // 此函数表示取消操作
})
.valid() // 开始进行数据校验 必须有
.then((res)=>{
  // 没有任何错误，将返回数据
  // res 为 { total: 总行数, data: 数据数组 }
  console.log(res);
})
```
###### 设置起始行
场景：需要从指定的excel行开始读取数据，可以设置startIndex配置，默认从第一行开始
``` javascript
import Bamboo, { Utiles, Components } from 'bamboosnaketool';

const { ImportFileExcelDataVerifyTool } = Bamboo; 
const { ExcelRule } = Utiles;

importFileExcelDataVerifyTool({
  startIndex:0, //开始行数
  file: ev.target.files[0], //file对象 必传
  columns: [
    { 
      key: "列名比如商品编码", 
    },
  ],
})
.valid()
.then((res)=>{
  // 没有任何错误，将返回数据
  // res 为 { total: 总行数, data: 数据数组 }
  console.log(res);
})
```

###### 验证
场景：需要对上传的excel数据字段值进行校验，插件本身提供内置的验证，具体可使用插件暴露出的ExcelRule枚举查看，如果想要自己定义验证，可以使用ExcelRule.Customer，然后定义valid回调函数，回调函数会传入读取到的行数据（注：如果定义了转换的key，那么读取到的行数据中的列字段是经过转换的，不是excel显示的中文），回调函数如果返回true，表示验证通过，验证结束后，错误的验证消息会通过catch方法来进行捕捉，错误的消息可以通过配置msg字段来提示，如果不配置插件会使用自己定义的消息提示，一般来说如果使用了内置的验证会提示内置的验证提示，比如使用身份证号验证将默认提示xxx必须是身份证号，没有的内置验证将提示xxx格式错误
``` javascript
import Bamboo, { Utiles, Components } from 'bamboosnaketool';
const { ImportFileExcelDataVerifyTool } = Bamboo; 
const { ExcelRule } = Utiles;

new importFileExcelDataVerifyTool({
  file: ev.target.files[0], //file对象 必传
  columns: [
    { 
      key: "列名比如商品编码", 
      toKey: "把列头字段转换成的字段比如goodCode", 
      rules:[
        {type:ExcelRule.CUSTOMER, valid:(row)=>{return row.goodCode=='a'}, msg:'自定义错误消息'}, //自定义校验
        {type:ExcelRule.NUMBER, msg:'商品编码必须是数字'}, //使用内部校验规则 可以使用 ExcelRule枚举提供的校验规则
      ]
    },
  ],
})
.valid() // 开始进行数据校验 必须有
.then((res)=>{
  // 没有任何错误，将返回数据
  // res 为 { total: 总行数, data: 数据数组 }
  console.log(res);
}).catch((error)=>{ 

  // 1.校验规则错误 2.interceptor设置的函数返回false
  console.log(error); // {msg:}
})

```

###### 手动添加数据
场景：1. 需要在行数据上添加字段 2. 想要遍历指定字段然后中断读取操作 可以使用interceptor方法，此方法会回调给用户行数据和验证过后的错误消息，此函数如果返回false则表示中断excel读取操作，如果返回false此函数会触发catch回调
``` javascript

new importFileExcelDataVerifyTool({
  file: ev.target.files[0], //file对象 必传
  columns: [
    { 
      key: "列名比如商品编码", 
      type: 'string|number|boolean|float', //数据类型，用于转换数据
      toKey: "把列头字段转换成的字段比如goodCode", 
    },
  ],
})
.interceptor((rowData:any, err:[])=>{
  // 此方法不是必需要要有的，如果有数据转换或者要在行数据里面加些字段可以使用
  // 使用interceptor来进行数据装换， data为行数据
  rowData.field = Math.random();
  console.log(rowData);

  // return false直接中断操作抛出异常
  return true;
})
.valid() // 开始进行数据校验 必须有
.then((res)=>{
  // 没有任何错误，将返回数据
  // res 为 { total: 总行数, data: 数据数组 }
  console.log(res);
}).catch((error)=>{ 

  // 1.校验规则错误 2.interceptor设置的函数返回false
  console.log(error); // {msg:}
})
```

###### 配置项说明
| 配置项     | 类型    | 说明                                                                                                                                                                                                                                                                                                                             | 默认                                                                                                                     |
| ------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| file          | file对象 | file对象                                                                                                                                                                                                                                                                                                                         | 必填                                                                                                                     |
| sheet         | 数字    | excel中如果有多个工作簿，可以通过sheet配置项来配置读取第几个工作簿的数据                                                                                                                                                                                                                            | 0                                                                                                                          |
| isDebugger    | 布尔    | 是否显示警告在控制台中                                                                                                                                                                                                                                                                                                  | false                                                                                                                      |
| mimeType      | 数组    | 设置可以读取的文件类型，默认                                                                                                                                                                                                                                                                                         | ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ] | 
| max           | 数字    | 最大行数                                                                                                                                                                                                                                                                                                                       | 500                                                                                                                        |
| warn          | 数字    | 预警行数                                                                                                                                                                                                                                                                                                                       | 500                                                                                                                        |
| columns       | 数组    | 配置excel列                                                                                                                                                                                                                                                                                                                     | 必填                                                                                                                     |
| columns.key   | 字符串 | 列名比如商品编码                                                                                                                                                                                                                                                                                                           |                                                                                                                            |
| columns.type  | ExcelType | 列名类型，描述此列数值的类型                                                                                                                                                                                                                                                                                         |                                                                                                                            |
| columns.toKey | 字符串 | 重命名key，比如key为商品编码，toKey为goodCode，那么导出的数据就是{goodCode:''}这种形式                                                                                                                                                                                                                  |                                                                                                                            |
| columns.rules | 数组    | rules:[{type:ExcelRule.CUSTOMER, valid:(row)=>{return row.goodCode=='a'}, msg:'自定义错误消息'},{type:ExcelRule.NUMBER, msg:'商品编码必须是数字'}] 注：msg可以为空，如果为空则会采用插件自带的提示 验证类型的可使用ExcelRule的枚举类型|                                                                                                                            |


###### 方法说明
| 方法      | 说明                                                                                                                        |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| valid       | 校验方法，必须调用                                                                                                   |
| warn        | 配置了warn字段必须调用，会有三个参数回调给用户(msg, confirm, cancel) msg为消息，confirm为用户继续操作，cancel表示取消数据读取 |
| interceptor | 此方法会回调给用户当前行数据和错误消息，如果用户在此方法中返回false，会中断读取数据操作，并且会调用catch抛出异常 |
| then        | 数据读取完成无错误会回调给用户一个对象，{ total: 总行数, data: 数据数组 }                          |
| catch       | 数据读取中如果有校验错误或者在intercepotor里返回false都会触发此方法，并回调给用户一个对象{type:'error', msg:['错误消息']} |



###### 枚举类型
| 类型    | 说明     |
| --------- | ---------- |
| ExcelRule | 内置规则枚举(NUMBER整数验证 MOBILE手机号验证 IDCARD身份证验证 NUMERIC小数验证 NOT_EMPTY非空验证 CUSTOMER自定义验证) |
| ExcelType | 列类型枚举(STRING字符串 NUMBER整数数值包括负数 FLOAT小数 BOOLEAN布尔类型 DATETIME年月日时分秒格式 DATE年月日格式 TIME时分秒格式) |


#### 增减行配置自由定义组件

支持能预先自由配置各种元素组合的单行模板（文字/ antd组件/ 自定义元素...）。
根据配置的单行模板，能够去生成n行该模板的独立数据控制，排序样式，单元素填值时的基础校验，最终生成表单数据。
同时支持单行的删除。（未来会支持 up down调序）。

```javascript
import Bamboo, { Components } from 'bamboosnaketool';
const { FreeCustomRowLine } = Bamboo;
// 或 const { FreeCustomRowLine } = Components;
const { default: BamFreeCustomRowLine, EVENTTYPE, ELEMENTTEMP } = FreeCustomRowLine;

// 配置增减行
const freeCustomRowLineConfProps = {
  templateRow: [
    '整单满',
    {
      elementTEMP: ELEMENTTEMP.INPUTNUMBER,
      placeholder: '价格',
      maxLength: 8,
      style: { width: 100, marginLeft: 4, marginRight: 4 },
      apiOptions: {
        min: 0
      }
    },
    '元，赠送',
    {
      elementTEMP: ELEMENTTEMP.INPUT,
      placeholder: '搜索商品',
      maxLength: 10,
      style: { width: 200, marginLeft: 4, marginRight: 4 }
    },
    '，',
    {
      elementTEMP: ELEMENTTEMP.INPUTNUMBER,
      placeholder: '数量',
      maxLength: 4,
      style: { width: 90, marginLeft: 4, marginRight: 4 },
      apiOptions: {
        min: 0
      }
    }
  ],
  callback: (TYPE: EVENTTYPE, data: any) => {
    console.log(TYPE, data)
  }
};

// render...
<BamFreeCustomRowLine {...freeCustomRowLineConfProps} />
```

#### 上传组件
会生成一个button按钮，点击后弹窗windows-fileSlectWindow（windows系统自带文件选择窗口）。
可以配置一些导入数量的相关数量限制tips阻断。




