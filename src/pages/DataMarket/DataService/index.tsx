import { PageContainer, ProCard } from '@ant-design/pro-components';

import { Button, Card, Form, Input, message, Row, Space } from 'antd';
import DetailsTable from './components/DetailsTable';
import TreeData from './components/TreeData';
import TestDemo from './components/TestDemo';

export default () => {
  return (
    <PageContainer title="API集市" >
      <Card bordered >
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
      </Card>
      <ProCard bordered >
        <ProCard tabs={{ type: 'card' }} colSpan="19%" >
          <ProCard.TabPane key="tab1" tab="接口目录">
            <TreeData treeType={1} />
          </ProCard.TabPane>
          {/* <ProCard.TabPane key="tab2" tab="输入接口" >
            <TreeData treeType={2} />
          </ProCard.TabPane> */}
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
