import { copyApiInfo, deleteApiInfo, getApiList } from '@/services/ant-design-pro/datax';
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { history, useRequest } from '@umijs/max';
import { Button, Dropdown, Space, Tag, message } from 'antd';
import React from 'react';
import { useRef } from 'react';

export default () => {
    const actionRef = useRef<ActionType>();
    const historyRef = React.createRef<any>();


    const handlerOption = (key: any, record: any,action:any) => {
        console.log(key);
        switch (key) {
            case "copy":
                message.info("copy");
                copyApiInfo(record.id).then(()=>action?.reload())
                break;
            case "delete":
                message.info("delete");
                deleteApiInfo(record.id).then(()=>action?.reload())
                break;
            case "read":
                history.push("/datamarket/data-service/create-new")
                break;
            case "edit":
                history.push("/datamarket/data-service/create-new")
                break;
        }
    }


    const columns: ProColumns<API.ApiList>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'API名称',
            dataIndex: 'apiName',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '此项为必填项',
                    },
                ],
            },
        },
        {
            title: 'API版本',
            key: 'apiVersion',
            dataIndex: 'apiVersion',
            hideInSearch: true,
        },
        {
            title: 'API路径',
            key: 'apiUrl',
            dataIndex: 'apiUrl',
            hideInSearch: true,
        },
        {
            title: '请求类型',
            key: 'reqMethod',
            dataIndex: 'reqMethod',
            hideInSearch: true,
        },
        {
            title: '返回格式',
            key: 'resType',
            dataIndex: 'resType',
            hideInSearch: true,
        },
        {
            disable: true,
            title: '状态',
            dataIndex: 'status',
            hideInSearch: true,
            render: (_, record) => (
                <Space>
                    {_ == "1" ? (<Tag color='yellow'>未发布</Tag>) :
                        _ == "2" ? (<Tag color='origin'>已下线</Tag>) :
                            (<Tag color='green'>已发布</Tag>)}
                </Space>
            ),
        },
        {
            title: '创建时间',
            key: 'showTime',
            dataIndex: 'createTime',
            valueType: 'date',
            hideInSearch: true,
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                <TableDropdown
                    key="actionGroup"
                    onSelect={(key: any) => handlerOption(key, record,action)}
                    menus={[
                        { key: 'copy', name: '拷贝' },
                        { key: 'edit', name: '编辑' },
                        { key: 'read', name: '查看' },
                        { key: 'delete', name: '删除' },
                    ]}
                >操作</TableDropdown>,
            ],
        },
    ];
    return (
        <ProTable<API.ApiList>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={getApiList}
            rowKey="id"
            search={{
                labelWidth: 'auto',
            }}
            options={{
                setting: {
                    listsHeight: 400,
                },
            }}
            pagination={{
                pageSize: 5,
                onChange: (page) => console.log(page),
            }}
            dateFormatter="string"
            headerTitle="API详情列表"
            toolBarRender={() => [
                <Button key="button" icon={<PlusOutlined />} type="primary"
                    onClick={() => history.push('/datamarket/data-service/create-new')}>
                    新建
                </Button>,
            ]}
        />
    );
};