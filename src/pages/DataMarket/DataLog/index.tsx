import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Select, Form, Button, Input, Row, Col, Alert } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useRequest } from 'umi';
import { PageContainer, ProCard, ProTable } from '@ant-design/pro-components';
interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
    status: string;
    apiType: string;
}

const columns: ColumnsType<DataType> = [
    {
        title: 'API名称',
        dataIndex: 'apiName',
        key: 'name',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'API类型',
        dataIndex: 'apiType',
        key: 'apiType',
        render: (_, record) => {
            let content;
            if (record.apiType === '0') {
                content = '系统生成型';
            } else {
                content = '第三方接入型';
            }
            return <span>{content}</span>;
        },
    },
    {
        title: '调用者IP',
        dataIndex: 'callerIp',
        key: 'address',
    },
    {
        title: '请求路径',
        key: 'callerUrl',
        dataIndex: 'callerUrl',
    },
    {
        title: '调用数据量',
        key: 'callerSize',
        dataIndex: 'callerSize',
    },
    {
        title: '请求参数',
        dataIndex: 'callerParams',
        key: 'callerParams',
    },
    {
        title: '请求时间',
        dataIndex: 'callerDate',
        key: 'callerDate',
    },
    {
        title: '请求耗时',
        dataIndex: 'time',
        key: 'time',
    },
    {
        title: '请求状态',
        dataIndex: 'status',
        key: 'status',
        render: (_, record) => {
            let content;
            if (record.status === '0') {
                content = '失败';
                return (
                    <Alert message="失败" type="error" showIcon style={{ width: 85 }} />
                );
            } else {
                content = '成功';
                return (
                    <Alert message="成功" type="success" showIcon style={{ width: 85 }} />
                );
            }
        },
    }
];


const App = () => {
    const [apiName, setApiName] = useState("")
    const [apiType, setApiType] = useState("")
    const [status, setStatus] = useState("")
    const apiMonitors = useRequest(
        () => {
            return {
                url: `http://172.16.4.72:8612/data/api/apiLogs/page?apiName=${apiName}&apiType=${apiType}&status=${status}`,
                method: 'GET',
            };
        },
        {
            onSuccess: (result, params) => {
                // console.log(result)
            }
        },
    );

    const onChangeSelect = (value: any) => {
    }
    const onFinish = (values: any) => {
        if (values.apiName !== undefined)
            setApiName(values.apiName)
        if (values.apiType !== undefined)
            setApiType(values.apiType)
        if (values.status !== undefined)
            setStatus(values.status)
    }

    const onFinishFailed = (errorInfo: any) => {
        // console.log('Failed:', errorInfo);
    };
    const [form] = Form.useForm();
    const onReset = () => {
        form.resetFields();
            setApiName("")
            setApiType("")
            setStatus("")
    };
    useEffect(() => {
        apiMonitors.run();
    }, [apiName, apiType, status]);
    return (
        <>
            <PageContainer title="" >
                <ProCard bordered style={{ height: "8vh" }}>
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        // style={{ maxWidth: 600 }}
                        form={form}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Row>
                            <Space>
                                <Form.Item
                                    label="API名称"
                                    name="apiName"
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="API类型"
                                    name="apiType"
                                >
                                    <Select
                                        // defaultValue={"0"}
                                        style={{ width: 140 }}
                                        onChange={onChangeSelect}
                                        options={[
                                            { value: "0", label: '系统生成型' },
                                            { value: "1", label: '第三方接入型' },
                                        ]}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="请求状态"
                                    name="status"
                                >
                                    <Select
                                        // defaultValue={"1"}
                                        style={{ width: 120 }}
                                        onChange={onChangeSelect}
                                        options={[
                                            { value: "0", label: '失败' },
                                            { value: "1", label: '成功' },
                                        ]}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        提交
                                    </Button>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" onClick={onReset}>
                                        重置
                                    </Button>
                                </Form.Item>
                            </Space>
                        </Row>
                    </Form>
                </ProCard>
                <ProCard bordered style={{ height: "80vh" }}>
                    <div></div>
                    <Table columns={columns} dataSource={apiMonitors?.data?.data} scroll={{ y: 700 }} />
                </ProCard>
            </PageContainer>
        </>
    )
}

export default App;