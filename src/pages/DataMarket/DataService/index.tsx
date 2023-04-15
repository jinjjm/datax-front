import { PageContainer, ProCard } from '@ant-design/pro-components';

import { Button, Form, Input, message, Row, Space } from 'antd';
import DetailsTable from './components/DetailsTable';
import TreeData from './components/TreeData';

export default () => {
  return (
    <PageContainer
      extra={
        <Form onFinish={() => message.info('暂不支持查询')}>
          <Row>
            <Space>
              <Form.Item label="API名称" name={'apiName'}>
                <Input style={{ width: 200 }} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {'查询'}
                </Button>
              </Form.Item>
            </Space>
          </Row>
        </Form>
      }
    >
      <ProCard>
        <ProCard tabs={{ type: 'card' }} title="API集市" colSpan="18%">
          <ProCard.TabPane key="tab1" tab="内部数据">
            <TreeData />
          </ProCard.TabPane>
          <ProCard.TabPane key="tab2" tab="外部调用">
            <TreeData />
          </ProCard.TabPane>
        </ProCard>
        <ProCard headerBordered>
          <DetailsTable />
        </ProCard>
      </ProCard>
      {/* <ProCard>
        <TestDemo />
      </ProCard> */}
    </PageContainer>
  );
};
