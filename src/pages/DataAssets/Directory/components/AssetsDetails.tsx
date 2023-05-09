import { PageContainer } from '@ant-design/pro-components';
import { Avatar, Button, Card, Col, Descriptions, Divider, Row } from 'antd';
import base from '../icon/信息.svg';
import details from '../icon/文档.svg';
import '../services/index.css';
import Table from './Table';
const url = 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg';
const { Meta } = Card;
export default () => {
  return (
    <PageContainer title="资产目录">
      <Row>
        <Col span={6}>
          <Card className="ant-tabs-nav-container">
            <Row style={{ marginLeft: 120 }}>
              <Avatar size={100} src={url} />
            </Row>
            <Row style={{ marginLeft: 120 }}>
              <h1>oncadsdsd</h1>
            </Row>
            <Row style={{ marginLeft: 100 }}>客户信息（原始数据）</Row>
            <br></br>
            <Row style={{ marginLeft: 130 }}>
              <Button type="primary">去使用</Button>
            </Row>
            <Divider />
            <Card bordered={false}>
              <Meta avatar={<Avatar src={base} />} title="基本信息" />
              <br></br>
              <Descriptions column={1}>
                <Descriptions.Item label="UserName">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="Telephone">1810000000</Descriptions.Item>
                <Descriptions.Item label="Live">Hangzhou, Zhejiang</Descriptions.Item>
                <Descriptions.Item label="Remark">empty</Descriptions.Item>
                <Descriptions.Item label="Remark">empty</Descriptions.Item>
                <Descriptions.Item label="Remark">empty</Descriptions.Item>
                <Descriptions.Item label="Remark">empty</Descriptions.Item>
                <Descriptions.Item label="Remark">empty</Descriptions.Item>
                <Descriptions.Item label="Remark">empty</Descriptions.Item>
              </Descriptions>
            </Card>

            <Card bordered={false}>
              <Meta avatar={<Avatar src={details} />} title="扩展信息" />
              <br></br>
              <Descriptions column={1}>
                <Descriptions.Item label="UserName">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="Telephone">1810000000</Descriptions.Item>
                <Descriptions.Item label="Live">Hangzhou, Zhejiang</Descriptions.Item>
                <Descriptions.Item label="Remark">empty</Descriptions.Item>
                <Descriptions.Item label="Remark">empty</Descriptions.Item>
                <Descriptions.Item label="Remark">empty</Descriptions.Item>
                <Descriptions.Item label="Remark">empty</Descriptions.Item>
                <Descriptions.Item label="Remark">empty</Descriptions.Item>
                <Descriptions.Item label="Remark">empty</Descriptions.Item>
              </Descriptions>
            </Card>
          </Card>
        </Col>
        <Col span={18}>
          <Table />
        </Col>
      </Row>
    </PageContainer>
  );
};
