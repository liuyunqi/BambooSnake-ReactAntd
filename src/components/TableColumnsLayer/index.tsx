import React from "react";

import { Checkbox, Tooltip, Button } from "antd";

import styles from "./index.less";
import { check } from "prettier";

// 组件传参
interface IProps {
  columns: []; // 表格列数据
  table?: any; // 表格ref【可选 如不传会主动找，有可能会找错，具体逻辑在getTableColWidth中】
  needStorage?: boolean, //是否需要在本地存储用户的列操作结果 【可选 默认false】
  onChange?: (
    data: { columns: Array<any>; width: number },
    callback: any
  ) => void; //确定后的回调 一个装有列数据和计算好的表格宽度的data，还有一个用于关闭弹出层的函数回调
}

interface IState {
  allCols: []; //全部列
  uniqId: string; //唯一id
  colWidths: Array<any>; //列宽
  tableXWidth: number; // 表格初始化宽度
  allChecked: boolean; //是否全选
  visible: boolean; //是否展示列选择弹出层
  positionInfo: {
    left: number;
    top: number;
  }; //位置信息
}

class TableColumnLayer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      uniqId: "",
      visible: false,
      colWidths: [], //列宽
      tableXWidth: 0,
      allChecked: false,
      allCols: JSON.parse(JSON.stringify(this.props.columns)),
      positionInfo: { left: 0, top: 0 },
    };
  }

  // 拖动事件
  private dragEvent = {
    onDragStart: (e: any) => {
      e.dataTransfer.setData("key", e.target.dataset.key);
      return false;
    },

    onDragEnd: (e: any) => {},

    onDragEnter: (e: any) => {},

    onDrop: (e: any) => {
      let { data: sourceCol, index: sourceIndex } = this.findColumnDataByKey(
        e.dataTransfer.getData("key")
      );
      let { data: targetCol, index: targetIndex } = this.findColumnDataByKey(
        e.target.dataset.key
      );

      if (sourceIndex == -1 || targetIndex == -1) {
        return;
      }

      // 同一个对象
      if (sourceCol.key == targetCol.key) {
      } else {
        let allCols = JSON.parse(JSON.stringify(this.state.allCols));
        allCols[sourceIndex] = targetCol;
        allCols[targetIndex] = sourceCol;

        this.setState({ allCols });
      }

      e.preventDefault();
    },

    onDragOver: (e: any) => {
      e.preventDefault();
    },
  };

  // 全选
  allChange() {
    this.state.allCols.forEach((item: any) => {
      item.checked = true;
    });

    this.setState({ allCols: this.state.allCols, allChecked: true });
  }

  // 列选择事件
  colChange(e: any, colData: any) {
    this.state.allCols.forEach((item: any) => {
      if (item.key == colData.key) {
        item.checked = e.target.checked;
      }
    });

    let checkedLen = this.state.allCols.filter((it:any)=>{ return it.checked;}).length;
    
    // 设置全选
    if (!e.target.checked) {
      this.setState({ allChecked: false });
    } else if (checkedLen==this.state.allCols.length) {
      this.setState({ allChecked: true });
    }

    // 设置列数据
    this.setState({ allCols: this.state.allCols });
  }

  // 确认
  confirm( callByHandle=false /* 是否为代码调用 区分用户点击确认还是代码触发 */) {
    let minusWidth = 0;

    // 获取选择的列数据
    let checkedCol = JSON.parse(JSON.stringify(this.state.allCols.filter((item: any, index: number) => {
      let isChecked = item.checked;

      if (isChecked) {
        minusWidth += this.state.colWidths[index];
      }

      return isChecked;
    })));

    // 计算宽度
    if (checkedCol.length != this.state.allCols.length) {

      // fixed列不算宽度
      let fixedTh = checkedCol.filter((th: any)=>{ return th.fixed})||[];
      let fixedThWidth = 0;
      fixedTh.forEach((it:any)=>{ fixedThWidth+=it.width;})

      // 平均宽度
      let averageWidth = (this.state.tableXWidth - fixedThWidth) / (checkedCol.length - fixedTh.length);

      checkedCol.forEach((col: any) => {
        if (!col.fixed) {
          // delete col.width;
          col.width = averageWidth;
        }
      });
    } else {
      checkedCol.forEach((col: any, index:number) => {
          // delete col.width;
        col.width = this.state.allCols[index].width;

        if (!col.width) {
          delete col.width;
        }
      });
    }

    // 如果全不选，则默认第一列必须展示
    if (checkedCol.length == 0) {
      checkedCol.push(this.state.allCols[0]);
      minusWidth = this.state.colWidths[0];
    } else if (checkedCol.length == this.state.allCols.length) {
      // 全选则计算出来的值是初始化获取的表格宽度
      minusWidth = this.state.tableXWidth;
    } else {
      minusWidth = this.state.tableXWidth;
    }

    // 本地存储列数据
    !callByHandle && this.props.needStorage && this.storage(this.state.allCols);

    // 把选择的列数据回调
    this.props.onChange &&
      this.props.onChange({ columns: checkedCol, width: minusWidth }, () => {

        !callByHandle && this.expandCollapse();
      });
    
    // 用户没有设置回调参数，则自动调用，隐藏弹出框
    if (!this.props.onChange && !callByHandle) {
      this.expandCollapse();
    }
  }

  // 数据存储/获取
  private storage(value?:any) {
    // 存
    if (value) {
      sessionStorage.setItem(this.getStorageKey(), JSON.stringify(value));
    }else {

      // 取
      let rnt = JSON.parse(sessionStorage.getItem( this.getStorageKey() )||'{}');

      let keys = Object.keys(rnt);

      if (keys.length) { return rnt; }

      return null;
    }
  }

  // 展开收缩
  expandCollapse() {
    if (this.props.table) {
      this.getTableColWidthByRef();
    } else {
      this.getTableColWidth();
    }

    // 定位弹出框位置
    this.positionLayer();

    this.setState({
      visible: !this.state.visible,
    });
  }

  // 通过传入的表格ref来找table计算表格列宽
  getTableColWidthByRef() {
    let tableHeeaders = this.props.table.querySelectorAll(".ant-table-thead");
    let colsWidth: Array<any> = [];
    let ths = this.props.table.querySelectorAll(".ant-table-thead th");
    let tableWidth = 0,
      tableBodyDom = null;

    if (tableHeeaders.length == 1) {
      ths.forEach((th: any) => {
        colsWidth.push(th.offsetWidth);
      });

      tableBodyDom = this.props.table.querySelectorAll(".ant-table-body table");

      try {
        tableWidth = tableBodyDom
          ? parseInt(getComputedStyle(tableBodyDom[0]).width)
          : 0;
      } catch (e) {
        tableWidth = colsWidth.reduce((prev: number, current: number) => {
          return (prev += current);
        });
      }

      // 去除滚动条宽度
      tableWidth-=20;
    }

    this.setState({ colWidths: colsWidth, tableXWidth: tableWidth });
  }

  // 获取表格列宽
  getTableColWidth() {

    // 查找页面表格
    let tableHeeaders = document.querySelectorAll(".ant-table-thead");
    let colsWidth: Array<any> = [];
    let ths = document.querySelectorAll(".ant-table-thead th");
    let tableWidth = 0,
      tableBodyDom = null;

    // 只有一个
    if (tableHeeaders.length == 1) {
      ths.forEach((th:any, index:number) => {
        if (index<this.state.allCols.length) {

          colsWidth.push(th.offsetWidth);
        }
      });

      tableBodyDom = document.querySelectorAll(".ant-table-body table");

      try {
        tableWidth = tableBodyDom
          ? parseInt(getComputedStyle(tableBodyDom[0]).width)
          : 0;
      } catch (e) {
        tableWidth = colsWidth.reduce((prev: number, current: number) => {
          return (prev += current);
        });
      }

      tableWidth = colsWidth.reduce((prev: number, current: number) => {
        return (prev += current);
      });

    } else {
      // 多个表格，通过传入的列数据的title来跟获取表格th列中的文字进行对比，来确定是否为要操作的表格
      let breakLoop = false;

      [].slice.call(tableHeeaders).forEach((theader: any) => {
        if (breakLoop) {
          return false;
        }

        let ths = theader.querySelectorAll(".ant-table-thead th");

        let thsTxt = [].slice.call(ths).map((th: any) => {
          return th.innerHTML.trim();
        });

        let columnsTxt = this.state.allCols.map((col: any) => {
          return col.title.trim();
        });

        // 多个表格找到唯一的依据 数据的列名和表格的列名是否一致
        if (thsTxt == columnsTxt) {
          ths.forEach((th: any, index: number) => {
            if (index < this.state.allCols.length) {

              colsWidth.push(th.offsetWidth);
            }
          });

          tableBodyDom = theader.parentNode.querySelectorAll(
            ".ant-table-body table"
          );

          try {
            tableWidth = tableBodyDom
              ? parseInt(getComputedStyle(tableBodyDom[0]).width)
              : 0;
          } catch (e) {
            tableWidth = colsWidth.reduce((prev: number, current: number) => {
              return (prev += current);
            });
          }
          breakLoop = true;
        }
      });
    }

    // 滚动条
    tableWidth-=20;

    this.setState({ colWidths: colsWidth, tableXWidth: tableWidth });
  }

  // 获取按钮位置信息，定位弹出层
  positionLayer() {

    let btnDom = document.querySelector(
      `#table_column_trigger_btn_${this.state.uniqId}`
    )?.children[0];

    let layerDom = document.querySelector(
      `#table_column_column_box_${this.state.uniqId}`
    );

    if (btnDom && layerDom) {
      let posObj = btnDom.getBoundingClientRect();
      let layerWidth = 470;
      let layerLeft = posObj.left - (layerWidth - posObj.width);
      layerLeft = layerLeft < 0 ? posObj.left : layerLeft;

      this.setState({
        positionInfo: {
          top: posObj.top + posObj.height,
          left: layerLeft,
        },
      });
    }
  }

  // 通过key获取列数据
  findColumnDataByKey(key: string): { data: any; index: number } {
    let resultIndex = -1;
    let result =
      this.state.allCols.filter((item: any, index: number) => {
        let isMatch = item.key == key;
        if (isMatch) {
          resultIndex = index;
        }
        return isMatch;
      }) || [];
    return { data: result[0], index: resultIndex };
  }

  componentDidMount() {

    let colData:any = null;

    if (this.props.needStorage && ((colData = this.storage()))) {
      // 从本地缓存取存储的数据
      this.setState((state: any) => {
        return { ...state, allCols: colData };
      });

      // 设置是否全选
      let isNotAllChecked = colData.some((it:any)=>{ return !it.checked; })

      this.setState({allChecked:!isNotAllChecked});

      // 主动触发表格列变动事件
      this.ayncGet(() => {
        this.props.table?this.getTableColWidthByRef():this.getTableColWidth();
        this.confirm(true);
      });

    } else {

      // 默认初始状态为全选 
      this.state.allCols.forEach((item: any) => {
        item.checked = true;
      });
      
      this.setState({allChecked:true});

      this.props.needStorage && this.storage(this.state.allCols);
    }

    // 设置组件的唯一id
    this.setState({ uniqId: Date.now().toString() });
    
  }

  private ayncGet (cb:Function) {
    setTimeout(cb, 300);
  }

  // 获取存储的key
  // 命名规则 列名的key_列名的name_当前页面的路径
  private getStorageKey():string {
    let keys = this.state.allCols.map((item:any)=>{
      return item.key+'_'+encodeURIComponent(item.name)
    })

    let pathMathed = location.hash.match(/#(\/\w+)\??/)
    let pathName = pathMathed?.length?pathMathed[1]:location.pathname;

    return this.uniqCode(keys.join("") + pathName);
  }

  private uniqCode(str:string):string {
    if (!str) { return ''; }

    let result = 0;
    for (var i=0,len=str.length;i<len;i++) {
      let cur = str.charCodeAt(i);
      result = (result<<5-result)+cur;
      result|=0;
    }

    return result.toString(16);
  }

  render() {
    return (
      <>
        <div
          id={"table_column_trigger_btn_" + this.state.uniqId}
          className={styles.triggerBtn}
          onClick={this.expandCollapse.bind(this)}
        >
          {this.props.children}
        </div>

        <div
          onClick={this.expandCollapse.bind(this)}
          className={styles.layerBg}
          style={{
            display: this.state.visible ? "block" : "none",
          }}
        >
          <div
            onClick={(ev) => {
              ev.stopPropagation();
            }}
            id={"table_column_column_box_" + this.state.uniqId}
            className={styles.columnBox}
            style={{
              left: this.state.positionInfo.left + "px",
              top: this.state.positionInfo.top + "px",
            }}
          >
            <div className={styles.topBox}>
              <Checkbox
                checked={this.state.allChecked}
                onChange={this.allChange.bind(this)}
              >
                全选
              </Checkbox>
            </div>

            <div className={styles.colBox}>
              {this.state.allCols
                ? this.state.allCols.map((element: any) => {
                    return (
                      <div
                        draggable
                        key={element.key}
                        data-key={element.key}
                        className={styles.checkboxWrap}
                        {...this.dragEvent}
                      >
                        <Checkbox
                          data-key={element.key}
                          checked={element.checked}
                          onChange={(e) => {
                            this.colChange(e, element);
                          }}
                        >
                          <Tooltip title={element.title}>
                            <span
                              className={styles.colLabel}
                              data-key={element.key}
                            >
                              {element.title}
                            </span>
                          </Tooltip>
                        </Checkbox>
                      </div>
                    );
                  })
                : ""}
            </div>

            <div className={styles.btns}>
              <Button
                type="default"
                style={{ marginRight: 8 }}
                onClick={this.expandCollapse.bind(this)}
              >
                取消
              </Button>

              <Button type="primary" onClick={()=>{this.confirm()}}>
                确定
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default TableColumnLayer;
