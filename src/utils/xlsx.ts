import XLSX from 'xlsx';

/**
 * 导出excel方法
 * @param headers 表格头部数组
 * @param data 表格dataSource
 * @param fileName 导出表格的名称
 * @param width 宽度
 */

const exportExcel = (headers: any[], data: any[], fileName = '益丰记录表.xlsx', width: any[] = []) => {
  const _headers = headers
    .map((item, i) =>
      Object.assign({}, { key: item.key, title: item.title, position: String.fromCharCode(65 + i) + 1 })
    )
    .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { key: next.key, v: next.title } }), {});

  const _data = data
    .map((item, i) =>
      headers.map((key, j) =>
        Object.assign({}, { content: item[key.key], position: String.fromCharCode(65 + j) + (i + 2) })
      )
    )
    // 对刚才的结果进行降维处理（二维数组变成一维数组）
    .reduce((prev, next) => prev.concat(next))
    // 转换成 worksheet 需要的结构
    .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.content } }), {});

  // 合并 headers 和 data
  const output = Object.assign({}, _headers, _data);
  // 获取所有单元格的位置
  const outputPos = Object.keys(output);
  // 计算出范围 ,["A1",..., "H2"]
  const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`;

  // 构建 workbook 对象
  const wb = {
    SheetNames: ['mySheet'],
    Sheets: {
      mySheet: Object.assign({}, output, {
        '!ref': ref,
        '!cols': width,
      }),
    },
  };

  // 导出 Excel
  XLSX.writeFile(wb, fileName);
}

export default exportExcel;