import { ProList } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Descriptions, Space, Tag } from 'antd';
import fire from "../icon/火焰.svg"
import listPicture from "../icon/表格.svg"
import request from 'umi-request';
import { FireOutlined } from '@ant-design/icons';
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

export default () => (
  <ProList<GithubIssueItem>
    // toolBarRender={() => {
    //   return [
    //     <Button key="3" type="primary">
    //       新建
    //     </Button>,
    //   ];
    // }}
    // headerTitle="基础列表"
    itemLayout="vertical"
    search={{
      filterType: 'light',
    }}
    rowKey="name"
    request={async (params = {}) =>
      request<{
        data: GithubIssueItem[];
      }>('https://proapi.azurewebsites.net/github/issues', {
        params,
      })
    }
    pagination={{
      pageSize: 5,
    }}
    // showActions="always"
    metas={{
      avatar: {
        render: () => {
          return (
            <img width={15} src={listPicture} alt="" />
          )
        },
        search: false,
      },
      title: {
        dataIndex: 'user',
        title: '用户',
        search: false,
      },
      description: {
        dataIndex: 'title',
        search: false,
      },
      content: {
        render: () => {
          return (
            <Descriptions title="">
              <Descriptions.Item label="UserName">Zhou Maomao</Descriptions.Item>
              <Descriptions.Item label="Telephone">1810000000</Descriptions.Item>
              <Descriptions.Item label="Live">Hangzhou, Zhejiang</Descriptions.Item>
              <Descriptions.Item label="Remark">empty</Descriptions.Item>
              <Descriptions.Item label="Address">
                No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
              </Descriptions.Item>
            </Descriptions>
          );
        },
        search: false,
      },
      subTitle: {
        dataIndex: 'labels',
        render: (_, row) => {
          return (
            <Space size={0}>
              <>
                {row.labels?.map((tag) => {
                  let color = tag.color === "processing" ? 'geekblue' : 'green';
                  if (tag.color === 'error') {
                    color = 'volcano';
                  }
                  return (
                    <>
                      <img width={15} src={fire} alt="" />
                      &nbsp;
                      <>{row.number}</>
                    </>
                  );
                })}
              </>
            </Space>
          );
        },
        search: false,
      },
      extra: {
        render: (text, row) => (
          <Space>
            <a href={row.url} target="_blank" rel="noopener noreferrer" key="link">
              链路
            </a>
            <a href={row.url} target="_blank" rel="noopener noreferrer" key="warning">
              报警
            </a>
            <a
              href={row.url}
              target="_blank"
              rel="noopener noreferrer"
              key="view"
              onClick={() => {
                history.push('/data-assets/assetsDetails');
              }}
            >
              查看
            </a>
          </Space>
        ),
        search: false,
      },

    }}
  />
);
