import React from 'react';
import { RowProps } from 'antd';
import { ColumnRender_operationAction, enumViewMode, enumEventType, sActions as ActionInterface } from './creator';

import {
  HomeOutlined,
  SettingFilled,
  SmileOutlined,
  SyncOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

/*
配置 API - key 参照 antd PC.
本文件内存放的为方便测试的 mock 数据及配置，最佳效果为demo页面采用本 datasource + column + operation 合用

放置一些改进表格后的actions 配置，可以一目了然的方便开发者知晓

*/

export const dataSourceMock: any[] = [
  {
    key: '1',
    str1: 'A100000001',
    str2: '2020-11-03 19:42:23',
    str3: '罗德凯',
    str4: '手动请货',
    str5: '草稿',
    str6: '16',
    str7: '102.00',
    str8: '1468.00'
  }, {
    key: '2',
    str1: 'A100000002',
    str2: '2020-11-04 14:24:00',
    str3: '鲁德峰',
    str4: '智能补货',
    str5: '草稿',
    str6: '23',
    str7: '84.00',
    str8: '942.00'
  }, {
    key: '3',
    str1: 'A100000003',
    str2: '2020-11-11 17:24:00',
    str3: '绫濑遥',
    str4: '智能补货',
    str5: '草稿',
    str6: '7',
    str7: '784.00',
    str8: '23942.00'
  }
];

export const setColumns = [
  {
    title: '单据编号',
    dataIndex: 'str1',
    key: 'str1',
  },
  {
    title: '创建时间',
    dataIndex: 'str2',
    key: 'str2',
  },
  {
    title: '创建人',
    dataIndex: 'str3',
    key: 'str3',
  },
  {
    title: '单据类别',
    dataIndex: 'str4',
    key: 'str4',
  },
  {
    title: '单据状态',
    dataIndex: 'str5',
    key: 'str5',
  },
  {
    title: '补货品种数',
    dataIndex: 'str6',
    key: 'str6',
  },
  {
    title: '补货数量',
    dataIndex: 'str7',
    key: 'str7',
  },
  {
    title: '补货总金额',
    dataIndex: 'str8',
    key: 'str8',
  },
  {
    title: '操作',
    key: 'action',
    render: (text: string, record: any, index: number) => {

      let setActionsTest = setActionsTestMock;

      // if 条件变更 setActions ...
      return ColumnRender_operationAction(text, record, index, setActionsTest);
    }
  }
];


export const setActionsTestMock : ActionInterface[] = [
    // 事件交互
    {
      text: '点击回调',
      condition: {
        hide: `['2', '3'].includes(record.key)`
      },
      eventType: enumEventType.CALLBACK,
      eventSubstance(record: RowProps) {
        alert('can run xxx function event.');
      }
    }, {
      text: '模态框',
      condition: {
        hide: `['2', '3'].includes(record.key)`
      },
      eventType: enumEventType.MODALBOX,
      eventSubstance: {
        title: '模态框标题',
        content: (
        <div>
          这是一段询问的内容，吧啦吧啦。。。
        </div>),
        ok(record) {
          alert('ok')
        },
        cancel() {
          alert('cancel')
        }
      }
    }, {
      text: '气泡确认框',
      condition: {
        hide: `['2', '3'].includes(record.key)`
      },
      eventType: enumEventType.POPCONFIRM,
      eventSubstance: {
        title: '气泡标题',
        content: '嗯哼？',
        ok(record) {
          alert('ok')
        },
        cancel() {
          alert('cancel')
        }
      }
    },

    // 按鈕狀態
    {
      text: '隐藏且占位',
      condition: {
        transparent: `true`,
        hide: `['1', '3'].includes(record.key)`
      },
      eventType: enumEventType.CALLBACK,
      eventSubstance(record: RowProps) {
        alert('can run xxx function event.');
      }
    }, {
      text: '隐藏',
      condition: {
        hide: `['1', '3'].includes(record.key)`
      },
      eventType: enumEventType.CALLBACK,
      eventSubstance(record: RowProps) {
        alert('can run xxx function event.');
      }
    }, {
      text: '禁用锁定',
      condition: {
        locked: `true`,
        hide: `['1', '3'].includes(record.key)`
      },
      eventType: enumEventType.CALLBACK,
      eventSubstance(record: RowProps) {
        alert('can run xxx function event.');
      }
    },

    // 判断一条具体数据
    {
      text: '仅record.key=2显示此钮',
      condition: {
        hide: `record.key !== '2'`
      },
      eventType: enumEventType.CALLBACK,
      eventSubstance(record: RowProps) {
        alert('can run xxx function event.');
      }
    },
    {
      text: '多条件',   // 该钮不会出现在表格视觉渲染中 [ hide > transparent > locked ]
      condition: {
        transparent: 'true',
        hide: `record.key !== '3'`,
        locked: 'true'
      },
      eventType: enumEventType.CALLBACK,
      eventSubstance(record: RowProps) {
        alert('can run xxx function event.');
      }
    },
    {
      text: '锁定下不执行modal',
      condition: {
        locked: `record.key !== '3'`
      },
      eventType: enumEventType.MODALBOX,
      eventSubstance: {
        title: '一段描述',
        content: '内容 TEXT | JSXHTML',
        ok: (record) => {
          
        },
        cancel: () => {
          
        },
        options:{}
      }
    },
    {
      text: '显示图标',
      icon: <HomeOutlined/>,
      condition: {
        hide: `['1', '2'].includes(record.key)`
      },
      eventType: enumEventType.CALLBACK,
      eventSubstance() {

      },
      viewMode: enumViewMode.ICONTEXT
    },
    {
      text: '图标文字锁定',
      icon: <HomeOutlined/>,
      condition: {
        hide: `['1', '2'].includes(record.key)`,
        locked: `true`
      },
      eventType: enumEventType.CALLBACK,
      eventSubstance() {

      },
      viewMode: enumViewMode.ICONTEXT
    },
    {
      text: '仅图标且悬停显示title',
      icon: <SettingFilled/>,
      condition: {
        hide: `['1', '2'].includes(record.key)`
      },
      eventType: enumEventType.CALLBACK,
      eventSubstance() {
        alert('great')
      },
      viewMode: enumViewMode.ICON
    },
    {
      text: '锁定，仅图标且悬停显示title',
      icon: <SettingFilled/>,
      condition: {
        hide: `['1', '2'].includes(record.key)`,
        locked: `true`
      },
      eventType: enumEventType.CALLBACK,
      eventSubstance() {
        alert('great')
      },
      viewMode: enumViewMode.ICON
    },
  ];

