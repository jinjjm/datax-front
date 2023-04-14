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
        <ProCard title="数据源&表" colSpan="18%">
          <TreeData />
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
