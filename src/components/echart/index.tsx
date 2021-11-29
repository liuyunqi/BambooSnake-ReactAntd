import React, { useState, useEffect, useReducer, ReactElement } from 'react';
import { connect, history, Dispatch } from 'umi';
import { ConnectState } from '../../models/connect';

import styles from './index.less';

import * as echarts from 'echarts';
// import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';


interface IProps  {
  dispatch: Dispatch;

  
  setOptions: any;
  setStyle: React.CSSProperties,
  elementId?: string;
}


const EchartMatrix: React.FC<IProps> = ({
  dispatch,

  elementId = 'echartMain',
  setOptions = {},
  setStyle = {},

  ...props
}) => {
  // init...
  useEffect(() => {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById(elementId) as HTMLElement);
    // 绘制图表
    myChart.setOption(setOptions);
  }, [1])
  

  return (
    <div id={ elementId } style={ setStyle }></div>
  );
}

// connect props...
const mapStateToProps = (ALL: ConnectState) => {
  const { loading } = ALL;
  return {
    ...loading
  }
}

export default connect(mapStateToProps)(EchartMatrix);