import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Radar } from '@ant-design/plots';

export default  () => {
  // 数据更新于 2021.01.09
  const data = [
    {
      name: '准确性',
      star: 10371,
    },
    {
      name: '完整性',
      star: 7380,
    },
    {
      name: '唯一性',
      star: 7414,
    },
    {
      name: '时效性',
      star: 2140,
    },
    {
      name: '一致性',
      star: 660,
    },
    {
      name: '规范性',
      star: 885,
    },
  ];
  const config = {
    data: data.map((d) => ({ ...d, star: Math.sqrt(d.star) })),
    xField: 'name',
    yField: 'star',
    appendPadding: [0, 10, 0, 10],
    meta: {
      star: {
        alias: 'star 数量',
        min: 0,
        nice: true,
        formatter: (v) => Number(v).toFixed(2),
      },
    },
    xAxis: {
      tickLine: null,
    },
    yAxis: {
      label: false,
      grid: {
        alternateColor: 'rgba(0, 0, 0, 0.04)',
      },
    },
    // 开启辅助点
    point: {
      size: 2,
    },
    // area: {},
  };
  return <Radar {...config} />;
};
