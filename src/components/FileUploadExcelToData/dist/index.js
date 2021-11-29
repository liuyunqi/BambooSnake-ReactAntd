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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var umi_1 = require("umi");
var antd_1 = require("antd");
var icons_1 = require("@ant-design/icons");
var XLSX = require("xlsx");
var index_less_1 = require("./index.less");
var module = function (_a) {
    var dispatch = _a.dispatch, _b = _a.isDisabled, isDisabled = _b === void 0 ? false : _b, _c = _a.isLoading, isLoading = _c === void 0 ? false : _c, _d = _a.fileTypeStr, fileTypeStr = _d === void 0 ? {
        override: false,
        names: []
    } : _d, _e = _a.singleUploadMaxLength, singleUploadMaxLength = _e === void 0 ? 3000 : _e, _f = _a.slowMaybeMaxLength, slowMaybeMaxLength = _f === void 0 ? 2000 : _f, callback = _a.callback, _g = _a.uploadApiOptions, uploadApiOptions = _g === void 0 ? {} : _g, props = __rest(_a, ["dispatch", "isDisabled", "isLoading", "fileTypeStr", "singleUploadMaxLength", "slowMaybeMaxLength", "callback", "uploadApiOptions"]);
    var defFielTypeStr = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (fileTypeStr.override) {
        defFielTypeStr = fileTypeStr.names;
    }
    else {
        defFielTypeStr = __spreadArrays(new Set(defFielTypeStr.concat(fileTypeStr.names))); // Object.values(new Set(defFielTypeStr.concat(fileTypeStr.names)));
    }
    // 上传控件 - antd
    var uploadProps = __assign({ fileList: [], customRequest: function (_a) {
            var action = _a.action, data = _a.data, file = _a.file, filename = _a.filename, headers = _a.headers, onError = _a.onError, onProgress = _a.onProgress, onSuccess = _a.onSuccess, withCredentials = _a.withCredentials;
            var reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = function (e) {
                try {
                    // 校验上传文件类型是否为Excel
                    if (!defFielTypeStr.includes(file.type)) {
                        antd_1.message.warning('请上传正确的Excel格式文件');
                        return;
                    }
                    var data_1 = e.target.result; // 返回数据
                    var wb = XLSX.read(data_1, { type: 'binary' }); // binary - 二进制转换
                    var jsonData_1 = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { raw: false }); // sheetExcel页签
                    // 获取头部
                    // 当前分析的头部只能作为基础参考, 不太准确, 比如测试多门店参数时, value = '5024/5023/5021', 居然也被查询到为 columnName
                    var excelColumns_1 = [];
                    wb.Strings.forEach(function (item) {
                        if (item.t.trim())
                            excelColumns_1.push(item.t);
                    });
                    if (jsonData_1.length > singleUploadMaxLength) {
                        antd_1.message.warning("\u5355\u6B21\u5BFC\u5165\u6570\u636E\u91CF\u8FC7\u5927\uFF0C\u6700\u5927\u4E0A\u9650\u4E3A" + singleUploadMaxLength + "\u6761\u3002");
                        return;
                    }
                    if (jsonData_1.length > slowMaybeMaxLength) {
                        new Promise(function (resolve, reject) {
                            antd_1.Modal.confirm({
                                title: '导入提示',
                                icon: react_1["default"].createElement(icons_1.ExclamationCircleOutlined, null),
                                content: '当前导入数据较多，可能稍需等待较长，是否继续？',
                                okText: '继续',
                                cancelText: '取消',
                                onOk: function () {
                                    resolve('ok');
                                },
                                onCancel: function () {
                                    reject('cancel');
                                }
                            });
                        }).then(function (ok) {
                            callback && callback({ jsonData: jsonData_1, excelColumns: excelColumns_1 }, onSuccess, file);
                        })["catch"](function (err) { });
                    }
                    else {
                        callback && callback({ jsonData: jsonData_1, excelColumns: excelColumns_1 }, onSuccess, file);
                    }
                }
                catch (err) {
                    console.log(err);
                    antd_1.message.error('导入文件异常，请检查');
                }
            };
        }, multiple: false, onChange: function (res) {
            /* if (res.file.status !== 'uploading') {
              let reader = new FileReader();
              reader.readAsBinaryString(res.file);
              reader.onload = (e: any) => {
                let data = e.target.result;
                let wb = XLSX.read(data, { type: 'binary' });
                let jsonData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { raw: false });
                // 模板具体方式有待商榷，再进行解析逻辑
                message.info('解析成功！');
              }
            }
      
            if (res.file.status === 'done') {
              message.success(`${res.file.name} file uploaded successfully`);
            } else if (res.file.status === 'error') {
              message.error(`${res.file.name} file upload failed.`);
            } */
        } }, uploadApiOptions);
    return (react_1["default"].createElement("div", { className: index_less_1["default"].wrapper },
        react_1["default"].createElement(antd_1.Upload, __assign({}, uploadProps),
            react_1["default"].createElement(antd_1.Button, { type: "primary", ghost: true, title: "\u9009\u62E9\u4E00\u4EFDexcel\u6587\u4EF6", loading: isLoading, disabled: isDisabled }, "\u5BFC\u5165"))));
};
// connect props...
var mapStateToProps = function (ALL) {
    var loading = ALL.loading;
    return __assign({}, loading);
};
exports["default"] = umi_1.connect(mapStateToProps)(module);
