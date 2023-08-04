import React, { useState, useEffect } from 'react';
import { Button, Table, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { Select, Space, Row } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import { useRequest } from 'umi';
const columns = [
    {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        render: (text, record, index) => index + 1,
        width:50
    },
    {
        title: 'API',
        dataIndex: 'apiName',
        key: 'apiName',
        width:100
    },
    {
        title: '调用次数',
        dataIndex: 'ccount',
        key: 'ccount',
        width:100
    },
];
const columns2 = [
    {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        render: (text, record, index) => index + 1,
        width:50
    },
    {
        title: 'API',
        dataIndex: 'apiName',
        key: 'apiName',
        width:100
    },
    {
        title: '调用数据量',
        dataIndex: 'callerSize',
        key: 'callerSize',
        width:100
    },
];
const columns3 = [
    {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        render: (text, record, index) => index + 1,
        width:50
    },
    {
        title: '调用时间',
        dataIndex: 'ctime',
        key: 'ctime',
        width:100
    },
    {
        title: '调用次数',
        dataIndex: 'ccount',
        key: 'ccount',
        width:100
    },
];
const columns4 = [
    {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        render: (text, record, index) => index + 1,
        width:50
    },
    {
        title: 'API',
        dataIndex: 'apiName',
        key: 'apiName',
        width:100
    },
    {
        title: '调用耗时(秒)',
        dataIndex: 'time',
        key: 'time',
        width:100
    },
];
const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
    },
    {
        key: '4',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '5',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
    },
    {
        key: '6',
        name: 'Joe Black',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
    },
    {
        key: '7',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
    },
    {
        key: '8',
        name: 'Joe Black',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
    },
    {
        key: '9',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
    },
    {
        key: '10',
        name: 'Joe Black',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
    },
];
const App = (props: any) => {
    const [tableData, setTableData] = useState(data)
    const [number, setNumber] = useState(5)
    const [topType, setTopType] = useState("1")
    const [timeTypeReal, setTimeTypeReal] = useState(undefined)
    const [timeValueReal, setTimeValueReal] = useState(undefined)
    const apiLogsTops = useRequest(
        () => {
            return {
                url: 'http://172.16.4.72:8612/data/api/apiLogs/tops',
                method: 'POST',
                data: {
                    num: number,
                    timeParams: {
                        timeType: timeTypeReal,
                        timeValue: timeValueReal
                    },
                    topType: topType
                }
            };
        },
        {
            manual: true,
            onSuccess: (result, params) => {
                setTableData(result)
            }
        },
    );
    const onChangeSelect = (value: any) => {
        setNumber(value);
    };
    const onChangeTime = (value: string) => {
        setTimeTypeReal(value);
    };
    const onChangeReset = () => {
        setTimeValueReal(undefined)
        setTimeTypeReal("month")
    };
    const { title } = props;
    useEffect(() => {
        if (title === '总调用次数排行榜') {
            setTimeTypeReal(undefined)
            setTopType("1")
        } else if (title === '调用失败次数排行榜') {
            setTopType("2")
        } else if (title === '调用频率排行榜') {
            setTopType("3")
            setTimeTypeReal("month")
        } else if (title === '调用耗时排行榜') {
            setTimeTypeReal(undefined)
            setTopType("4")
        } else {
            setTimeTypeReal(undefined)
            setTopType("5")
        }
    }, [title]);
    useEffect(() => {
        apiLogsTops.run()
    }, [topType]);
    useEffect(() => {
        apiLogsTops.run()
    }, [timeTypeReal, timeValueReal, number]);
    return (
        <>
            <ProCard bordered style={{ height: "70vh",width:"100%"}}>
                <Row>
                    <div style={{ fontWeight: "bolder", marginTop: 5 }}>{title}</div>
                    <Select
                        defaultValue={5}
                        // style={{ width: 120 }}
                        onChange={onChangeSelect}
                        options={[
                            { value: 5, label: '5' },
                            { value: 10, label: '10' },
                        ]}
                        bordered={false}
                    />
                </Row>
                {/* <Tabs defaultActiveKey="1" items={items} onChange={onChangeTabs} style={{width:265}}/> */}
                {
                    title === "总调用次数排行榜" && (<> <div>该排行榜反映了调用最多的接口</div>
                        <Table columns={columns} dataSource={tableData} pagination={false} /> </>)
                }
                {
                    title === "调用失败次数排行榜" && (<> <div>该排行榜反映了调用失败最多的接口</div>
                        <Table columns={columns} dataSource={tableData} pagination={false} /> </>)
                }
                {
                    title === "调用频率排行榜" && (<>
                        <div>该排行榜反映了调用频率最高的接口</div>
                        {timeValueReal === undefined &&
                            <Select
                                defaultValue="month"
                                // style={{ width: 120 }}
                                onChange={onChangeTime}
                                options={[
                                    { value: "month", label: "按月" },
                                    { value: "day", label: '按日' },
                                ]}
                                bordered={false}
                            />}
                        {timeValueReal !== undefined &&
                            (<>
                                <Button onClick={onChangeReset} type='primary'>返回</Button>
                            </>)}
                        <Table columns={columns3} dataSource={tableData} pagination={false} onRow={(record) => {
                            return {
                                onClick: (event) => {
                                    console.log(record)
                                    setTimeValueReal(record?.ctime)
                                }, // 点击行
                            };
                        }} />
                    </>)
                }
                {
                    title === "调用耗时排行榜" && (<>
                        <div>该排行榜反映了调用耗时最长的接口</div>
                        <Table columns={columns4} dataSource={tableData} pagination={false} />
                    </>)
                }
                {
                    title === "调用数据量排行榜" && (<>
                        <div>该排行榜反映了调用数据量最大的接口</div>
                        <Table columns={columns2} dataSource={tableData} pagination={false} />
                    </>)
                }
            </ProCard>
        </>
    )
}
export default App;