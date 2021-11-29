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
exports.__esModule = true;
var react_1 = require("react");
var umi_1 = require("umi");
var echarts = require("echarts");
// import echarts from 'echarts/lib/echarts';
require("echarts/lib/chart/bar");
require("echarts/lib/chart/line");
var EchartMatrix = function (_a) {
    var dispatch = _a.dispatch, _b = _a.elementId, elementId = _b === void 0 ? 'echartMain' : _b, _c = _a.setOptions, setOptions = _c === void 0 ? {} : _c, _d = _a.setStyle, setStyle = _d === void 0 ? {} : _d, props = __rest(_a, ["dispatch", "elementId", "setOptions", "setStyle"]);
    // init...
    react_1.useEffect(function () {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById(elementId));
        // 绘制图表
        myChart.setOption(setOptions);
    }, [1]);
    return (react_1["default"].createElement("div", { id: elementId, style: setStyle }));
};
// connect props...
var mapStateToProps = function (ALL) {
    var loading = ALL.loading;
    return __assign({}, loading);
};
exports["default"] = umi_1.connect(mapStateToProps)(EchartMatrix);
