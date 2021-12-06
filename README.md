---

---

# bamboosnaketool


### 快速上手 - 安装

```shell
npm install bamboosnaketool

// the github project url
https://github.com/liuyunqi/BambooSnake-ReactAntd
```



### 简单介绍

技术栈React + Antd-UI，内置常用的基础工具函数、通用组件、业务组件/函数。统一规范，减少重复开发提升交付质量效率，聚焦内容实现。

`（如果为支持firefox-v5.0~5.3版，依赖antd的版本需锁死在v4.15.6，目前发现主要是table表格的支持，低版本position-Fixed会失效。）`

`推荐使用Typora的.md文档查看工具打开本地modules内的README.md文件，会有明确的模块目录分栏及内容段落，极大提高可读性。`



### 基本依赖

```typescript
import Bamboo, { enumDataMode as _enumDataMode } from 'bamboosnaketool';
import { Utiles, Components } from 'bamboosnaketool';

// 包含大量的工具函数 及 组件模块
const { AccessorOverdue, dateTransformer: _dateTransformer, CollectionElementCtrl, Table } = Bamboo;
const { Table: { default: KTTable } } = Components;

// 例: 转换日期 - 完整型
let xsdate = _dateTransformer(new Date(), _enumDataMode.FULL);

// 例：表格组件 - KTTable （可任意自定义模块名称）
<KTTable/>

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



##### CollectionElementCtrl - HTML元素集合控制器

针对元素对象集合进行遍历操作。

内置索引记录器，可以通过使用指令对其进行遍历，对遍历目标元素进行 Attr 属性赋值（如class、style），对非当前active元素进行清理值。

支持对目标元素进行class/ style的配置自定义。

```typescript
import Bamboo from 'bamboosnaketool';

const { CollectionElementCtrl } = Bamboo;

// 元素集合操作
const $CollectionElementCtrl = new CollectionElementCtrl({
  collectionsElements: [],	// dom对象集合 （可初始化设置/ 通过.setCollectionsElements()插入调用）
  indexRecord: 0,			// 行索引 - rowIndex
  columnIndex: 4,			// 列索引 - 锁定单元格
  needFoucusHTMLElementInput: true	// 是否聚焦input - 是否需要检查当前 纵及列<td>单元格内是否包含input
});

```

可结合 Bamboo.KeywordsContrl 的键盘事件组件搭配使用。（如：操作表格，通过键盘（上下左右）指令在表格的row及td中的元素进行操作。）

演示表格行通过 ↑ ↓ 键盘来做到行来回选中效果。

```typescript

const TableScanRef = React.createRef<HTMLDivElement>(); // TABLE - 表格 (用于控制-rowSelected)

// 获取Element集合
const tbody = (TableRef.current as HTMLDivElement).children[0].querySelector('.ant-table-tbody');
let trNodes: HTMLTableRowElement[] = [];
tbody?.querySelectorAll('tr').forEach((trElement: HTMLTableRowElement, index: number) => {
    if (index > 0) {
        trNodes.push(trElement);
    }
});

// 装载DOM元素集合到 组件内
$CollectionElementCtrl.setCollectionsElements(trNodes);

// print 是 Bamboo.KeywordsContrl 事件回调里的按键标识
if (print === 'top') {
    $CollectionElementCtrl.reduce();
} else if (print === 'bottom') {
    $CollectionElementCtrl.addition();
}
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

##### Table - 表格组件：(github - public)

内置pagination分页、支持表格列单元格自定义模板渲染、ACTIONS操作栏多功能渲染等；


目前表格使用 antd-UI ，表格组件封装了 Table-antd 和 Pagination-antd；

###### 基本使用

```typescript
// 使用bamboo表格组件
import Bamboo from 'bamboosnaketool';
const { Table: bamTable } = Bamboo;

return (
    <bamTable dataSource={ dataSourceList } columns={ columns } rowKey={ 'id' } ALLEVENTCallback={ tableLLEVENTCallback }/>
)
```



###### 页面模块组成

目前开发作者习惯性的文件方式搭配。`假设有一个页面模块demoPage`

```typescript
src <
    demoPage<
    	index.tsx;			// 页面模块
		index.less;			// 页面样式
		columns.ts;			// 根据key生成的export对象,该对象符合 antd-column-item 及 结合组件内部封装的新属性
		columns.d.ts;		// key - tableCloumn 前端枚举 - 页面中如有用到关键字段推荐从这里统一使用
```



###### 列头配置

推荐方式为独立的 列头配置文件 和 列头.d

```
...,
mock,
pages --> homePage --> [ index.tsx, index.less, columns.ts, columns.d.ts ],
...otherlibs

```

```javascript
// columns.ts

import { ColumnsType } from 'antd/es/table';
import { columnItemDecorator, Table_ColumnsTypeMine } from 'bamboosnaketool';
import { keys } from './columns.d';

// 字段配置
const originalConfMax = (
  columnItemDecorator
)({
  [keys.mainbarCode]: { name: '商品条码' },
  [keys.goodCode]: { name: '商品编码' }
}, keys);

/*
originalConfMax 生成后的数据格式为：type is Object
{
  mainbarCode:{
    dataIndex: "mainbarCode",
    key: "mainbarCode",
    name: "商品条码",
    title: "商品条码"
  },
  ...
}
columnItemDecorator 是数据装饰的函数，通过编码人员简单的columnitem配置就能生产完整的数据，数据符合antd的api及bamboo组件封装props要求，且写少做多。
*/

// 将其导出
export const column_ALL: Table_ColumnsTypeMine = [
  originalConfMax[keys.goodName],
  originalConfMax[keys.mainbarCode]
];

```

```javascript
// columns.d.ts

// ts 字段枚举配置
export enum keys {
  mainbarCode = 'mainbarCode',      // 商品条码
  goodCode = 'goodCode',            // 商品条码
  ...
}
```

columns.d.ts 的<kbd>keys</kbd>是枚举对象，键值对形式，其中【键】命名后不可更改，【值】则根据实际数据字段自由更改。
这里之所以使用<kbd>columns.ts</kbd>和<kbd>columns.d.ts</kbd>方式，而不直接定义在index.tsx里是因为有以下几种应用情况。

·当前页面为 tabs切卡 + 表格，每次切换不同 tab-item，每个tab的表格列头不一致，统一配置达到复用目的；  
·使用手动静态mock，mockdata的 key 与 真实完全同步，所以配置当前到enum对象中；  



###### 操作栏配置

多功能配置ACTIONS

右侧的操作列头，支持多种需求，如：

点击回调、点击模态框弹窗、点击确认气泡、隐藏、隐藏且占位、禁用锁定、仅某一条符合某条件、多渲染模式同时并存、仅图标、图标+文字、悬停是否显示title、仅图标锁定。

```javascript
// tableMock.tsx 
import { HomeOutlined } from '@ant-design/icons';
import { Table_enumEventType, Table_enumViewMode, Table_sActions as ActionInterface } from 'bamboosnaketool';


// 这是一个配置好的 操作栏 - ACTIONS
export const setActionsTestMock : ActionInterface[] = [
  // 事件交互
  {
    text: '点击回调',
    condition: {
      hide: `['2', '3'].includes(record.key)`
    },
    eventType: Table_enumEventType.CALLBACK,
    eventSubstance(record: RowProps) {
      alert('can run xxx function event.');
    }
  }, {
    text: '模态框',
    condition: {
      hide: `['2', '3'].includes(record.key)`
    },
    eventType: Table_enumEventType.MODALBOX,
    eventSubstance: {
      title: '模态框标题',
      content: (
      <div>
        这是一段询问的内容，吧啦吧啦。。。
      </div>),
      ok(record) {
        alert('ok')
      },
      cancel() {
        alert('cancel')
      }
    }
  }, {
    text: '气泡确认框',
    condition: {
      hide: `['2', '3'].includes(record.key)`
    },
    eventType: Table_enumEventType.POPCONFIRM,
    eventSubstance: {
      title: '气泡标题',
      content: '嗯哼？',
      ok(record) {
        alert('ok')
      },
      cancel() {
        alert('cancel')
      }
    }
  },

  // 按鈕狀態
  {
    text: '隐藏且占位',
    condition: {
      transparent: `true`,
      hide: `['1', '3'].includes(record.key)`
    },
    eventType: Table_enumEventType.CALLBACK,
    eventSubstance(record: RowProps) {
      alert('can run xxx function event.');
    }
  },
  {
    text: '显示图标',
    icon: <HomeOutlined/>,
    condition: {
      hide: `['1', '2'].includes(record.key)`
    },
    eventType: Table_enumEventType.CALLBACK,
    eventSubstance() {

    },
    viewMode: Table_enumViewMode.ICONTEXT
  }
  ....    /* 还有非常多种 */
]

```

上述还有非常多种，具体可以参考 `后期补全，示例文件删了`。（同时你可以使用该文件内的数据生成示例参考，datasource、columns、actions 都是齐全的）

<b>eventType</b> : 事件响应模式 { <kbd>Table_enumEventType.CALLBACK</kbd>,<kbd> Table_enumEventType.MODALBOX</kbd>, <kbd>Table_enumEventType.POPCONFIRM</kbd> }；  
<b>eventSubstance</b> : 配套对应不同 eventType , 配置完全不同；  
<b>condition</b> : 渲染条件，内含 { hide, transparent, locked }, 优先级按此序列；条件书写为 eval(string), 内置关键字为 'record';  
<b>viewMode</b> : 渲染显示模式，文字/ icon, { <kbd>Table_enumViewMode.DEFAULT</kbd>, <kbd>Table_enumViewMode.ICON</kbd>, <kbd>Table_enumViewMode.ICONTEXT</kbd> }。



将配置完成的 [操作栏] 数据与 [column] 的数据进行数组合并。 

```javascript

import { setActionsTestMock } from '../tableMock.tsx';
import { ColumnRender_operationAction } from 'bamboosnaketool';

export const setColumns = [
  {
    title: '创建人',
    dataIndex: 'str3',
    key: 'str3',
  },
  {
    title: '操作',
    key: 'action',
    render: (text: string, record: any, index: number) => {

      let setActionsTest = setActionsTestMock;

      // if 条件变更 setActions ...
      return ColumnRender_operationAction(text, record, index, setActionsTest);
    }
  }
];

```

更多细节建议利用mock数据做一个例子，并花30分逐个尝试并理解为最佳。这里就没有逐一全部写清楚了。




###### 配置定制化模板 column-item

支持表格单元格渲染，输入框类型、货币格式转换、时间戳转字符串、进度条（节状、直条、或任意款式）、高亮link内容等错综复杂的万象需求...，都可按照目前组件提供的内置模板模式达成。

配置示例：

```javascript

// 这里就写局部结构，完整内容参考已上述过的【列头配置】
{
  [keys.salesForecast]: {
    name: '链接文本',             // 其实这里是  列头名称，为方便理解这个改为了 ’示例模板名称‘
    condition: [
      'record.id !== "3"',
      {
        customType: Table_ColumnCustomType.LINKBUTTON,
        customSettings: {
          style: {
            fontWeight: 'bold'
          }
        }
      }
    ]
  },

  [keys.replenishNumber]: {
    name: '输入框',               // 其实这里是  列头名称，为方便理解这个改为了 ’示例模板名称‘
    condition: [
      'record.id !== "3"',
      {
        customType: Table_ColumnCustomType.INPUT,
        optionsApi: {
          style: { width: 56 },
          maxLength: 4
        }
      },
      {                                                   // 其实该处整个{}对象配置可以省略，组件内部会默认使用 NORMALRENDER 渲染正常文本显示。
        customType: Table_ColumnCustomType.NORMALRENDER,  // 默认渲染普通文本 - 该处可不设
      }
    ]
  }
}

```

上述代码示例中出现了三个组件内置模板，Table_ColumnCustomType { LINKBUTTON, INPUT, NORMALRENDER }。

<b>optionsApi</b> 为antd-api，这里的设置参数全部是直接 setProps 到 antd-DOM 上的。根据不同的组件查看官方具体的api。
<b>customSettings</b> 设置一些自定义的dom属性，比如 customSettings.style， 这些最终也会以 setProps 方式应用到 DOM 的行间样式属性中；

为了方便理解，从概念上 <b>optionsApi</b> 可看作【setApis】，<b>customSettings</b>可看作【setPropertys】。



###### 渲染条件 condition

这里condition（条件）要特别说下，它决定了每个列配置的最终渲染结果，根据条件满足与否执行A/ B；`类似if else 无限递归`

condition本身是数组，参考概念格式为 condition = [ boolean, A, B ] 或 [ boolean, A ] 。

```
c[0] 是布尔类型，成功则执行A，否则执行B；  
A/B  是一个单个模板完整的配置方案；  
B 非必填，不填时则渲染默认模板 Table_ColumnCustomType.NORMALRENDER（默认文本显示）;  

c[0]：书写可以是 true/ false/ 表达式， 或 eval(string)，string数据关键字为 'record';
```



同时为<b>满足相对复杂的业务需求</b>，这里支持无限层级的  if else 嵌套，代码如下：

```javascript

// 类似 if else 方式
{
  name: '补货数量',
  condition: [
    true,
    {
      customType: Table_ColumnCustomType.INPUT,
      optionsApi: {
        style: { width: 56 },
        maxLength: 4
      }
    },{
      customType: Table_ColumnCustomType.TEXT,
      optionsApi: {
        style: { width: 56 },
        maxLength: 4
      }
    }
  ]
}

// 伪代码理解
// [false, 3, [false, 5, [true, 18]]]    - 结果：18
// [true, 996, [true, 42, [false, 23]]]  - 结果：996
// [false, 5]						     - 结果：由于未设置B，则指向默认Table_ColumnCustomType.NORMALRENDER，或优先外部配置的 isItemRender


// 递归无限层级
{
  name: '补货数量',
  condition: [
    true,
    {
      customType: Table_ColumnCustomType.INPUT,
      optionsApi: {
        style: { width: 56 },
        maxLength: 4
      }
    },[
      true,
      {
        customType: Table_ColumnCustomType.TEXT,
        optionsApi: {
          style: { width: 56 },
          maxLength: 4
        }
      }, [ 无限层级... ]
    ]
  ]
}

```

###### 模板 template

目前使用的模板都是内置的。在 ./template.tsx 中。  
需要新增则需要扩展  Table_ColumnCustomType 类型名称 及 对应的 render 函数。  

理想的最优解为之后迭代，让今后使用者能够外部定义追加扩展模板及模板类型名称。  



###### 表格事件 eventHandle

通过配置表格组件Props - ALLEVENTCallback, 传入一个方法，该方法仅会响应 template 模板事件。  

```javascript

// 全表格事件回调捕捉函数
const tableLLEVENTCallback: ALLEVENTCallbackType = (TYPE, data) => {

  // 输入框 - 每次输入
  if (TYPE === Enum_ALLEVENT.INPUT_onChange) {
    const { e, record, columnItem, index } = data;
    let key = columnItem.key;
    let value = e.target.value;
    
    //...
  }
  // 输入框 - 回车 / 失焦
  else if (TYPE === Enum_ALLEVENT.INPUT_onPressEnter || TYPE === Enum_ALLEVENT.INPUT_onBlur) {

  }
  // 点击 预测销量
  else if (TYPE === Enum_ALLEVENT.LINKBUTTON_onClick) {
    // do anything...
  }
}

```

顺便提一嘴，操作栏 ACTION 的事件回调函数为 <b>eventSubstance</b>。在配置 ACTION-item 时被一并配置，根据ACTION类型不同会有所不同。

###### Props Api

```javascript

interface IProps  {
  dispatch: Dispatch;

  columns: ColumnsType<ColumnsTypeMine>;   // 表格列头
  dataSource: any[];                       // 表格数据
  rowKey?: string | undefined;             // 自定义关键参数 default: id
  isShowPagination?: boolean;              // 是否显示分页组件
  defaultFirstPage?: number | undefined;   // 默认开始页码
  pageCurrent?: number | undefined;        // 当前页码
  pageTotal?: number | undefined;          // 总页码数
  pageLimit?: number | undefined;          // 单页数据数量
  pageSizeOptions?: string[] | undefined;  // 单页数量变更

  onPaginationChange?: ((page: number, pageSize: number) => void) | undefined;   		// 分页组件事件回调
  onPaginationShowSizeChange?: ((current: number, size: number) => void) | undefined;	// 是否显示分页组件
  ALLEVENTCallback?: ALLEVENTCallbackType; // 公共回调函数 (可用于解决column-render组合任何组件的无限触发事件回调)

  reloadApiTable?: TableProps<any>;        // antd - table - api
  reloadApiPagination?: PaginationProps;   // antd - pagination- api
}

```



##### TreeAbundant - 丰富的树组件 （Tabs + Tree）：

使用antd的 tree + tabs 组件拼搭的封装组件。

###### 基本使用

```typescript
import Bamboo, { Components } from 'bamboosnaketool';

const { TreeAbundant, TreeAbundant_enumEVENTTYPE, TreeAbundant_eventHandle } = Bamboo;

// 丰富树组件 - 全事件回调
const treeAbundant_eventHandle: TreeAbundant_eventHandle = (TYPE, data) => {
  if (TreeAbundant_enumEVENTTYPE.RADIO_CHANGE === TYPE) {
    let value = data;
  } else if (TreeAbundant_enumEVENTTYPE.TREE_CHECKED === TYPE) {
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



##### TableColumnsLayer - 表格列显示/隐藏组件

###### 功能
1. 动态变动表格列数据；
2. 支持列数据存储/取赋值；
3. 支持列数据拖动排序；

###### 基本使用
1. 给定表格列数据，此列数据需要可以变动
``` javascript
import Bamboo, { Utiles, Components } from 'bamboosnaketool';
import initColumn from './columns';			// 附属xx页面模块的表格配置

const { default: TableColumnsLayer } = Components;
const [ columns, setColumns ] = useState(initColumn);  // 声明

// 定义列变动通知方法
const onColumnChange = (data:any, close:any) => {
	// 选择的列数据
	let { columns, width } = data;

	// 如果操作列单独拿出来的，需要手动放进去
	setColumns([...columns, ACTION_OPERATION]);

	// 关闭列选择弹出窗
	close();
}

// JSX中渲染注册触发事件按钮，及参数配置项
<TableColumnsLayer columns={ columns } onChange={ onColumnChange }>
	<Button type="primary" ghost>
	  列选择
	</Button>
</TableColumnsLayer>
```

###### 配置项
| 配置项   | 类型 | 说明                                                                                | 默认值 |
| ----------- | ------ | ------------------------------------------------------------------------------------- | ------ |
| columns     | 数组 | 表格的列数据                                                                    | 必填 |
| onChange    | 函数 | 回调函数，会回调给用户2个参数，一个data(包含columns和width)，一个是关闭弹出窗口的方法 | 必填 |
| table       | ref    | 默认插件会自己去找table，用户也可以传入table的ref，这样会更加准确 | 非必填 |
| needStorage | 布尔值 | 是否存储此次操作的列数据，如果存储，下次进来会读取存储中的数据 | false  |

###### 注意事项
1. 未传入ref，组件会自己去找，多个表格的情况有可能会出错，最好把表格的ref传入
2. 如果操作列没有放到column，而是后面加入，那么回调方法中回调的列数据不包含操作列，需要手动把列数据放入，否则可能会出现操作列不见的情况



##### FileUploadExcelToData - 上传文件组件

内置生成一个button按钮，点击该按钮后弹窗windows-fileSelectWindow（windows系统自带文件选择窗口）；
可以配置一些导入数量的相关数量限制tips阻断；

###### 基本使用

```javascript
import Bamboo, { Components } from 'bamboosnaketool';

const { FileUploadExcelToData } = Bamboo;
// 或 const { FileUploadExcelToData } = Components;

// render...
<FileUploadExcelToData />
    
// 前置拦截功能待未来实现 （比如点击不是直接选择文件，而是判断条件）
```

###### 功能

校验导入的文件类型MIME是否正确；

将导入文件的二进制类型转换为可读JSON数据对象；

对超出预设数量的导入操作进行拦截/提示；



###### 配置项说明

| 配置项                | 类型                                                         | 说明                                                    | 默认值        | 必填 |
| --------------------- | ------------------------------------------------------------ | ------------------------------------------------------- | ------------- | ---- |
| isDisabled            | boolean                                                      | 是否禁用                                                | false         | 否   |
| isLoading             | boolean                                                      | 是否是载入状态                                          | false         | 否   |
| fileTypeStr           | {<br />    override: boolean;  // 是否覆盖<br />    names: string[];   // 文件类型编码<br />} | 文件类型编码,MIME                                       | { false, [] } | 否   |
| singleUploadMaxLength | number                                                       | 单次上传最大数量，超过限制时候会msg.warn + 逻辑阻断；   | 3000          | 否   |
| slowMaybeMaxLength    | number                                                       | 执行时可能较慢提示，modal.confrim，确认后再执行         | 2000          | 否   |
| callback              | function                                                     |                                                         | null          | 否   |
| uploadApiOptions      | { ...antd-options }                                          | antd-Upload，的相关再定义api。（不要覆盖customRequest） | {}            | 否   |


###### 

##### ImportFileExcelDataVerifyTool - Excel导入数据校验与转换

场景：想把excel的中文列头转成英文字段并且拿到转换后的数组，key是excel的列头中文，toKey是需要将原来的中文列头转成什么字段，type表示列值的类型，如果设置了type，那么转换后的数据类型会转成设置的type类型，类型枚举可使用ExcelType，目前包括的枚举(STRING, NUMBER, BOOLEAN, DATETIME, DATE, TIME, FLOAT)

###### 基本使用

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



##### FreeCustomRowLine - 增减行自由定义配置组件

支持能预先自由配置各种元素组合的单行模板（文字/ antd组件/ 自定义元素...）。
根据配置的单行模板，能够去生成n行该模板的独立数据控制，排序样式，单元素填值时的基础校验，最终生成表单数据。
同时支持单行的删除。（未来会支持 up down调序）。

###### 基本使用

如下述示例，组成的是支持`整单满[?]元，赠送[x?],[number?]`的设置项；

```javascript
import Bamboo, { Components } from 'bamboosnaketool';
const { FreeCustomRowLine } = Bamboo;
// 或 const { FreeCustomRowLine } = Components;
const { FreeCustomRowLine, FreeCustomRowLine_EVENTTYPE, FreeCustomRowLine_ELEMENTTEMP } = Bamboo;

// 配置增减行
const freeCustomRowLineConfProps = {
  templateRow: [
    '整单满',
    {
      elementTEMP: FreeCustomRowLine_ELEMENTTEMP.INPUTNUMBER,
      placeholder: '价格',
      maxLength: 8,
      style: { width: 100, marginLeft: 4, marginRight: 4 },
      apiOptions: {
        min: 0
      }
    },
    '元，赠送',
    {
      elementTEMP: FreeCustomRowLine_ELEMENTTEMP.INPUT,
      placeholder: '搜索商品',
      maxLength: 10,
      style: { width: 200, marginLeft: 4, marginRight: 4 }
    },
    '，',
    {
      elementTEMP: FreeCustomRowLine_ELEMENTTEMP.INPUTNUMBER,
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
<FreeCustomRowLine {...freeCustomRowLineConfProps} />
```

如何简单理解上述呢？templateRow 是确定单行模板的如下：

```javascript
// 支持类型
{
    templateRow: [ string文本 | 内置模板对象 | JSX.Element ]
}
```

最终组件内部会平铺该数组内的所有内容组成完整的单行预模板；

###### 内置模板

演示内置模板单元的使用；

```javascript
[
...,{
    elementTEMP: FreeCustomRowLine_ELEMENTTEMP.INPUTNUMBER,
    placeholder: '数量',
    maxLength: 4,
    style: { width: 90, marginLeft: 4, marginRight: 4 },
    apiOptions: {
         min: 0
    }
}]

// 内置的模板 elementTEMP 作为它的type类型指定，可通过枚举 ELEMENTTEMP 来选取指定 （完整的单模板内容参考下面#完整参数类型）
// 目前支持 几种应用场景
// 普通输入框、纯数字输入框、支持搜索下拉的自动完成输入框、和普通文本SPAN标签元素，如下
enum FreeCustomRowLine_ELEMENTTEMP {
  INPUT,             // 输入框 - 普通
  INPUTNUMBER,       // 输入框 - 数字
  AUTOCOMPLETE,      // 输入框 - 自动完成
  SPAN,              // 文本内容
}

// 根据对元素类型的自我理解使用 [placeholder/ maxLength/ value ]；
// [style] 为通用类型，可对样式进行实际展示需要微调；
// apiOptions - 是antd的内置API支持，这些单元模板枚举完整的对应了antd的实际组件，具体可参考官方文档；

```

###### 配置按钮

配置单行模板后缀（右侧）的控制按钮组。

```javascript
// 默认仅显示[删除]按钮，目前完整按钮包含4个[删除/ 锁定行/ 向上移动/ 向下移动]
lineButtons = [
    [true, { type: FreeCustomRowLine_LINEBUTTONS.DELETE }],
    [false, { type: FreeCustomRowLine_LINEBUTTONS.LOCK }],
    [false, { type: FreeCustomRowLine_LINEBUTTONS.MOVE_UP }],
    [false, { type: FreeCustomRowLine_LINEBUTTONS.MOVE_DOWN }],
];

// 为 true 则显示反之隐藏，渲染顺序会根据当前配置内的数组排序为准

// 按钮会默认赋值内置的中文文本名称，也可以对text属性进行自定义，例↓：
[ true, { type: FreeCustomRowLine_LINEBUTTONS.DELETE, text: '剔除'}]

// 未来会扩展icon方式的渲染；
```

###### 回调响应

所有事件的响应都会**callback**统一抛出，可根据返回的行号几行内单元号进行具体的需求操作。

```javascript
const freeCustomRowLineConfProps = {
  templateRow: [
    ...
  ],
  callback: (TYPE: FreeCustomRowLine_EVENTTYPE, data: any) => {
    const { allLineDatas, rowIndex, valIndex, value } = data;
    console.log(TYPE, data);
  }
};

// 回调响应事件类型
export enum FreeCustomRowLine_EVENTTYPE {
  INIT  ='INIT',        // 初始化
  INPUT = 'INPUT',      // 输入响应
  ADD   = 'ADD',        // 新增一行
  DELETE = 'DELETE',    // 删除一行
  FOCUS = 'FOCUS',      // INPUT类型聚焦
  BLUR  = 'BLUR'        // INPUT类型失焦
}

// 响应回调返回的data数据
data = {
  allLineDatas,		// 完整的数据
  rowIndex,			// 行的下标
  valIndex,         // 单行内的下标
  value				// 响应 value / id
}

```



###### 完整参数类型

```javascript
// 控件模板类型(antd)
export enum FreeCustomRowLine_ELEMENTTEMP {
  INPUT,             // 输入框 - 普通
  INPUTNUMBER,       // 输入框 - 数字
  AUTOCOMPLETE,      // 输入框 - 自动完成
  SPAN,              // 文本内容
}

// 模板单item配置
export interface templateRowItemConf {
  elementTEMP: FreeCustomRowLine_ELEMENTTEMP; // 模板类型
  text?: string;                            // 文本
  value?: string | number;                  // inputValue -  仅input [select/ input/ textarea/ ...]类型支持
  style?: CSSStyleDeclaration | {};         // 样式
  placeholder?: string;                     // 框内描述      - 仅input类型支持
  maxLength?: string | number;              // 最大输入长度  -  仅input类型支持
  apiOptions?: {[x:string]: any}            // antd-ui api
}

// 完整单行描述
export interface templateRows {
  [index: number]: templateRowItemConf | string | JSX.Element;
  length: number;
  callee: Function;
}

// 回调响应事件类型
export enum FreeCustomRowLine_EVENTTYPE {
  INIT  ='INIT',        // 初始化
  INPUT = 'INPUT',      // 输入响应
  ADD   = 'ADD',        // 新增一行
  DELETE = 'DELETE',    // 删除一行
  FOCUS = 'FOCUS',      // INPUT类型聚焦
  BLUR  = 'BLUR'        // INPUT类型失焦
}

// 单行控制按钮
export enum FreeCustomRowLine_LINEBUTTONS {
  DELETE = 'DELETE',        // 删除一行
  LOCK = 'LOCK',            // 锁定一行
  MOVE_UP = 'MOVE_UP',      // 移动数据向上
  MOVE_DOWN = 'MOVE_DOWN'   // 移动数据向下
}

// 单个按钮配置项
export interface LineButtonItem {
  type: FreeCustomRowLine_LINEBUTTONS;        // 按钮类型
  text?: string;            // 按钮文本
  icon?: any;               // maybe 图标
}

// 一行按钮生效配置格式
export type LineButtonSetting = [ boolean, LineButtonItem ];

// 整体按钮生效配置
export interface LineButtons {
  [index: number]: LineButtonSetting;
  length: number;
  callee: Function;
}

// 行序号
export interface LineSort {
  isShow: boolean;                   // 是否显示
  textTemp?: string;                 // 序号内容及替换符模板 '${index}'
  style?: any;  // 样式
}
```



###### 配置项说明

| 配置项      | 类型                                       | 说明                               | 默认值                    | 必填 |
| ----------- | ------------------------------------------ | ---------------------------------- | ------------------------- | ---- |
| templateRow | templateRows                               | 渲染模板参与内容，确定单行渲染模板 | []                        | 是   |
| lineSort    | LineSort                                   | 行配置                             | 默认显示，具体参上        | 否   |
| lineButtons | LineButtons                                | 单行控制按钮组                     | 默认仅显 [删除]，具体参上 | 否   |
| callback    | (EVENTTYPE: EVENTTYPE, data: any) => void; | 组件回调函数                       | null                      | 否   |




