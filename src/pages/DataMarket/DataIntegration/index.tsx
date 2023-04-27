import { ActionType, PageContainer, ProCard, ProColumns, ProTable, TableDropdown } from '@ant-design/pro-components';

import { Button, Card, Form, Input, message, Popconfirm, Row, Space, Tag, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { useRef } from 'react';
import { getApiList } from '@/services/ant-design-pro/datax';
import { deleteServiceInfo, getServicesList } from './api';

const { Search } = Input;

export default () => {
    const actionRef = useRef<ActionType>();

    const handlerOption = (key: any, record: any, action: any) => {
        // console.log(key);
        switch (key) {
            case 'read':
                history.push('/datamarket/data-integration/service-details/' + record?.id);
                break;
            case 'use':
                message.info('功能暂未开放');
                break;
            case 'delete':
                deleteServiceInfo(record?.id).then(() => action?.reload());
                message.success('删除成功');
                break;
            default:
                message.info("代码有误")
                break;
        }
    };

    const columns: ProColumns<API.ApiList>[] = [
        {
            title: "序号",
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 60,
            align: 'center',
        },
        {
            title: '服务编号',
            dataIndex: 'id',
            key: 'id',
            hideInSearch: true,
            align: 'center',
        },
        {
            title: '服务名称',
            key: 'serviceName',
            dataIndex: 'serviceName',
            hideInSearch: true,
            align: 'center',
        },
        {
            title: '服务类型',
            key: 'serviceType',
            dataIndex: 'serviceType',
            hideInSearch: true,
            align: 'center',
            render: (text) => {
                return text === "1" ? "http接口" : "webservice接口";
            }
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            align: 'center',
            render: (text, record, _, action) => {
                return <Space>
                    <a onClick={() => handlerOption('read', record, action)}>查看</a>
                    <a onClick={() => handlerOption('use', record, action)}>调用</a>
                    <Popconfirm title="再次点击确认删除" onConfirm={() => handlerOption('ss', record, action)}>
                        <a >删除</a>
                    </Popconfirm>
                </Space >
            }
        },
    ];
    return (
        <PageContainer >
            <Card >
                {/* <Form> */}
                {/* <Card bordered={false} hoverable style={{ height: 70}}> */}
                <Form.Item label={"服务名称"} style={{ marginLeft: '1%' }}>
                    <Input.Search name='search' style={{ width: '30%', marginRight: '1%' }} enterButton />
                    <Button type='primary' icon={<PlusOutlined />}
                        onClick={() => {
                            history.push('/datamarket/data-integration/service-details/' + 'new');
                        }}>新增</Button>
                </Form.Item>
                {/* </Card> */}
                {/* </Form> */}

                <ProTable<API.ApiList>
                    columns={columns}
                    actionRef={actionRef}
                    cardBordered
                    request={getServicesList}
                    rowKey="id"
                    // search={{
                    //   labelWidth: 'auto',
                    // }}
                    search={false}
                    options={{
                        setting: {
                            listsHeight: 400,
                        },
                    }}
                    pagination={{
                        pageSize: 5,
                        onChange: (page) => console.log(page),
                    }}
                    // headerTitle="API详情列表"
                    toolBarRender={false}
                />
            </Card>
        </PageContainer>
    );
};

