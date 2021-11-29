

const mock_amphitheatre = [
  { value: 1048, name: '搜索引擎' },
  { value: 735, name: '直接访问' },
  { value: 580, name: '邮件营销' },
  { value: 484, name: '联盟广告' },
  { value: 300, name: '视频广告' }
];


// 饼状图
export const amphitheatre = (title: string, DATAS: any[] = mock_amphitheatre, options: {}) => {

  let def = {
    title: {
      text: title,
      // subtext: '纯属虚构',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    /* legend: {
      orient: 'vertical',
      left: 'left',
    }, */
    series: [
      {
        name: '相对占比',
        type: 'pie',
        radius: '50%',
        data: DATAS,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  
  return Object.assign({}, def, options);
};