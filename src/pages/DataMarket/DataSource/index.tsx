import { PlusCircleOutlined } from "@ant-design/icons";
import { PageContainer, ProColumns, ProTable, } from "@ant-design/pro-components"
import { Button, DatePicker, Space, Table } from 'antd';
const { RangePicker } = DatePicker;
export type TableListItem = {
    key: number;
    name: string;
    progress: number;
    containers: number;
    callNumber: number;
    creator: string;
    status: string;
    createdAt: number;
    memo: string;
};

export default () => {

    const creators = ['付小小', '曲丽丽', '林东东', '陈帅帅', '兼某某'];

    const valueEnum = {
        0: 'close',
        1: 'running',
        2: 'online',
        3: 'error',
    };

    const ProcessMap = {
        close: 'normal',
        running: 'active',
        online: 'success',
        error: 'exception',
    };
    const tableListDataSource = [
        {
            "key": 0,
            "name": "AppName-0",
            "containers": 18,
            "callNumber": 587,
            "progress": 56,
            "creator": "林东东",
            "status": "error",
            "createdAt": 1681804492956,
            "memo": "简短备注文案"
        },
        {
            "key": 1,
            "name": "AppName-1",
            "containers": 12,
            "callNumber": 1255,
            "progress": 91,
            "creator": "兼某某",
            "status": "close",
            "createdAt": 1681804508372,
            "memo": "很长很长很长很长很长很长很长的文字要展示但是要留下尾巴"
        },
        {
            "key": 2,
            "name": "AppName-2",
            "containers": 8,
            "callNumber": 1555,
            "progress": 88,
            "creator": "林东东",
            "status": "online",
            "createdAt": 1681804520977,
            "memo": "简短备注文案"
        },
        {
            "key": 3,
            "name": "AppName-3",
            "containers": 13,
            "callNumber": 126,
            "progress": 72,
            "creator": "林东东",
            "status": "running",
            "createdAt": 1681804468472,
            "memo": "很长很长很长很长很长很长很长的文字要展示但是要留下尾巴"
        },
        {
            "key": 4,
            "name": "AppName-4",
            "containers": 15,
            "callNumber": 1336,
            "progress": 96,
            "creator": "曲丽丽",
            "status": "running",
            "createdAt": 1681804483518,
            "memo": "简短备注文案"
        },
        {
            "key": 5,
            "name": "AppName-5",
            "containers": 6,
            "callNumber": 115,
            "progress": 89,
            "creator": "付小小",
            "status": "close",
            "createdAt": 1681804494781,
            "memo": "很长很长很长很长很长很长很长的文字要展示但是要留下尾巴"
        },
    ]

    const columns: ProColumns<TableListItem>[] = [
        {
            title: '应用名称',
            width: 120,
            dataIndex: 'name',
            fixed: 'left',
            render: (_) => <a>{_}</a>,
        },
        {
            title: '容器数量',
            width: 120,
            dataIndex: 'containers',
            align: 'right',
            search: false,
            sorter: (a, b) => a.containers - b.containers,
        },
        {
            title: '调用次数',
            width: 120,
            align: 'right',
            dataIndex: 'callNumber',
        },
        {
            title: '执行进度',
            dataIndex: 'progress',
            valueType: (item) => ({
                type: 'progress',
                status: ProcessMap[item.status],
            }),
        },
        {
            title: '创建者',
            width: 120,
            dataIndex: 'creator',
            valueType: 'select',
            valueEnum: {
                all: { text: '全部' },
                付小小: { text: '付小小' },
                曲丽丽: { text: '曲丽丽' },
                林东东: { text: '林东东' },
                陈帅帅: { text: '陈帅帅' },
                兼某某: { text: '兼某某' },
            },
        },
        {
            title: '创建时间',
            width: 140,
            key: 'since',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: (a, b) => a.createdAt - b.createdAt,
            renderFormItem: () => {
                return <RangePicker />;
            },
        },
        {
            title: '备注',
            dataIndex: 'memo',
            ellipsis: true,
            copyable: true,
            search: false,
        },
        {
            title: '操作',
            width: 80,
            key: 'option',
            valueType: 'option',
            fixed: 'right',
            render: () => [<a key="link">编辑</a>],
        },
    ];
    return (
        <PageContainer>
            <ProTable<TableListItem>
                columns={columns}
                rowSelection={{
                    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
                    defaultSelectedRowKeys: [1],
                }}
                tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => {
                    console.log(selectedRowKeys, selectedRows);
                    return (
                        <Space size={24}>
                            <span>
                                已选 {selectedRowKeys.length} 项
                                <a style={{ marginInlineStart: 8 }} onClick={onCleanSelected}>
                                    取消选择
                                </a>
                            </span>
                            <span>{`容器数量: ${selectedRows.reduce(
                                (pre, item) => pre + item.containers,
                                0,
                            )} 个`}</span>
                            <span>{`调用量: ${selectedRows.reduce(
                                (pre, item) => pre + item.callNumber,
                                0,
                            )} 次`}</span>
                        </Space>
                    );
                }}
                tableAlertOptionRender={() => {
                    return (
                        <Space size={16}>
                            <a>批量删除</a>
                            <a>导出数据</a>
                        </Space>
                    );
                }}
                dataSource={tableListDataSource}
                scroll={{ x: 1300 }}
                // options={false}
                search={false}
                pagination={{
                    pageSize: 5,
                }}
                rowKey="key"
                headerTitle="数据源"
                toolBarRender={() => [<Button type="primary" key="show"
                    icon={<PlusCircleOutlined />}>
                    新建
                </Button>,]}
            />
        </PageContainer>
    )
}