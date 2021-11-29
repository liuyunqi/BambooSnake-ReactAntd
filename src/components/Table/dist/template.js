"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.TABLETEMP = exports.TABLETEMPX_UNUSE = exports.renderDATESTRING = exports.renderLINKBUTTON = exports.renderINPUT = exports.renderNORMALRENDER = exports.emptyReturn = exports.emptyReturnUNUSE = void 0;
/*
  自由配置表格模板；
  column里无需配置事件函数，这里会根据必备函数按定制化方式提前编写好；
*/
var react_1 = require("react");
var antd_1 = require("antd");
var index_d_1 = require("./index.d");
var baseTool_1 = require("@/public/utils/baseTool");
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
exports.emptyReturnUNUSE = function (value, replaceStr) {
    if (replaceStr === void 0) { replaceStr = '-'; }
    return (value === undefined || value === '') ? '-' : value;
};
// 检测文本值是否为 空
exports.emptyReturn = function (value, replaceStr) {
    if (replaceStr === void 0) { replaceStr = '-'; }
    var isEmpty = false; // 是否为空
    var returnValue = replaceStr; // 返回结果
    if (value === undefined || value === '') {
        isEmpty = true;
    }
    else {
        returnValue = value;
    }
    return [isEmpty, returnValue];
};
// 默认常规渲染
exports.renderNORMALRENDER = function (columnItem, text, record, index, options, ALLCALLBACK) {
    if (options === void 0) { options = {}; }
    var setProperty = options.customSettings || {};
    var _a = exports.emptyReturn(text), isEmpty = _a[0], setVal = _a[1];
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement("span", __assign({}, setProperty), setVal)));
};
// 单输入框
exports.renderINPUT = function (columnItem, text, record, index, options, ALLCALLBACK) {
    if (options === void 0) { options = {}; }
    var props = { record: record, columnItem: columnItem, index: index };
    var _a = exports.emptyReturn(text), isEmpty = _a[0], setVal = _a[1];
    var apis = options.optionsApi || {};
    var setApis = __assign({}, apis);
    setApis = __assign(__assign(__assign({}, apis), {
        value: text
    }), {
        onFocus: function (e) { return ALLCALLBACK(index_d_1.Enum_ALLEVENT.INPUT_onFocus, __assign({ e: e }, props)); },
        onChange: function (e) { return ALLCALLBACK(index_d_1.Enum_ALLEVENT.INPUT_onChange, __assign({ e: e }, props)); },
        onPressEnter: function (e) { return ALLCALLBACK(index_d_1.Enum_ALLEVENT.INPUT_onPressEnter, __assign({ e: e }, props)); },
        onBlur: function (e) { return ALLCALLBACK(index_d_1.Enum_ALLEVENT.INPUT_onBlur, __assign({ e: e }, props)); }
    });
    return (react_1["default"].createElement("div", null, isEmpty ?
        react_1["default"].createElement("span", null, setVal)
        :
            react_1["default"].createElement(antd_1.Input, __assign({}, setApis))));
};
// 链接按钮 - 可着色
exports.renderLINKBUTTON = function (columnItem, text, record, index, options, ALLCALLBACK) {
    if (options === void 0) { options = {}; }
    var props = { record: record, columnItem: columnItem, index: index };
    var customSettings = columnItem.condition.customSettings;
    var setStyle = {};
    var emptyValue = undefined;
    // console.log('renderLINKBUTTON', columnItem, options);
    if (customSettings && customSettings.style)
        setStyle = customSettings.style;
    var setProperty = options.customSettings || {};
    var setApis = options.optionsApi || {};
    if (setProperty && setProperty.style)
        setStyle = setProperty.style;
    if (setProperty && setProperty.emptyValue)
        emptyValue = setProperty.emptyValue;
    var _a = exports.emptyReturn(text, emptyValue), isEmpty = _a[0], setVal = _a[1];
    setApis = __assign(__assign({}, setApis), {
        style: __assign({}, setStyle),
        onClick: function (e) { return ALLCALLBACK(index_d_1.Enum_ALLEVENT.LINKBUTTON_onClick, __assign({ e: e }, props)); }
    });
    return (react_1["default"].createElement("div", null, isEmpty ?
        react_1["default"].createElement("span", null, setVal)
        :
            react_1["default"].createElement("a", __assign({}, setApis),
                " ",
                text,
                " ")));
};
// Date 转 日期字符串
exports.renderDATESTRING = function (columnItem, text, record, index, options, ALLCALLBACK) {
    if (options === void 0) { options = {}; }
    var setProperty = options.customSettings || {};
    var _a = exports.emptyReturn(text.toString()), isEmpty = _a[0], setVal = _a[1];
    var toNumber = parseInt(text);
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement("span", __assign({}, setProperty), baseTool_1.dateTransformer(new Date(toNumber), baseTool_1.enumDataMode.FULL))));
};
// 模板渲染配置器 (廢棄)
exports.TABLETEMPX_UNUSE = function (columns, eventAllCallback) {
    // 识别是否定义渲染的类型模式 - customType [ date时间/ input/ any more... ]
    return columns.map(function (item, index) {
        var CKEY = item[index_d_1.customType];
        var callback = null;
        if (CKEY) {
            if (CKEY === index_d_1.ColumnCustomType.INPUT) {
                callback = exports.renderINPUT;
            }
            else if (CKEY === index_d_1.ColumnCustomType.LINKBUTTON) {
                callback = exports.renderLINKBUTTON;
            }
        }
        if (typeof callback === 'function') {
            /*
              @item: column-item: 当表格多列都出现同个组件渲染时，可作类似symbol效果做不同数据在回调事件中的区分.
              @record: table-rowData
            */
            item.render = function (text, record, index) {
                return callback(item, text, record, index, (item.optionsApi || {}), eventAllCallback);
            };
        }
        return item;
    });
};
exports.TABLETEMP = function (columns, eventAllCallback, props) {
    // 识别是否定义渲染的类型模式 - customType [ date时间/ input/ any more... ]
    var isItemRender = props.isItemRender;
    return columns.map(function (item, index) {
        var isConditionRender = item.condition; //
        if (isConditionRender) {
            if (!Array.isArray(isConditionRender)) {
                throw Error('表格配置错误，请检查。正确格式为： condition:[boolean, render1, render2 | recursionCondition?:[...]]');
            }
            item.render = function (text, record, index) {
                var _a = recursiveCondition(isConditionRender, record), renderCall = _a[0], setConf = _a[1];
                return renderCall(item, text, record, index, (setConf || {}), eventAllCallback);
            };
        }
        else if (isItemRender[0]) {
            var setNormalTemp_1 = {
                customType: isItemRender[1]
            };
            // 避免覆盖已配置的render-function, 否则会执行报错！
            item.render === undefined && (item.render = function (text, record, index) {
                var _a = recursiveCondition([true, setNormalTemp_1], record), renderCall = _a[0], setConf = _a[1];
                return renderCall(item, text, record, index, (setConf || {}), eventAllCallback);
            });
        }
        return item;
    });
};
// 递归条件
function recursiveCondition(conditArr, record) {
    var unit0 = conditArr[0]; // boolean | eval(string)
    var unit1 = conditArr[1];
    var unit2 = conditArr[2];
    var rz = false; // 是否执行 c1
    var result;
    if (typeof unit0 === 'boolean') {
        rz = unit0;
    }
    else if (typeof unit0 === 'string') {
        rz = eval(unit0);
    }
    if (rz) {
        result = [allocationTemp(unit1), unit1];
    }
    else {
        // if (unit2 === undefined) throw Error('unit2必须配置。');
        if (unit2 === undefined) {
            result = [exports.renderNORMALRENDER, {}];
        }
        else {
            if (Array.isArray(unit2)) {
                result = recursiveCondition(unit2, record);
            }
            else if (typeof unit2 === 'object') {
                result = [allocationTemp(unit2), unit2];
            }
            else {
                throw Error('配置的unit2参数类型不正确，请检查配置内容。');
            }
        }
    }
    return result;
}
// 模板分配
function allocationTemp(unit) {
    var CKEY = unit[index_d_1.customType];
    var callback = null;
    // 此处有修改的空间，让今后使用者能够外部定义模板及模板类型名称
    if (CKEY) {
        if (CKEY === index_d_1.ColumnCustomType.NORMALRENDER) {
            callback = exports.renderNORMALRENDER;
        }
        else if (CKEY === index_d_1.ColumnCustomType.INPUT) {
            callback = exports.renderINPUT;
        }
        else if (CKEY === index_d_1.ColumnCustomType.LINKBUTTON) {
            callback = exports.renderLINKBUTTON;
        }
        else if (CKEY === index_d_1.ColumnCustomType.DATESTRING) {
            callback = exports.renderDATESTRING;
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
