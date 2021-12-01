import React from 'react';
import { Upload, UploadProps, Modal, message, Button } from 'antd';
import { ExclamationCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { fileTypeStr, fuetdCallback } from './index.d';

import styles from './index.less';


interface IProps  {
  isDisabled?: boolean;              // 是否禁用
  isLoading?: boolean;               // 是否是载入状态
  fileTypeStr?: fileTypeStr;         // 文件类型编码
  singleUploadMaxLength?: number;    // 单次上传最大数量
  slowMaybeMaxLength?: number;       // 执行时可能较慢 - 弹窗提示

  callback?: fuetdCallback;          // 回调

  uploadApiOptions?: UploadProps;    // antd-upload api
}

const module: React.FC<IProps> = ({
  isDisabled = false,
  isLoading = false,
  fileTypeStr = {
    override: false,
    names: []
  },
  singleUploadMaxLength = 3000,
  slowMaybeMaxLength = 2000,

  callback,

  uploadApiOptions = {},
  ...props
}) => {

  let defFielTypeStr = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

  if (fileTypeStr.override) {
    defFielTypeStr = fileTypeStr.names;
  } else {
    defFielTypeStr = [ ...new Set(defFielTypeStr.concat(fileTypeStr.names)) ];    // Object.values(new Set(defFielTypeStr.concat(fileTypeStr.names)));
  }

  // 上传控件 - antd
  const uploadProps: UploadProps = {
    fileList: [],
    customRequest({
      action,
      data,
      file,
      filename,
      headers,
      onError,
      onProgress,
      onSuccess,
      withCredentials,
    }) {
      let reader = new FileReader();
      reader.readAsBinaryString(file as Blob);
      reader.onload = (e: any) => {

        try {
          // 校验上传文件类型是否为Excel
          if (!defFielTypeStr.includes((file as File).type)) {
            message.warning('请上传正确的Excel格式文件');
            return;
          }

          let data = e.target.result;   // 返回数据
          let wb: any = XLSX.read(data, { type: 'binary' });     // binary - 二进制转换
          let jsonData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { raw: false }); // sheetExcel页签

          // 获取头部
          // 当前分析的头部只能作为基础参考, 不太准确, 比如测试多门店参数时, value = '5024/5023/5021', 居然也被查询到为 columnName
          let excelColumns: string[] = [];
          (wb.Strings as Array<any>).forEach((item: any) => {
            if (item.t.trim()) excelColumns.push(item.t);
          });

          if (jsonData.length > singleUploadMaxLength) {
            message.warning(`单次导入数据量过大，最大上限为${singleUploadMaxLength}条。`);
            return;
          }

          if (jsonData.length > slowMaybeMaxLength) {
            new Promise((resolve, reject) => {
              Modal.confirm({
                title: '导入提示',
                icon: <ExclamationCircleOutlined />,
                content: '当前导入数据较多，可能稍需等待较长，是否继续？',
                okText: '继续',
                cancelText: '取消',
                onOk() {
                  resolve('ok');
                },
                onCancel() {
                  reject('cancel');
                }
              });
            }).then(ok => {
              callback && callback({ jsonData, excelColumns }, onSuccess, file);
            }).catch(err => {})
          } else {
            callback && callback({ jsonData, excelColumns }, onSuccess, file);
          }
        } catch(err) {
          console.log(err)
          message.error('导入文件异常，请检查');
        }
      }
    },
    multiple: false,
    onChange(res: any) {
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
    },

    ...uploadApiOptions
  };

  return (
    <div className={ styles.wrapper }>
      <Upload { ...uploadProps }>
        <Button type="primary" ghost title="选择一份excel文件" loading={ isLoading } disabled={ isDisabled }>
          导入
        </Button>
      </Upload>
    </div>
  );
}

export * from './index.d';
export default module;