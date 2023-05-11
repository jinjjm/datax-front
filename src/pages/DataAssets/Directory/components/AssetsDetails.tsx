import { PageContainer } from '@ant-design/pro-components';
import { Avatar, Button, Card, Col, Descriptions, Divider, Row, Badge, Statistic, Collapse } from 'antd';
import React, { useState } from 'react';
import base from '../icon/信息.svg';
import details from '../icon/文档.svg';
import listPicture from "../icon/资产弹窗资产处置.svg"
import '../services/index.css';
import Table from './Table';
const { Meta } = Card;
const { Panel } = Collapse;
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
export default () => {
  const [name, setName] = useState("资产名称");
  const [metadata, setMetadata] = useState(11.28);
  return (
    <PageContainer title="资产目录">
      <Row>
        <Col span={6}>
          <Card >
            <Row style={{ marginLeft: 115 }}>
              <img width={100} src={listPicture} />
            </Row>
            <br />
            <Row style={{ marginLeft: 120 }}>
              <h1>{name}</h1>
            </Row>
            <Row style={{ marginLeft: 100 }}>元数据完善度：{
              <Statistic
                value={metadata}
                precision={2}
                valueStyle={{ fontSize: 15, color: '#3f8600' }}
                suffix="%"
              />}</Row>
            <br></br>
            <Row>
              <Col span={9} offset={5}>
                <Button type="primary">申请使用</Button>
              </Col>
              <Col span={5}>
                <Button type="primary">数据分析</Button>
              </Col>
            </Row>
            <Divider />
            <Card bordered={false}className="ant-tabs-nav-container">
              <Collapse defaultActiveKey={['1',"2","3","4","5"]} 
              ghost={true}
              >
                <Panel header="基础信息" key="1">
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
                </Panel>
                <Panel header="业务信息" key="2">
                  <p>{text}</p>
                </Panel>
                <Panel header="管理信息" key="3">
                  <p>{text}</p>
                </Panel>
                <Panel header="安全信息" key="4">
                  <p>{text}</p>
                </Panel>
                <Panel header="共享开放" key="5">
                  <p>{text}</p>
                </Panel>
              </Collapse>
              {/* <Meta avatar={<Avatar src={base} />} title="基本信息" /> */}
              <br></br>
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
