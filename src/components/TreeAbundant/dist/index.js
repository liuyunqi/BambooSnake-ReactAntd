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
var index_less_1 = require("./index.less");
var TreeNode = antd_1.Tree.TreeNode;
// 选项卡默认数据
var defaultTabsItems = [
    { label: '类型一', value: 'type1' },
    { label: '类型二', value: 'type2' },
    { label: '类型三', value: 'type3' }
];
var defaultDataNodeKeyConf = {
    title: 'title',
    key: 'key',
    children: 'children'
};
var InfoPanelStore = function (_a) {
    var dispatch = _a.dispatch, _b = _a.dataNodeKeyConf, dataNodeKeyConf = _b === void 0 ? defaultDataNodeKeyConf : _b, // 目前坑爹 antd-tree 并不支持自定义关键字功能(想法很好，现实残酷)
    _c = _a.treeDataSource, // 目前坑爹 antd-tree 并不支持自定义关键字功能(想法很好，现实残酷)
    treeDataSource = _c === void 0 ? [] : _c, eventHandle = _a.eventHandle, _d = _a.isShowTabs, isShowTabs = _d === void 0 ? true : _d, _e = _a.tabsItems, tabsItems = _e === void 0 ? defaultTabsItems : _e, _f = _a.defaultRadioValue, defaultRadioValue = _f === void 0 ? (function () {
        return tabsItems[0].value;
    })() : _f, _g = _a.defaultTreeExpandedKeys, defaultTreeExpandedKeys = _g === void 0 ? [] : _g, _h = _a.defaultTreeCheckedKeys, defaultTreeCheckedKeys = _h === void 0 ? [] : _h, _j = _a.defaultSelectedKeys, defaultSelectedKeys = _j === void 0 ? [] : _j, _k = _a.effectTreeCheckedKeys, effectTreeCheckedKeys = _k === void 0 ? [] : _k, _l = _a.treeOptiosApis, treeOptiosApis = _l === void 0 ? {} : _l, _m = _a.mainStyle, mainStyle = _m === void 0 ? {} : _m, _o = _a.tabBoxStyle, tabBoxStyle = _o === void 0 ? {} : _o, _p = _a.treeBoxStyle, treeBoxStyle = _p === void 0 ? {} : _p, props = __rest(_a, ["dispatch", "dataNodeKeyConf", "treeDataSource", "eventHandle", "isShowTabs", "tabsItems", "defaultRadioValue", "defaultTreeExpandedKeys", "defaultTreeCheckedKeys", "defaultSelectedKeys", "effectTreeCheckedKeys", "treeOptiosApis", "mainStyle", "tabBoxStyle", "treeBoxStyle"]);
    // tabs
    var _q = react_1.useState(defaultRadioValue), checkRadio = _q[0], setCheckRadio = _q[1]; // 当前选中radio-value
    /* tree集合 */
    var _r = react_1.useState(defaultTreeExpandedKeys), expandedKeys = _r[0], setExpandedKeys = _r[1]; // 展开容器
    var _s = react_1.useState(defaultTreeCheckedKeys), checkedKeys = _s[0], setCheckedKeys = _s[1]; // 多选容器
    var _t = react_1.useState(defaultSelectedKeys), selectedKeys = _t[0], setSelectedKeys = _t[1]; // 选中容器
    var _u = react_1.useState(true), autoExpandParent = _u[0], setAutoExpandParent = _u[1];
    // 该处 effectTreeCheckedKeys 建议在外部传参必传,否则这边会因为 effect + setCheckedKeys 无限循环的响应render
    react_1.useEffect(function () {
        setCheckedKeys(effectTreeCheckedKeys);
    }, [effectTreeCheckedKeys]);
    // tabs切卡选择 - 事件
    var onRadioChange = function (e) {
        var setVal = e.target.value;
        setCheckRadio(setVal);
        eventHandle(index_d_1.enumEVENTTYPE.RADIO_CHANGE, setVal);
    };
    // tree展开 - 事件
    var tree_onExpand = function (expandedKeysValue) {
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
        eventHandle(index_d_1.enumEVENTTYPE.TREE_EXPEND, expandedKeysValue);
    };
    // tree多选 - 事件
    var tree_onCheck = function (checkedKeysValue, info) {
        setCheckedKeys(checkedKeysValue);
        eventHandle(index_d_1.enumEVENTTYPE.TREE_CHECKED, { checkedKeysValue: checkedKeysValue, checkedNodes: info.checkedNodes });
    };
    // tree选中 - 事件
    var tree_onSelect = function (selectedKeysValue, info) {
        setSelectedKeys(selectedKeysValue);
        eventHandle(index_d_1.enumEVENTTYPE.TREE_SELECT, selectedKeysValue);
    };
    /* JSX.DOM render */
    // [!警告]: 当前antd@^4.5.4, 使用自渲染方式控制台会显示 [Warning: `children` of Tree is deprecated. Please use `treeData` instead.]
    // 官方推荐直接使用 tree[props] -> treeData = { treeDataSource }
    // 未来的版本可能会不再支持目前方式, 个人认为本身key不能自定义就很奇葩，这样一改以为自定义结构也无法支持.
    // 测试多选报错 [Warning: Tree missing follow keys: '5ffe11cc', '5ddef729', '5ddef739', '8cctf624', '8cctf625'], 算了不用此法
    var renderTreeNodes = function (treeDataSource) {
        return treeDataSource.map(function (item) {
            var setProps = {
                title: item[dataNodeKeyConf.title],
                key: item[dataNodeKeyConf.key]
            };
            if (item[dataNodeKeyConf.children]) {
                return (react_1["default"].createElement(TreeNode, __assign({}, setProps), renderTreeNodes(item[dataNodeKeyConf.children])));
            }
            return react_1["default"].createElement(TreeNode, __assign({}, setProps));
        });
    };
    var titleRender = function (itemData) {
        var setProps = {
            title: itemData[dataNodeKeyConf.title],
            key: itemData[dataNodeKeyConf.key]
        };
        /* let children: any[] = itemData[dataNodeKeyConf.children];
    
        if (children) {
          return children.map(item => {
    
            let _setProps = {
              title: item[dataNodeKeyConf.title],
              key: item[dataNodeKeyConf.key]
            };
            debugger
            return (
              <TreeNode { ...setProps }>
                { titleRender(item[dataNodeKeyConf.children]) }
              </TreeNode>
            )
          })
        } */
        var children = itemData[dataNodeKeyConf.children];
        /* if (children) {
          return {
            title, key: setProps.key, children: GenerateTreeNode(item.children)
          }
        } */
        return react_1["default"].createElement("div", __assign({}, setProps),
            " ",
            setProps.title,
            " ");
    };
    // 正常方式
    var setTreeProps = __assign(__assign({
        checkable: true,
        showLine: { showLeafIcon: false },
        height: 420
    }, treeOptiosApis), {
        treeData: treeDataSource,
        expandedKeys: expandedKeys,
        autoExpandParent: autoExpandParent,
        checkedKeys: checkedKeys,
        selectedKeys: selectedKeys,
        onExpand: tree_onExpand,
        onCheck: tree_onCheck,
        onSelect: tree_onSelect
    });
    // 自渲染函数方式 - 可正常渲染,但功能支持上会报错（废弃）
    var setTreePropsSELFDOM = __assign(__assign({
        checkable: true,
        showLine: { showLeafIcon: false },
        height: 420
    }, treeOptiosApis), {
        expandedKeys: expandedKeys,
        autoExpandParent: autoExpandParent,
        checkedKeys: checkedKeys,
        selectedKeys: selectedKeys,
        onExpand: tree_onExpand,
        onCheck: tree_onCheck,
        onSelect: tree_onSelect
    });
    return (react_1["default"].createElement("div", { className: index_less_1["default"].wrapper, style: mainStyle },
        isShowTabs &&
            react_1["default"].createElement("div", { className: index_less_1["default"].tabsBox, style: tabBoxStyle },
                react_1["default"].createElement(antd_1.Radio.Group, { value: checkRadio, onChange: onRadioChange }, tabsItems && tabsItems.map(function (_a, index) {
                    var label = _a.label, value = _a.value;
                    return react_1["default"].createElement(antd_1.Radio.Button, { value: value, key: index }, label);
                }))),
        react_1["default"].createElement("div", { className: index_less_1["default"].treeBox, style: treeBoxStyle },
            react_1["default"].createElement(antd_1.Tree, __assign({}, setTreeProps)))));
};
// connect props...
var mapStateToProps = function (ALL) {
    var loading = ALL.loading;
    return __assign({}, loading);
};
exports["default"] = umi_1.connect(mapStateToProps)(InfoPanelStore);
