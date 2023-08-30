import { cancel, copyApiInfo, deleteApiInfo, getApiList, releaseApi } from '@/services/ant-design-pro/datax';
import { CloudUploadOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, message, Space, Tag } from 'antd';
import { useRef } from 'react';

export default () => {
  const actionRef = useRef<ActionType>();
  // const historyRef = React.createRef<any>();

  const handlerOption = (key: any, record: any, action: any) => {
    // console.log(key);
    switch (key) {
      case 'copy':
        message.success('copy');
        copyApiInfo(record?.id).then(() => action?.reload());
        break;
      case 'delete':
        message.success('delete');
        // cnoso
        deleteApiInfo(record?.id).then(() => action?.reload());
        break;
      case 'read':
        localStorage.setItem('api_id', record?.id);
        localStorage.setItem('api_edit_status', 'false');
        localStorage.setItem('api_name', record?.apiName);
        history.push('/datamarket/data-service/read-api-details/');
        break;
      case 'edit':
        if (record?.apiType === "1") {//第三方导入
          localStorage.setItem('api_id', record?.id);
          history.push('/datamarket/data-service/upload');
        } else {//apiType 为 0   系统生成型
          localStorage.setItem('api_id', record?.id);
          localStorage.setItem('api_edit_status', 'true');
          history.push('/datamarket/data-service/api-details');
        }
        break;
      case 'test':
        message.info('测试功能暂未开放');
        break;
      case 'release':
        releaseApi(record?.id).then(() => action?.reload());
        message.success('发布完成');
        break;
      case 'unrelease':
        cancel(record?.id).then((res) => {
          if (res.code === 200) {
            message.success('取消发布');
            action?.reload();
          }
        });
        break;
      // unrelease

    }
  };

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
      title: 'Api类型',
      key: 'apiType',
      dataIndex: 'apiType',
      align: 'center',
      hideInSearch: true,
      valueEnum: {
        0: { text: '系统生成型' },
        1: { text: '第三方接入型' },
      }
    },
    {
      title: '请求类型',
      key: 'reqMethod',
      dataIndex: 'reqMethod',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '返回格式',
      key: 'resType',
      dataIndex: 'resType',
      align: 'center',
      hideInSearch: true,
    },
    {
      disable: true,
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      hideInSearch: true,
      render: (_) => (
        <Space>
          {_ === '1' ? (
            <Tag color="magenta">未发布</Tag>
          ) : _ === '2' ? (
            <Tag color="green">已发布</Tag>
          ) : (
            <Tag color="orange">已下线</Tag>
          )}
        </Space>
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      render: (text, record, _, action) => [
        <TableDropdown
          key="actionGroup"
          onSelect={(key: any) => handlerOption(key, record, action)}
          menus={[
            // { key: 'test', name: '测试' },
            { key: 'release', name: '发布' },
            { key: 'unrelease', name: '取消发布' },
            { key: 'edit', name: '编辑' },
            { key: 'read', name: '查看' },
            { key: 'copy', name: '拷贝' },
            { key: 'delete', name: '删除' },
          ]}
        >
          操作
        </TableDropdown>,
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
      dateFormatter="string"
      headerTitle="API详情列表"
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => {
            localStorage.setItem('api_id', 'new');
            localStorage.setItem('api_edit_status', '');
            history.push('/datamarket/data-service/create-new');
          }}
        >
          新建
        </Button>,
        <Button
          key="button"
          icon={<CloudUploadOutlined />}
          type="primary"
          onClick={() => {
            localStorage.setItem('api_id', 'daoru');
            history.push('/datamarket/data-service/upload');
          }}
        >
          导入
        </Button>,
      ]}
    />
  );
};
