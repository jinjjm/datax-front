import { PageContainer, ProCard } from '@ant-design/pro-components';

import { Button, Col, Form, Row, Select, Space } from 'antd';
import '../Directory/services/index.css';
import ProList from './components/ProList';
import TreeData from './components/TreeData';
const { Option } = Select;
export default () => {
  const onGenderChange = () => {
    console.log(123);
  };
  return (
    <PageContainer
      title="资产目录"
      extra={
        <Form>
          <Form.Item name="version" label="切换版本" rules={[{ required: true }]}>
            <Select onChange={onGenderChange} allowClear defaultValue={2023} style={{ width: 100 }}>
              <Option value="2023">2023</Option>
              <Option value="2022">2022</Option>
              <Option value="2021">2021</Option>
            </Select>
          </Form.Item>
        </Form>
      }
    >
      {/* <Card bordered>
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
      </Card> */}
      <div style={{ padding: 0, background: '#ffffff', width: '100%', borderRadius: 10 }}>
        <Row>
          <Col span={5}>
            <ProCard>
              {/* <ProCard.TabPane key="tab1" tab="输出接口">
                <TreeData treeType={1} />
              </ProCard.TabPane>
              <ProCard.TabPane key="tab2" tab="输入接口">
                <TreeData treeType={2} />
              </ProCard.TabPane> */}
              <br></br>
              <Form>
                <Form.Item name="version" label="编目方式" rules={[{ required: true }]}>
                  <Select
                    onChange={onGenderChange}
                    allowClear
                    defaultValue={'资源'}
                    style={{ width: 110 }}
                  >
                    <Option value="资源">资源</Option>
                    <Option value="部门">部门</Option>
                    <Option value="主题">主题</Option>
                  </Select>
                </Form.Item>
              </Form>
              <TreeData treeType={1} />
            </ProCard>
          </Col>
          <Col span={19}>
            <br></br>
            <Row>
              <Col offset={21}>
                <Space>
                  <Button>导入</Button>
                  <Button>导出</Button>
                </Space>
              </Col>
            </Row>
            <ProList />
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};
