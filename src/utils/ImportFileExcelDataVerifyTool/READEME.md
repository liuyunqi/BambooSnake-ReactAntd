# 导入excel获取数据插件

## 基本使用
场景：想把excel的中文列头转成英文字段并且拿到转换后的数组，key是excel的列头中文，toKey是需要将原来的中文列头转成什么字段，type表示列值的类型，如果设置了type，那么转换后的数据类型会转成设置的type类型，类型枚举可使用ExcelType，目前包括的枚举(STRING, NUMBER, BOOLEAN, DATETIME, DATE, TIME, FLOAT)
``` javascript
import { importFileExcelDataVerifyTool, ExcelType } from "@/public/utils/importExcel";

	importFileExcelDataVerifyTool({
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

## 设置预警值
场景：有限定用户excel数据量大小，并且需要告知用户数据量已经超出询问用户是否继续导入
``` javascript
import { importFileExcelDataVerifyTool } from "@/public/utils/importExcel";

importFileExcelDataVerifyTool({
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
## 设置起始行
场景：需要从指定的excel行开始读取数据，可以设置startIndex配置，默认从第一行开始
``` javascript
import { importFileExcelDataVerifyTool, ExcelRule } from "@/public/utils/importExcel";

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

## 验证
场景：需要对上传的excel数据字段值进行校验，插件本身提供内置的验证，具体可使用插件暴露出的ExcelRule枚举查看，如果想要自己定义验证，可以使用ExcelRule.Customer，然后定义valid回调函数，回调函数会传入读取到的行数据（注：如果定义了转换的key，那么读取到的行数据中的列字段是经过转换的，不是excel显示的中文），回调函数如果返回true，表示验证通过，验证结束后，错误的验证消息会通过catch方法来进行捕捉，错误的消息可以通过配置msg字段来提示，如果不配置插件会使用自己定义的消息提示，一般来说如果使用了内置的验证会提示内置的验证提示，比如使用身份证号验证将默认提示xxx必须是身份证号，没有的内置验证将提示xxx格式错误
``` javascript
import { importFileExcelDataVerifyTool, ExcelRule } from "@/public/utils/importExcel";

importFileExcelDataVerifyTool({
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

## 手动添加数据
场景：1. 需要在行数据上添加字段 2. 想要遍历指定字段然后中断读取操作 可以使用interceptor方法，此方法会回调给用户行数据和验证过后的错误消息，此函数如果返回false则表示中断excel读取操作，如果返回false此函数会触发catch回调
``` javascript

importFileExcelDataVerifyTool({
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

## 配置项说明
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


## 方法说明
| 方法      | 说明                                                                                                                        |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| valid       | 校验方法，必须调用                                                                                                   |
| warn        | 配置了warn字段必须调用，会有三个参数回调给用户(msg, confirm, cancel) msg为消息，confirm为用户继续操作，cancel表示取消数据读取 |
| interceptor | 此方法会回调给用户当前行数据和错误消息，如果用户在此方法中返回false，会中断读取数据操作，并且会调用catch抛出异常 |
| then        | 数据读取完成无错误会回调给用户一个对象，{ total: 总行数, data: 数据数组 }                          |
| catch       | 数据读取中如果有校验错误或者在intercepotor里返回false都会触发此方法，并回调给用户一个对象{type:'error', msg:['错误消息']} |



## 枚举类型
| 类型    | 说明     |
| --------- | ---------- |
| ExcelRule | 内置规则枚举(NUMBER整数验证 MOBILE手机号验证 IDCARD身份证验证 NUMERIC小数验证 NOT_EMPTY非空验证 CUSTOMER自定义验证) |
| ExcelType | 列类型枚举(STRING字符串 NUMBER整数数值包括负数 FLOAT小数 BOOLEAN布尔类型 DATETIME年月日时分秒格式 DATE年月日格式 TIME时分秒格式) |