import React, { useState, useEffect, useReducer, ReactElement, StyleHTMLAttributes } from 'react';
import { connect, history, Dispatch } from 'umi';
import { Tree, Radio, RadioChangeEvent, TreeProps } from 'antd';
import { enumEVENTTYPE, intfTabsItem, intfEventHandle, intfDataNodeKeyConf } from './index.d';

import styles from './index.less';

const { TreeNode } = Tree;


interface IProps  {
  dispatch: Dispatch;
  
  treeDataSource: any[];                    // tree组件数据
  eventHandle: intfEventHandle;             // 公共回调事件
  effectTreeCheckedKeys: React.Key[];       // 再次定义多选 (default: 'key')

  dataNodeKeyConf?: intfDataNodeKeyConf;    // 关键字段自定义配置 [title, key, children]
  isShowTabs?: boolean;                     // tab选项卡 - 是否显示
  tabsItems?: intfTabsItem[];               // tab选项卡渲染数据
  defaultRadioValue?: string;               // 默认radioValue
  defaultTreeExpandedKeys?: React.Key[];    // 设置默认展开 (default: 'key')
  defaultTreeCheckedKeys?: React.Key[];     // 设置默认多选 (default: 'key')
  defaultSelectedKeys?: React.Key[];        // 设置默认选中 (default: 'key')
  treeOptiosApis?: TreeProps;               // 树组件 apis

  mainStyle?: React.CSSProperties;          // 主结构样式自定义
  tabBoxStyle?: React.CSSProperties;        // tab容器结构样式自定义
  treeBoxStyle?: React.CSSProperties;       // 树容器结构样式自定义
}

// 选项卡默认数据
const defaultTabsItems: intfTabsItem[] = [
  { label: '类型一', value: 'type1'},
  { label: '类型二', value: 'type2'},
  { label: '类型三', value: 'type3'}
];

const defaultDataNodeKeyConf: intfDataNodeKeyConf = {
  title: 'title',
  key: 'key',
  children: 'children'
};

const TreeAbundantStore: React.FC<IProps> = ({
  dispatch,
  
  dataNodeKeyConf = defaultDataNodeKeyConf,       // 目前坑爹 antd-tree 并不支持自定义关键字功能(想法很好，现实残酷)
  treeDataSource = [],
  eventHandle,
  isShowTabs = true,
  tabsItems = defaultTabsItems,
  defaultRadioValue = (() => {
    return tabsItems[0].value;
  })(),
  defaultTreeExpandedKeys = [],
  defaultTreeCheckedKeys = [],
  defaultSelectedKeys = [],

  effectTreeCheckedKeys = [],

  treeOptiosApis = {},

  mainStyle = {},
  tabBoxStyle = {},
  treeBoxStyle = {},

  ...props
}) => {

  // tabs
  const [ checkRadio, setCheckRadio ] = useState(defaultRadioValue);     // 当前选中radio-value

  /* tree集合 */
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(defaultTreeExpandedKeys);     // 展开容器
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(defaultTreeCheckedKeys);        // 多选容器
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(defaultSelectedKeys);         // 选中容器
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  
  // 该处 effectTreeCheckedKeys 建议在外部传参必传,否则这边会因为 effect + setCheckedKeys 无限循环的响应render
  useEffect(()  => {
    setCheckedKeys(effectTreeCheckedKeys);
  }, [effectTreeCheckedKeys]);

  // tabs切卡选择 - 事件
  const onRadioChange = (e: RadioChangeEvent) => {
    let setVal = e.target.value;
    setCheckRadio(setVal);
    eventHandle(enumEVENTTYPE.RADIO_CHANGE, setVal);
  }

  
  // tree展开 - 事件
  const tree_onExpand = (expandedKeysValue: React.Key[]) => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);

    eventHandle(enumEVENTTYPE.TREE_EXPEND, expandedKeysValue);
  };

  // tree多选 - 事件
  const tree_onCheck = (checkedKeysValue: React.Key[], info: any) => {
    setCheckedKeys(checkedKeysValue);
    eventHandle(enumEVENTTYPE.TREE_CHECKED, {checkedKeysValue, checkedNodes: info.checkedNodes});
  };

  // tree选中 - 事件
  const tree_onSelect = (selectedKeysValue: React.Key[], info: any) => {
    setSelectedKeys(selectedKeysValue);
    eventHandle(enumEVENTTYPE.TREE_SELECT, selectedKeysValue);
  };

  /* JSX.DOM render */
  // [!警告]: 当前antd@^4.5.4, 使用自渲染方式控制台会显示 [Warning: `children` of Tree is deprecated. Please use `treeData` instead.]
  // 官方推荐直接使用 tree[props] -> treeData = { treeDataSource }
  // 未来的版本可能会不再支持目前方式, 个人认为本身key不能自定义就很奇葩，这样一改以为自定义结构也无法支持.
  // 测试多选报错 [Warning: Tree missing follow keys: '5ffe11cc', '5ddef729', '5ddef739', '8cctf624', '8cctf625'], 算了不用此法
  const renderTreeNodes = (treeDataSource: any[]) => {
    return treeDataSource.map(item => {
      let setProps = {
        title: item[dataNodeKeyConf.title],
        key: item[dataNodeKeyConf.key]
      };

      if (item[dataNodeKeyConf.children]) {
        return (
          <TreeNode { ...setProps }>
            { renderTreeNodes(item[dataNodeKeyConf.children]) }
          </TreeNode>
        )
      }
      return <TreeNode { ...setProps }/>;
    })
  }

  const titleRender = (itemData: any) => {

    let setProps = {
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

    let children: any[] = itemData[dataNodeKeyConf.children];
    /* if (children) {
      return {
        title, key: setProps.key, children: GenerateTreeNode(item.children)
      }
    } */

    return <div { ...setProps }> { setProps.title } </div>;
  }

  // 正常方式
  const setTreeProps = {
    ...{    // default case
      checkable: true,
      showLine: { showLeafIcon: false },
      height: 420,
      // titleRender
    },
    ...treeOptiosApis,      // apis 覆盖
    ...{
      treeData: treeDataSource,
      expandedKeys,
      autoExpandParent,
      checkedKeys,
      selectedKeys,
      onExpand: tree_onExpand,
      onCheck: tree_onCheck,
      onSelect: tree_onSelect
    }
  };

  // 自渲染函数方式 - 可正常渲染,但功能支持上会报错（废弃）
  const setTreePropsSELFDOM = {
    ...{    // default case
      checkable: true,
      showLine: { showLeafIcon: false },
      height: 420,
    },
    ...treeOptiosApis,      // apis 覆盖
    ...{
      expandedKeys,
      autoExpandParent,
      checkedKeys,
      selectedKeys,
      onExpand: tree_onExpand,
      onCheck: tree_onCheck,
      onSelect: tree_onSelect
    }
  };

  return (
    <div className={ styles.wrapper } style={ mainStyle }>
      {
        isShowTabs &&
        <div className={ styles.tabsBox } style={ tabBoxStyle }>
          <Radio.Group value={ checkRadio } onChange={ onRadioChange }>
            {
              tabsItems && tabsItems.map(({label, value}, index) => 
              <Radio.Button value={ value } key={ index }>{ label }</Radio.Button>)
            }
          </Radio.Group>
        </div>
      }
      <div className={ styles.treeBox } style={ treeBoxStyle }>
        {/* 正常方式 */}
        <Tree { ...setTreeProps }/>
          
        {/* 自渲染函数方式 */}
        {/* <Tree { ...setTreePropsSELFDOM }>
          { renderTreeNodes(treeDataSource) }
        </Tree> */}
      </div>
    </div>
  );
}

// connect props...
const mapStateToProps = () => {
  return {}
}

export * from './index.d';
export default connect(mapStateToProps)(TreeAbundantStore);