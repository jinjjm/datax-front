import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { WordCloud } from '@ant-design/plots';
import { useRequest } from 'umi';
const DemoWordCloud = () => {
    const [data, setData] = useState([]);
    const errorMessage = useRequest(
        () => {
            return {
                url: `http://10.1.40.86:8612/data/api/apiLogs/errorMessage`,
                method: 'GET',
            };
        },
        {
            onSuccess: (result, params) => {
                setData(result)
            },
            manual: true,
        },
    );
    useEffect(() => {
        errorMessage.run();
    }, []);
    const config = {
        data,
        wordField: 'msg',
        weightField: 'error_count',
        color: '#122c6a',
        wordStyle: {
            fontFamily: 'Verdana',
            fontSize: [20, 40],
            rotation: 0
        },
        // 设置交互类型
        interactions: [
            {
                type: 'element-active',
            },
        ],
        state: {
            active: {
                // 这里可以设置 active 时的样式
                style: {
                    lineWidth: 3,
                },
            },
        },
    };

    return <WordCloud {...config} />;
};
export default DemoWordCloud