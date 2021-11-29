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
exports.columnItemDecorator = exports.columnItemMerge = exports.ColumnRender_operationAction = exports.enumViewMode = exports.enumEventType = void 0;
var react_1 = require("react");
var antd_1 = require("antd");
var creator_less_1 = require("./creator.less");
/*
  应用场景说明：

  事件类型 -
  
  callback适用于所有场景，modal及popconfirm适用于一些简单的显示方式，例若是复杂的modal建议走callback，与具体业务页面进行定制重写；

*/
// 事件类型
var enumEventType;
(function (enumEventType) {
    enumEventType["CALLBACK"] = "callback";
    enumEventType["POPCONFIRM"] = "popconfirm";
    enumEventType["MODALBOX"] = "modalbox";
})(enumEventType = exports.enumEventType || (exports.enumEventType = {}));
// 结构方式
var enumViewMode;
(function (enumViewMode) {
    enumViewMode["DEFAULT"] = "default";
    enumViewMode["ICON"] = "icon";
    enumViewMode["ICONTEXT"] = "iconText";
})(enumViewMode = exports.enumViewMode || (exports.enumViewMode = {}));
// 操作渲染
exports.ColumnRender_operationAction = function (text, record, index, actions) {
    console.log('===<>>record', record);
    console.log('===<>>text', text);
    var insetDom = [];
    // 分配
    var allocation = function (eventType, eventSubstance) {
        if (eventType === enumEventType.CALLBACK) {
            eventSubstance(record);
        }
        else {
            var _a = eventSubstance, title = _a.title, content = _a.content, ok = _a.ok, cancel = _a.cancel;
            if (eventType === enumEventType.MODALBOX) {
                creatModal({ title: title, content: content, ok: ok, cancel: cancel });
            }
            else if (eventType === enumEventType.POPCONFIRM) {
                // antd HTML bind
            }
        }
    };
    // 模态确认框
    var creatModal = function (_a) {
        var title = _a.title, content = _a.content, ok = _a.ok, cancel = _a.cancel;
        antd_1.Modal.confirm({
            title: title,
            content: content,
            onOk: function () {
                ok(record);
            },
            onCancel: function () {
                cancel();
            }
        });
    };
    // 气泡确认框
    var creatPopconfirm = function (xHtml, _index, _a) {
        var title = _a.title, content = _a.content, ok = _a.ok, cancel = _a.cancel;
        return (react_1["default"].createElement(antd_1.Popconfirm, { placement: "topRight", title: title, onConfirm: function () { return ok(record); }, onCancel: function () { return cancel(); }, okText: '是', cancelText: '否', key: _index }, xHtml));
    };
    // btn.style class
    var buttonStyleSetClass = function (_a) {
        var isLocked = _a.isLocked, isHide = _a.isHide, isTransparent = _a.isTransparent;
        var setStyle = '';
        if (isHide) {
            setStyle = creator_less_1["default"].actionStateHide;
        }
        else if (isTransparent) {
            setStyle = creator_less_1["default"].actionStateTransparent;
        }
        else if (isLocked) {
            setStyle = creator_less_1["default"].actionStateLocked;
        }
        return creator_less_1["default"].operationButton + " " + setStyle;
    };
    // render actions
    actions.forEach(function (_item, _idx) {
        var text = _item.text, icon = _item.icon, _a = _item.eventType, eventType = _a === void 0 ? enumEventType.CALLBACK : _a, eventSubstance = _item.eventSubstance, viewMode = _item.viewMode, condition = _item.condition;
        var btn = null;
        var isLocked = false;
        var isHide = false;
        var isTransparent = false;
        // let isEventType: enumEventType | null = null;
        if (!eventSubstance)
            throw Error('操作单项的事件资产配置必须存在，请编码人员补齐。(components/Table/creator.tsx - eventSubstance)');
        // 渲染类型 锁定、占位隐藏、隐藏
        if (condition &&
            JSON.stringify(condition) !== '{}' &&
            (condition.locked || condition.hide || condition.transparent)) {
            var locked = condition.locked, hide = condition.hide, transparent = condition.transparent;
            if (locked)
                isLocked = eval(locked);
            if (hide)
                isHide = eval(hide);
            if (transparent)
                isTransparent = eval(transparent);
        }
        // 根据状态得出classString
        var getButtonStyleClass = buttonStyleSetClass({ isLocked: isLocked, isHide: isHide, isTransparent: isTransparent });
        // 事件阻断
        var stopExecute = isLocked || isTransparent;
        // 渲染类型
        if (!viewMode || viewMode === enumViewMode.DEFAULT) {
            btn = react_1["default"].createElement("a", { className: getButtonStyleClass, onClick: function () { return !stopExecute && allocation(eventType, eventSubstance); }, key: _idx }, text);
        }
        else if (viewMode === enumViewMode.ICON) {
            btn = react_1["default"].createElement("div", { className: getButtonStyleClass, onClick: function () { return !stopExecute && allocation(eventType, eventSubstance); }, title: text, key: _idx },
                react_1["default"].createElement("i", { className: creator_less_1["default"].operationIcon }, icon));
        }
        else if (viewMode === enumViewMode.ICONTEXT) {
            btn = react_1["default"].createElement("div", { className: getButtonStyleClass, onClick: function () { return !stopExecute && allocation(eventType, eventSubstance); }, key: _idx },
                react_1["default"].createElement("i", { className: creator_less_1["default"].operationIcon }, icon),
                react_1["default"].createElement("a", { className: creator_less_1["default"].operationText }, text));
        }
        // 气泡确认模式 - 由受限于 antd 的 jsxhtml 结构要求。（无法脚本api调用）
        if (eventType === enumEventType.POPCONFIRM && btn && !stopExecute) {
            btn = creatPopconfirm(btn, _idx, eventSubstance);
        }
        insetDom.push(btn);
    });
    return (react_1["default"].createElement("div", null, insetDom.map(function (item) {
        return item;
    })));
};
// 数据合并
exports.columnItemMerge = function (settings) {
    var key = settings.key, name = settings.name;
    return __assign(__assign({}, settings), { title: name, dataIndex: key });
};
// column-item 补齐填充函数
exports.columnItemDecorator = function (configJSON, KEYS) {
    var columnsConf = {};
    for (var key in configJSON) {
        var cItem = exports.columnItemMerge(__assign({ 
            //key: (KEYS ? KEYS[key] : key),
            key: key }, configJSON[key]));
        columnsConf[key] = cItem;
    }
    return columnsConf;
};
