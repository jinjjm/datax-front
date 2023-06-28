import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Pie } from '@ant-design/plots';
import { useRequest } from 'umi';
const DemoPie = () => {
    const apiMonitors = useRequest(
        () => {
            return {
                url: `http://10.1.40.86:8612/data/market/apiMonitors`,
                method: 'GET',
            };
        },
        {
            onSuccess: (result, params) => {
            }
        },
    );
    const config = {
        appendPadding: 10,
        data:apiMonitors?.data?.[0].stateChart || [],
        angleField: 'value',
        colorField: 'type',
        radius: 0.75,
        label: {
            type: 'spider',
            labelHeight: 28,
            content: '{name}\n{percentage}',
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
        ],
    };
    return <Pie {...config} style={{ height: 200 }} />;
};
export default DemoPie