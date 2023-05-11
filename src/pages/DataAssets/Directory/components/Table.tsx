import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, ProCard, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Avatar, Input, InputNumber, TabsProps } from 'antd';
import { Button, Col, Dropdown, Row, Space, Tabs, Tag, Image, Statistic } from 'antd';
import { useRef, useState } from 'react';
import request from 'umi-request';
import fire from "../icon/火焰.svg"
import '../services/index.css';
import PieChart from "./PieChart"
import Radar from "./Radar"
import Ring from "./Ring"
type GithubIssueItem = {
  url: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
};

export type TableListItem = {
  key: number;
  name: string;
  creator: string;
  createdAt: number;
};
const tableListDataSource: TableListItem[] = [];

const creators = ['付小小', '曲丽丽', '林东东', '陈帅帅', '兼某某'];

for (let i = 0; i < 1; i += 1) {
  tableListDataSource.push({
    key: i,
    name: 'AppName',
    creator: creators[Math.floor(Math.random() * creators.length)],
    createdAt: Date.now() - Math.floor(Math.random() * 100000),
  });
}

const columns: ProColumns<GithubIssueItem>[] = [//字段信息表格列设置
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '标题',
    dataIndex: 'title',
    copyable: true,
    ellipsis: true,
    tip: '标题过长会自动收缩',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
    hideInSearch: true,
  },
  {
    disable: true,
    title: '状态',
    dataIndex: 'state',
    filters: true,
    onFilter: true,
    ellipsis: true,
    valueType: 'select',
    valueEnum: {
      all: { text: '超长'.repeat(50) },
      open: {
        text: '未解决',
        status: 'Error',
      },
      closed: {
        text: '已解决',
        status: 'Success',
        disabled: true,
      },
      processing: {
        text: '解决中',
        status: 'Processing',
      },
    },
    hideInSearch: true,
  },
  {
    disable: true,
    title: '标签',
    dataIndex: 'labels',
    search: false,
    renderFormItem: (_, { defaultRender }) => {
      return defaultRender(_);
    },
    render: (_, record) => (
      <Space>
        {record.labels.map(({ name, color }) => (
          <Tag color={color} key={name}>
            {name}
          </Tag>
        ))}
      </Space>
    ),
  },
  {
    title: '创建时间',
    key: 'showTime',
    dataIndex: 'created_at',
    valueType: 'date',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    valueType: 'dateRange',
    hideInSearch: true,
    hideInTable: true,
    search: {
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1],
        };
      },
    },
  },
  // {
  //   title: '操作',
  //   valueType: 'option',
  //   key: 'option',
  //   render: (text, record, _, action) => [
  //     <a
  //       key="editable"
  //       onClick={() => {
  //         action?.startEditable?.(record.id);
  //       }}
  //     >
  //       编辑
  //     </a>,
  //     <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
  //       查看
  //     </a>,
  //     <TableDropdown
  //       key="actionGroup"
  //       onSelect={() => action?.reload()}
  //       menus={[
  //         { key: 'copy', name: '复制' },
  //         { key: 'delete', name: '删除' },
  //       ]}
  //     />,
  //   ],
  // },
];
const columns2: ProColumns<GithubIssueItem>[] = [//分区字段信息表格列设置
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '标题',
    dataIndex: 'title',
    copyable: true,
    ellipsis: true,
    tip: '标题过长会自动收缩',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
    hideInSearch: true,
  },
  {
    disable: true,
    title: '状态',
    dataIndex: 'state',
    filters: true,
    onFilter: true,
    ellipsis: true,
    valueType: 'select',
    valueEnum: {
      all: { text: '超长'.repeat(50) },
      open: {
        text: '未解决',
        status: 'Error',
      },
      closed: {
        text: '已解决',
        status: 'Success',
        disabled: true,
      },
      processing: {
        text: '解决中',
        status: 'Processing',
      },
    },
    hideInSearch: true,
  },
  {
    disable: true,
    title: '标签',
    dataIndex: 'labels',
    search: false,
    renderFormItem: (_, { defaultRender }) => {
      return defaultRender(_);
    },
    render: (_, record) => (
      <Space>
        {record.labels.map(({ name, color }) => (
          <Tag color={color} key={name}>
            {name}
          </Tag>
        ))}
      </Space>
    ),
  },
  {
    title: '创建时间',
    key: 'showTime',
    dataIndex: 'created_at',
    valueType: 'date',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    valueType: 'dateRange',
    hideInSearch: true,
    hideInTable: true,
    search: {
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1],
        };
      },
    },
  },
  // {
  //   title: '操作',
  //   valueType: 'option',
  //   key: 'option',
  //   render: (text, record, _, action) => [
  //     <a
  //       key="editable"
  //       onClick={() => {
  //         action?.startEditable?.(record.id);
  //       }}
  //     >
  //       编辑
  //     </a>,
  //     <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
  //       查看
  //     </a>,
  //     <TableDropdown
  //       key="actionGroup"
  //       onSelect={() => action?.reload()}
  //       menus={[
  //         { key: 'copy', name: '复制' },
  //         { key: 'delete', name: '删除' },
  //       ]}
  //     />,
  //   ],
  // },
];
const columns3: ProColumns<TableListItem>[] = [//数据预览表格
  {
    title: '应用名称',
    dataIndex: 'name',
    render: (_) => <a>{_}</a>,
    formItemProps: {
      lightProps: {
        labelFormatter: (value) => `app-${value}`,
      },
    },
  },
  {
    title: '创建者',
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
];

export default () => {
  const [tabaction, setTabaction] = useState("1")
  const onChange = (key: string) => {
    setTabaction(key)
    console.log(key);
  };
  const onChange2 = (key: string) => {
    console.log(key);//明细信息二级tab页
  };
  const onChange3 = (key: string) => {
    console.log(key);//数据质量二级tab页
  };
  const actionRef = useRef<ActionType>();
  const items3 = [  //数据质量二级tab页
    {
      key: '1',
      label: `质量报告`,
      children: (
        <>
          <ProCard
            split={'vertical'}
            bordered
            headerBordered
          >
            <ProCard title="" colSpan="33%">
              <div style={{ height: 100 }}>
                <br></br>
                <Row>
                  <Col offset={5}>
                    <Avatar size={64} src={fire} />
                  </Col>
                  <Col>
                    <Statistic
                      title="字段个数"
                      value={11.28}
                      precision={2}
                      valueStyle={{ color: '#3f8600' }}
                      suffix="个"
                    /></Col>
                </Row>
              </div>
            </ProCard>
            <ProCard title="" colSpan="33%">
              <div style={{ height: 100 }}>
                <br></br>
                <Row>
                  <Col offset={5}>
                    <Avatar size={64} src={fire} />
                  </Col>
                  <Col>
                    <Statistic
                      title="质量检测字段数"
                      value={11.28}
                      precision={2}
                      valueStyle={{ color: '#3f8600' }}
                      suffix="个"
                    /></Col>
                </Row>
              </div>
            </ProCard>
            <ProCard title="">
              <div style={{ height: 100 }}>
                <br></br>
                <Row>
                  <Col offset={5}>
                    <Avatar size={64} src={fire} />
                  </Col>
                  <Col>
                    <Statistic
                      title="质量检测规则数"
                      value={11.28}
                      precision={2}
                      valueStyle={{ color: '#3f8600' }}
                      suffix="个"
                    /></Col>
                </Row>
              </div>
            </ProCard>
          </ProCard>
          <ProCard
            split={'vertical'}
            bordered
            headerBordered
          >
            <ProCard title="质量评分" colSpan="66%" extra={<a>质量评分说明</a>}>
              <div style={{ height: 450 }}>
                <ProCard
                  split={'vertical'}
                  bordered
                  headerBordered
                >
                  <ProCard title="概览" colSpan="50%">
                    <div style={{ height: 300 }}>
                    <PieChart/>
                    <Col offset={3}>
                    <a>质量评估一般，还需要继续改进！</a>
                    </Col>
                    </div>
                  </ProCard>
                  <ProCard title="评分维度">
                    <div style={{ height: 350 }}>
                      <Radar/>
                    </div>
                  </ProCard>
                </ProCard>
              </div>
            </ProCard>
            <ProCard title="质量评分规则统计">
              <div style={{ height: 400 }}>
                <Ring/>
              </div>
            </ProCard>
          </ProCard>
        </>
      ),
    },
    {
      key: '2',
      label: `历史运行`,
      children: `Content of Tab Pane 2`,
    },
    {
      key: '3',
      label: `规则明细`,
      children: `Content of Tab Pane 3`,
    },
  ];
  const items2 = [  //明细信息二级tab页
    {
      key: '1',
      label: `字段信息`,
      children: (
        <>
          <Space>
            <Button>编辑</Button>
            <Button>下载</Button>
            <Button>生成Select</Button>
            <Button>生成DDL</Button>
          </Space>
          <br></br>
          <ProTable<GithubIssueItem>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (params = {}, sort, filter) => {
              console.log(sort, filter);
              return request<{
                data: GithubIssueItem[];
              }>('https://proapi.azurewebsites.net/github/issues', {
                params,
              });
            }}
            editable={{
              type: 'multiple',
            }}
            columnsState={{
              persistenceKey: 'pro-table-singe-demos',
              persistenceType: 'localStorage',
              onChange(value) {
                console.log('value: ', value);
              },
            }}
            rowKey="id"
            search={false}//关闭搜索栏还有查询按钮等
            form={{
              // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
              syncToUrl: (values, type) => {
                if (type === 'get') {
                  return {
                    ...values,
                    created_at: [values.startTime, values.endTime],
                  };
                }
                return values;
              },
            }}
            pagination={{
              pageSize: 10,
              onChange: (page) => console.log(page),
            }}
            dateFormatter="string"
            headerTitle={false}//表格头关闭
            options={false}//关闭右上角的刷新设置间距
            toolBarRender={false}//关闭右上角查询等
          />
          <h3>分区字段信息</h3>
          <ProTable<GithubIssueItem>
            columns={columns2}
            actionRef={actionRef}
            cardBordered
            request={async (params = {}, sort, filter) => {
              console.log(sort, filter);
              return request<{
                data: GithubIssueItem[];
              }>('https://proapi.azurewebsites.net/github/issues', {
                params,
              });
            }}
            editable={{
              type: 'multiple',
            }}
            columnsState={{
              persistenceKey: 'pro-table-singe-demos',
              persistenceType: 'localStorage',
              onChange(value) {
                console.log('value: ', value);
              },
            }}
            rowKey="id"
            search={false}//关闭搜索栏还有查询按钮等
            form={{
              // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
              syncToUrl: (values, type) => {
                if (type === 'get') {
                  return {
                    ...values,
                    created_at: [values.startTime, values.endTime],
                  };
                }
                return values;
              },
            }}
            pagination={{
              pageSize: 3,
              onChange: (page) => console.log(page),
            }}
            dateFormatter="string"
            headerTitle={false}//表格头关闭
            options={false}//关闭右上角的刷新设置间距
            toolBarRender={false}//关闭右上角查询等
          />
        </>
      ),
    },
    {
      key: '2',
      label: `分区信息`,
      children: `Content of Tab Pane 2`,
    },
    {
      key: '3',
      label: `变更记录`,
      children: `Content of Tab Pane 3`,
    },
  ];
  const items: TabsProps['items'] = [//一级tab页
    {
      key: '1',
      label: `明细信息`,
      children: (
        <Tabs defaultActiveKey="1" items={items2} onChange={onChange2} />
        // 明细信息二级tab页
      )
    },
    {
      key: '2',
      label: `数据预览`,
      children: (
        <ProTable<TableListItem>
          columns={columns3}
          request={(params, sorter, filter) => {
            // 表单搜索项会从 params 传入，传递给后端接口。
            console.log(params, sorter, filter);
            return Promise.resolve({
              data: tableListDataSource,
              success: true,
            });
          }}
          headerTitle={false}
          rowKey="key"
          pagination={{
            showQuickJumper: true,
          }}
          options={false}
          search={false}
          dateFormatter="string"
          toolBarRender={() => [
            <>
              <a key="s">展示条数</a>
              <InputNumber min={1} max={100} defaultValue={3} onChange={onChange} style={{ width: 60 }} />
              <div key="s" color='grey'>(最大:100)</div>
            </>
          ]}
        />
      )
    },
    {
      key: '3',
      label: `数据质量`,
      children: (
        <>
          <Tabs defaultActiveKey="1" items={items3} onChange={onChange3} />
        </>
      )
    },
    {
      key: '4',
      label: `变更记录`,
      children: (
        <></>
      )
    },
    {
      key: '5',
      label: `血缘关联`,
      children: (
        <></>
      )
    },
  ];


  return (
    <>
      <div style={{ padding: 0, background: '#ffffff', width: '100%' }} className='div.container'>
        <Row>
          <ProCard bordered>
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            {/* 一级tab页 */}
          </ProCard>
        </Row>
      </div>
    </>
  );
};
