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
var antd_1 = require("antd");
var index_d_1 = require("./index.d");
var template_1 = require("./template");
var index_less_1 = require("./index.less");
// string | ((instance: HTMLDivElement | null) => void) | React.RefObject<HTMLDivElement> | null | undefined
var TableStore = function (_a) {
    var dispatch = _a.dispatch, columns = _a.columns, dataSource = _a.dataSource, rowKey = _a.rowKey, _b = _a.isShowPagination, isShowPagination = _b === void 0 ? true : _b, _c = _a.defaultFirstPage, defaultFirstPage = _c === void 0 ? 1 : _c, pageCurrent = _a.pageCurrent, _d = _a.pageTotal, pageTotal = _d === void 0 ? 0 : _d, _e = _a.pageLimit, pageLimit = _e === void 0 ? 5 : _e, _f = _a.pageSizeOptions, pageSizeOptions = _f === void 0 ? ['5', '10', '15', '20', '50'] : _f, _g = _a.isItemRender, isItemRender = _g === void 0 ? [true, index_d_1.ColumnCustomType.NORMALRENDER] : _g, tableRef = _a.tableRef, pagainRef = _a.pagainRef, onPaginationChange = _a.onPaginationChange, onPaginationShowSizeChange = _a.onPaginationShowSizeChange, ALLEVENTCallback = _a.ALLEVENTCallback, _h = _a.reloadApiTable, reloadApiTable = _h === void 0 ? {} : _h, _j = _a.reloadApiPagination, reloadApiPagination = _j === void 0 ? {} : _j, props = __rest(_a, ["dispatch", "columns", "dataSource", "rowKey", "isShowPagination", "defaultFirstPage", "pageCurrent", "pageTotal", "pageLimit", "pageSizeOptions", "isItemRender", "tableRef", "pagainRef", "onPaginationChange", "onPaginationShowSizeChange", "ALLEVENTCallback", "reloadApiTable", "reloadApiPagination"]);
    var tableSetting; // table props
    var paginationSetting; // pagination props
    // 各类修正设定
    // 识别是否定义渲染的类型模式 - customType [ date时间/ input/ any more... ]
    var filterColumns = template_1.TABLETEMP(columns, ALLEVENTCallback, { isItemRender: isItemRender });
    // Table / Pagination 数据规整
    tableSetting = __assign({
        columns: filterColumns,
        dataSource: dataSource,
        rowKey: rowKey,
        pagination: false
    }, reloadApiTable);
    paginationSetting = Object.assign({
        showSizeChanger: true,
        defaultCurrent: defaultFirstPage,
        current: pageCurrent,
        total: pageTotal,
        pageSize: pageLimit,
        pageSizeOptions: pageSizeOptions,
        showQuickJumper: true,
        onChange: onPaginationChange,
        onShowSizeChange: onPaginationShowSizeChange,
        showTotal: function (numb) { return "\u5171 " + numb + " \u6761\u6570\u636E"; }
    }, reloadApiPagination);
    return (react_1["default"].createElement("div", { className: index_less_1["default"].tableWrapper },
        react_1["default"].createElement("div", { className: index_less_1["default"].tableBox, ref: tableRef },
            react_1["default"].createElement(antd_1.Table, __assign({}, tableSetting))),
        isShowPagination &&
            react_1["default"].createElement("div", { className: index_less_1["default"].paginationBox, ref: pagainRef },
                react_1["default"].createElement(antd_1.Pagination, __assign({}, paginationSetting)))));
};
// connect props...
var mapStateToProps = function (ALL) {
    var loading = ALL.loading;
    return __assign({}, loading);
};
exports["default"] = umi_1.connect(mapStateToProps)(TableStore);
