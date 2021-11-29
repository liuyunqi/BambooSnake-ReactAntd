# 表格列组件

## 功能
1. 动态变动表格列数据
2. 支持列数据存储
3. 支持列数据拖动排序

## 基本使用
1. 给定表格列数据，此列数据需要可以变动
``` javascript
const [ columns, setColumns ] = useState(initColumn);  // 表格列项
```

2. 定义列变动通知方法
``` javascript
const colChange = (data:any, close:any)=>{

	// 选择的列数据
	let { columns, width } = data;

	// 如果操作列单独拿出来的，需要手动放进去
	setColumns([...columns, ACTION_OPERATION]);

	// 关闭列选择弹出窗
	close();
}
```

3. 在按钮或者其他元素上套上插件，并给予配置项
``` jsx
<TableColumnsLayer columns={columns} onChange={colChange}>
	<Button type="primary" ghost>
	  列选择
	</Button>
</TableColumnsLayer>
```

## 配置项
| 配置项   | 类型 | 说明                                                                                | 默认值 |
| ----------- | ------ | ------------------------------------------------------------------------------------- | ------ |
| columns     | 数组 | 表格的列数据                                                                    | 必填 |
| onChange    | 函数 | 回调函数，会回调给用户2个参数，一个data(包含columns和width)，一个是关闭弹出窗口的方法 | 必填 |
| table       | ref    | 默认插件会自己去找table，用户也可以传入table的ref，这样会更加准确 | 非必填 |
| needStorage | 布尔值 | 是否存储此次操作的列数据，如果存储，下次进来会读取存储中的数据 | false  |

## 注意事项
1. 未传入ref，组件会自己去找，多个表格的情况有可能会出错，最好把表格的ref传入
2. 如果操作列没有放到column，而是后面加入，那么回调方法中回调的列数据不包含操作列，需要手动把列数据放入，否则可能会出现操作列不见的情况

