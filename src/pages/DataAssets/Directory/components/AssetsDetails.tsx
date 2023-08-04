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
                    <Descriptions.Item label="数据资源编码">GLZX0000001</Descriptions.Item>
                    <Descriptions.Item label="数据资源名称">公路交通调查实时数据</Descriptions.Item>
                    <Descriptions.Item label="数据资源描述">包含天津市车道号、方向、设备标识、调查数据类型、客车货车流量、客车货车速度等</Descriptions.Item>
                    <Descriptions.Item label="数据资源载体">信息系统</Descriptions.Item>
                    <Descriptions.Item label="数据资源来源">天津市国省干线公路交通情况调查系统</Descriptions.Item>
                    <Descriptions.Item label="存储地址">市公路中心十三楼机房</Descriptions.Item>
                    <Descriptions.Item label="数据存储量">51G</Descriptions.Item>
                    {/* <Descriptions.Item label="Remark">empty</Descriptions.Item>
                    <Descriptions.Item label="Remark">empty</Descriptions.Item> */}
                  </Descriptions>
                </Panel>
                <Panel header="业务信息" key="2">
                  <Descriptions column={1}>
                    <Descriptions.Item label="业务领域">公路交通</Descriptions.Item>
                    <Descriptions.Item label="业务分类">道路运输服务</Descriptions.Item>
                    <Descriptions.Item label="数据特征">政务运行数据</Descriptions.Item>
                    <Descriptions.Item label="是否跨主体流动">否</Descriptions.Item>
                    <Descriptions.Item label="是否为衍生数据">否</Descriptions.Item>
                    <Descriptions.Item label="衍生数据种类">无</Descriptions.Item>
                  </Descriptions>
                </Panel>
                <Panel header="管理信息" key="3">
                  <Descriptions column={1}>
                      <Descriptions.Item label="数据资源提供方">综合规划部</Descriptions.Item>
                      <Descriptions.Item label="数据所在部门">综合规划部</Descriptions.Item>
                    </Descriptions>
                </Panel>
                <Panel header="安全信息" key="4">
                  <Descriptions column={1}>
                    <Descriptions.Item label="安全等级">一级</Descriptions.Item>
                  </Descriptions>
                </Panel>
                <Panel header="共享开放" key="5">
                  <Descriptions column={1}>
                    <Descriptions.Item label="共享类型">无条件共享</Descriptions.Item>
                    <Descriptions.Item label="共享条件">无条件</Descriptions.Item>
                  </Descriptions>
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
