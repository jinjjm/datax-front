import { PageContainer, ProCard } from '@ant-design/pro-components';

import { Button, Card, Form, Input, message, Row, Space } from 'antd';
import ProList from './components/ProList';
import TreeData from './components/TreeData';

export default () => {
  return (
    <PageContainer title="资产目录">
      <Card bordered>
        <Form onFinish={() => message.info('暂不支持查询')}>
          <Row>
            <Space>
              <Form.Item label="资产名称" name={'apiName'}>
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
      <ProCard bordered>
        <ProCard tabs={{ type: 'card' }} colSpan="19%">
          <ProCard.TabPane key="tab1" tab="输出接口">
            <TreeData treeType={1} />
          </ProCard.TabPane>
          <ProCard.TabPane key="tab2" tab="输入接口">
            <TreeData treeType={2} />
          </ProCard.TabPane>
        </ProCard>
        <ProCard headerBordered>
          <ProList />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};
