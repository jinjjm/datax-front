import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Pie, measureTextWidth } from '@ant-design/plots';
import { useRequest } from 'umi';
export default (props: any) => {
    const [content, setContent] = useState("")
    const apiLogsCalls = useRequest(
        () => {
            return {
                url: `http://172.16.4.72:8612/data/api/apiLogs/calls`,
                method: 'GET',
            };
        },
        {
            onSuccess: (result, params) => {
                // setContent(result[0])
                setContent(result[0].successRate)
            }
        },
    );
    function renderStatistic(containerWidth, text, style) {
        const { width: textWidth, height: textHeight } = measureTextWidth(text, style);
        const R = containerWidth / 2; // r^2 = (w / 2)^2 + (h - offsetY)^2

        let scale = 1;

        if (containerWidth < textWidth) {
            scale = Math.min(Math.sqrt(Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)))), 1);
        }

        const textStyleStr = `width:${containerWidth}px;`;
        return `<div style="${textStyleStr};font-size:${scale}em;line-height:${scale < 1 ? 1 : 'inherit'};">${text}</div>`;
    }
    const data = [
        {
            type: '成功总数',
            value: 27,
        },
        {
            type: '失败总数',
            value: 25,
        },
    ];

    const config = {
        appendPadding: 10,
        data: apiLogsCalls?.data?.[0].huanChart || [],
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.64,
        meta: {
            value: {
                formatter: (v) => `${v} `,
            },
        },
        label: {
            type: 'inner',
            offset: '-50%',
            style: {
                textAlign: 'center',
            },
            autoRotate: false,
            content: '{value}',
        },
        statistic: {
            title: {
                offsetY: -4,
                style: {
                    fontSize: '10px',
                },
                customHtml: (container, view, datum) => {
                    const { width, height } = container.getBoundingClientRect();
                    const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
                    const text = datum ? datum.type : "调用总数";
                    return renderStatistic(d, text, {
                        fontSize: '10px',
                    });
                },
            },
            content: {
                offsetY: 4,
                style: {
                    fontSize: '20px',
                },
                customHtml: (container, view, datum, data) => {
                    const { width } = container.getBoundingClientRect();
                    const text = datum ? ` ${datum.value}` : ` ${data.reduce((r, d) => r + d.value, 0)}`;
                    return renderStatistic(width, text, {
                        fontSize: '10px',
                    });
                },
            },
        },
        // 添加 中心统计文本 交互
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
            {
                type: 'pie-statistic-active',
            },
        ],
    };
    return <Pie {...config} style={{ height: 200, width: 350 }} />;
};

