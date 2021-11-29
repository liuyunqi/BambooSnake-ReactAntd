


// 逻辑数据结构
export const logicData = [
  {
    title: '0-0',
    key: 'k0-0',
    children: [
      {
        title: '0-0-0',
        key: 'k0-0-0',
        children: [
          { title: '0-0-0-0', key: 'k0-0-0-0' },
          { title: '0-0-0-1', key: 'k0-0-0-1' },
          { title: '0-0-0-2', key: 'k0-0-0-2' },
        ],
      },
      {
        title: '0-0-1',
        key: 'k0-0-1',
        children: [
          { title: '0-0-1-0', key: 'k0-0-1-0' },
          { title: '0-0-1-1', key: 'k0-0-1-1' },
          { title: '0-0-1-2', key: 'k0-0-1-2' },
        ],
      },
      {
        title: '0-0-2',
        key: 'k0-0-2',
      },
    ],
  },
  {
    title: '0-1',
    key: 'k0-1',
    children: [
      { title: '0-1-0-0', key: 'k0-1-0-0' },
      { title: '0-1-0-1', key: 'k0-1-0-1' },
      { title: '0-1-0-2', key: 'k0-1-0-2' },
    ],
  },
  {
    title: '0-2',
    key: 'k0-2',
  }
];

// 公司真实数据展示参考
export const companyReferenceData = [
  {
    code: '1',
    hierarchy: '',
    id: '5ffe11cc',
    name: '益丰大药房',
    parentId: '0',
    sub: [
      {
        code: '10001001',
        hierarchy: '01',
        id: '5ddef729',
        name: '管理机构',
        parentId: '5ffe11cc',
        sub: [
          {
            code: '10002070',
            hierarchy: '04',
            id: '5ddef739',
            name: '湘北公司',
            parentId: '5ddef729',
            sub: [
              {
                code: '10003040',
                hierarchy: '013',
                id: '8cctf624',
                name: '经理事物办公室一',
                parentId: '5ddef739',
              },{
                code: '10003050',
                hierarchy: '014',
                id: '8cctf625',
                name: '经理公关办公室二',
                parentId: '5ddef739',
              }
            ]
          }
        ]
      }
    ]
  }
]