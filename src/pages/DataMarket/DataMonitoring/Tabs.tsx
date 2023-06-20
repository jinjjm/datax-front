import React from 'react';
import { Table, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { Select, Space,Row } from 'antd';
import { ProCard } from '@ant-design/pro-components';
const handleChange = (key: string) => {
    console.log(key);
};
const onChange = (key: string) => {
    console.log(key);
};
const columns = [
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
    },
];
const columns2 = [
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
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
const items: TabsProps['items'] = [
    {
        key: '1',
        label: `总调用次数`,
        children: (
            <>
                <div>该排行榜反映了调用最多的接口</div>
                <Table columns={columns} dataSource={data} />
            </>
        ),
    },
    {
        key: '2',
        label: `调用失败次数`,
        children: (
            <>
                <div>123</div>
                <Table columns={columns} dataSource={data} />
            </>
        ),
    },
    {
        key: '3',
        label: `调用频率`,
        children: (
            <Table columns={columns} dataSource={data} />
        ),
    },
    {
        key: '4',
        label: `调用耗时`,
        children: (
            <Table columns={columns} dataSource={data} />
        ),
    },
    {
        key: '5',
        label: `调用数据量`,
        children: (
            <Table columns={columns2} dataSource={data} />
        ),
    },
];

const App = () => {
    return (
        <ProCard bordered >
            <Row>
                <div style={{fontWeight:"bolder",marginTop:5}}>排行榜Top</div>
                <Select
                    defaultValue="10"
                    // style={{ width: 120 }}
                    onChange={handleChange}
                    options={[
                        { value: '5', label: '5' },
                        { value: '10', label: '10' },
                        { value: '15', label: '15' },
                        { value: '20', label: '20' },
                    ]}
                    bordered={false}
                /></Row>

            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </ProCard>
    )
}
export default App;