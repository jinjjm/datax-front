import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Line } from '@ant-design/plots';
import { useRequest } from 'umi';
const DemoLine = () => {
  const [data, setData] = useState([]);
  const trend = useRequest(
    () => {
      return {
        url: `http://10.1.40.86:8612/data/api/apiLogs/trend?timeType=${1}`,
        method: 'GET',
      };
    },
    {
      onSuccess: (result, params) => {
        setData(result)
      }
    },
  );
  const config = {
    data,
    xField: 'time',
    yField: 'value',
    seriesField: 'category',
    xAxis: {
      type: 'time',
    },
    yAxis: {
      label: {
        // 数值格式化为千分位
        formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
  };

  return <Line {...config} />;
};

export default DemoLine 