import XLSX from "xlsx";
import { ExcelConfig, ExcelRule, rule } from './type';

/**
 * author: chenguangfu
 * name: Excel导入数据分析转换+验证器
 * 
 * desc:
 * 
 * 针对繁琐的Excel文件导入后，可自由对数据进行多种方式的校验，并有多个环节进行校验及其他条件抛出的异常或警示，最终将中文列头名称的数据转换为指定格式的Json数据。
 * 
 */

class ImportFileExcelDataVerifyTool {
  // 拦截函数
  private _interceptor: Function = function(data: any, erros: []): boolean {
    return true;
  };

  // 验证通过数据
  private datas: any = [];

  // 总条数
  private total: number = 0;

  // 失败条数
  private error: number = 0;

  // 行数据验证消息
  private rowMsg: [string?] = [];

  // 错误消息
  private errorMsg: any = {};

  // 列字段
  private columns: any = [];

  // 列字段验证规则
  private columnRules: any = [];

  // 类型字段
  private columnTypes: any = [];

  // 预警值resolver
  private warnReject: any = null;
  private warnResolve: any = null;
  private warnCallback: any = null;

  // 配置规则 - 默认参数
  private config: ExcelConfig = {
    sheet: 0,
    max: 500,
    warn: 500,
    startIndex: 0,
    file: null,
    columns: [],
  };

  // 常用正则校验规则
  private internalRules: any = {
    number: /^-?\d+$/,
    not_empty: /^(?!\s*$).+/,
    numeric: /^-?\d+\.?\d*$/,
    mobile: /^1[35789]\d{9}$/,
    idcard: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/,
  };

  constructor(config: ExcelConfig) {
    // init...
    this.config = Object.assign(this.config, config);

    this.setColumns();

    this.setDefaultMsg();

    this.setRules();

    this.setTypes();
  }

  /**
   * 用户自己验证行数据
   * @param callback
   * @returns boolean return false 直接中断抛出异常
   */
  public interceptor(callback: (rowData: any, error: any) => boolean) {
    this._interceptor = callback;

    return this;
  }

  /**
   * warn
   */
  public warn(callback: (msg: string, resolve: any, reject: any) => void) {
    this.warnCallback = callback;
    return this;
  }

  // 验证数据方法
  public valid(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.validConfig();
        this.validFile();
      } catch (error) {
        let msg = [error.message];

        reject({ msg, type: "error" });
      }

      // 读取excel
      let reader = new FileReader();

      let sheetNum = this.config.sheet || 0;

      reader.onload = (e: any) => {
        let data = e.target.result;
        let workbook = XLSX.read(data, { type: "binary" });
        let sheetNames = workbook.SheetNames;
        let worksheet = workbook.Sheets[sheetNames[sheetNum]];
        let json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        // excel数据为空
        if (!json || json.length == 0) {
          reject({ msg: ["导入数据为空"], type: "error" });
          return;
        }

        new Promise((warnResolve, warnReject) => {
          this.warnResolve = warnResolve;
          this.warnReject = warnReject;
        })
          .then(() => {
            // 校验格式
            try {
              this.validRows(json);
            } catch (error) {
              let msg = [error.message];

              reject({ msg, type: "error" });
            }

            if (this.error > 0) {
              let detailMsg = this.getErrMsgDetail();

              return reject({ msg: detailMsg, type: "error" });
            }
            resolve({ total: this.total, data: this.datas });
          })
          .catch(() => {
            reject({ msg: ["用户取消导入"], type: "warn" });
          });

        if (
          this.config.warn &&
          json.length > this.config.warn &&
          this.warnCallback
        ) {
          let msg = `excel数据过大，超过预警值${this.config.warn}条，是否需要继续导入？`;

          this.warnCallback(msg, this.warnResolve, this.warnReject);
        } else if (this.config.max && json.length > this.config.max) {
          this.warnReject();
          return reject({
            msg: [`excel数据过大，超过限定值${this.config.max}条`],
            type: "error",
          });
        } else {
          this.warnResolve();
        }
      };

      reader.readAsBinaryString(this.config.file as Blob);
    });
  }

  // 参数过界校验
  private validConfig() {

    if (this.config.warn>this.config.max) {
      throw new Error(`预警数量${this.config.max}大于最大限制数量${this.config.max}`);
    }

    this.config.startIndex = this.config.startIndex<0?0:this.config.startIndex;
  }

  // 设置默认错误消息
  private setDefaultMsg() {
    this.config.columns.forEach((it:any)=>{
      if (it.rules) {
        it.rules.forEach((rule: any) => {
          rule.msg = rule.msg ? rule.msg : this.getDefaultMsg(rule.type, it.key)
        });
      }
      
    })
  }

  private getDefaultMsg(type:string, key:string) {
    let msg = "";

    switch (type) {
      case "not_empty":
        msg = "不能为空";
        break;
      case "number":
        msg = "必须是整数";
        break;
      case "numeric":
        msg = "必须是数字";
        break;
      case "mobile":
        msg = "必须是手机号";
      case "idcard":
        msg = "必须是身份证号";
        break;
      case "customer":
        msg = "格式错误";
        break;
      case "default":
        msg = "格式错误";
        break;
    }

    return key+msg;
  }

  /**
   * 校验文件
   */
  private validFile() {
    // 校验文件对象
    if (!this.config.file) {
      throw new Error("导入文件对象为空");
    }

    // 文件类型校验
    let validMimeTypes = Object.assign(
      [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ],
      this.config.mimeType
    );

    if (!validMimeTypes.includes(this.config.file.type)) {
      throw new Error("导入文件类型错误");
    }
  }

  // 单行报错内容文本
  private getErrMsgDetail() {
    let msgStr = [];

    for (let lineNumber in this.errorMsg) {
      msgStr.push(`第${lineNumber}行: ${this.errorMsg[lineNumber].join(",")}`);
    }

    return msgStr;
  }

  // 设置列 cnKey --transf--> enKey
  private setColumns() {
    this.config.columns.forEach((column: any) => {
      if (column.toKey) {
        this.columns[column.key] = column?.toKey;
      }
    });
  }

  // 设置规则 - 装载每列配置的校验规则
  private setRules() {
    this.config.columns.forEach((column: any) => {
      let key = column.toKey ? column.toKey : column.key;
      this.columnRules[key] = column.rules || [];
    });
  }

  // 设置类型
  private setTypes() {
    this.config.columns.forEach((column: any) => {
      let key = column.toKey ? column.toKey : column.key;
      this.columnTypes[key] = column.type || "string";
    });
  }

  // 数据装换
  private transfer(row: any) {
    let result: any = {};

    for (let key in row) {
      if (this.columns[key]) {
        result[this.columns[key]] = this.typeTransfer(
          row[key],
          this.columnTypes[this.columns[key]]
        );
      }
    }

    return result;
  }

  // 类型装换
  private typeTransfer(data: any, type: string) {
    type = type ? type : "string";

    let result = null;
    let timeStamp = null;

    switch (type.toLowerCase()) {
      case "string":
        result = String(data);
        break;

      case "number":
        result = Number(data);
        break;

      case "float":
        result = parseFloat(data);
        break;

      case "boolean":
        result = data == "true" || data == "1" ? true : false;
        break;

      // 年-月-日 时:分:秒
      case "datetime":
        timeStamp = Number(data);
        if (data && (typeof data == "number" || !isNaN(timeStamp))) {
          result = timeFormat(new Date(Number(data)), "yyyy-MM-dd hh:mm:ss");
        } else {
          result = data || "";
        }
        break;

      // 年-月-日
      case "date":
        timeStamp = Number(data);
        if (data && (typeof data == "number" || !isNaN(timeStamp))) {
          result = timeFormat(new Date(Number(data)), "yyyy-MM-dd");
        } else {
          result = data || "";
        }
        break;

      // 时:分:秒
      case "time":
        timeStamp = Number(data);
        if (data && (typeof data == "number" || !isNaN(timeStamp))) {
          result = timeFormat(new Date(Number(data)), "hh:mm:ss");
        } else {
          result = data || "";
        }
        break;

      default:
        result = data;
        break;
    }

    return result;
  }

  // 规则校验
  private validRules(data: any) {
    for (let colKey in data) {
      let rules = this.columnRules[colKey];
      if (rules.length > 0) {
        this.validColumnWithRule(data[colKey], rules);
      }
    }
  }

  // 列值校验
  private validColumnWithRule(value: any, rules: [rule]) {
    rules.forEach((rule: rule) => {
      let checkRule = this.internalRules[rule.type];

      if (checkRule && (!checkRule.test(String(value)) || value === "")) {
        rule.msg && this.rowMsg.push(rule.msg);
      } else if (rule.type == ExcelRule.CUSTOMER) {
        if (rule.valid && !rule.valid(value)) {
          rule.msg && this.rowMsg.push(rule.msg);
        }
      }
    });
  }

  // 合并错误
  private mergeError() {
    let zh_keys = this.config.columns
      .map((it: any) => {
        return it.key;
      })
      .join("|");

    let reg = new RegExp(`(${zh_keys})(.*)`),
      msgs: any = {};

    this.rowMsg.forEach((msg: any) => {
      let matchSuffix = msg.match(reg);

      if (matchSuffix.length) {
        msgs[matchSuffix[2]] = msgs[matchSuffix[2]] || [];
        msgs[matchSuffix[2]].push(matchSuffix[1]);
      }
    });

    this.rowMsg = [];

    for (let msgsKey in msgs) {
      this.rowMsg.push(msgs[msgsKey].join("/") + msgsKey);
    }
  }

  // 行校验
  private validRows(datas: any) {
    let startIndex = this.config.startIndex || 0;

    if (startIndex > 0) {
      this.config.isDebugger &&
        console.warn(`将从${startIndex}开始遍历excel行`);
    }

    datas.forEach((row: any, rowIndex: number) => {
      if (row.__rowNum__ + 1 >= startIndex) {
        let data = this.transfer(row);

        this.rowMsg = [];

        this.validRules(data);

        if (!this._interceptor(data, this.rowMsg)) {
          this.config.isDebugger &&
            console.error("开发者使用interceptor中断操作");
          throw new Error("校验错误");
        }

        if (this.rowMsg.length) {
          // 记录错误行
          this.mergeError();
          this.errorMsg[row.__rowNum__ + 1] = Object.assign([], this.rowMsg);
        } else {
          this.datas.push(data);
        }
      }
    });

    // 总行数
    this.total = datas.length;

    // 出错行数
    this.error = Object.keys(this.errorMsg).length;
  }
}


// 时间格式化
/**
 * 
 * @param date 
 * @param fmt yyyy-MM-dd hh:mm:ss
 * @returns string
 */
function timeFormat(date:Date, fmt:string) {
  let o:any = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};


/**
 * 读取EXCEL数据
 * @param config:ExcelConfig
 * @returns _ReadExcelData对象
 */

/* const ImportFileExcelDataVerifyTool = (config: ExcelConfig) => {
  return new _ImportFileExcelDataVerifyTool(config);
};
 */
export * from './type';
export default ImportFileExcelDataVerifyTool;