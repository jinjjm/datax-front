import React from 'react';
import { Badge, Col, Descriptions, Row } from 'antd';
import Tabs from "./Tabs"
import { ProCard } from '@ant-design/pro-components';
import Line from './line';
const App: React.FC = () => (
    <>
        <Row>
            <Col span={8}>
                <ProCard bordered >
                    <Row>
                        <Col span={24}>
                            <Descriptions title="API总览" bordered>
                                <Descriptions.Item label="API总数" span={3}>{"123"}</Descriptions.Item>
                                <Descriptions.Item label="类型" span={1}>
                                    系统生成型: {"123"}个
                                    <br />
                                    第三方接入型: {"123"}个
                                    <br />
                                </Descriptions.Item>
                                <Descriptions.Item label="API状态" span={1}>
                                    发布的API总数: {"123"}个
                                    <br />
                                    未布的API总数: {"123"}个
                                    <br />
                                    下线的API总数: {"123"}个
                                    <br />
                                </Descriptions.Item>
                            </Descriptions>
                            <Descriptions title="API调用总览" bordered>
                                <Descriptions.Item label="调用总数" span={3}>{"123"}</Descriptions.Item>
                                <Descriptions.Item label="成功总数" span={1}>{"123"}</Descriptions.Item>
                                <Descriptions.Item label="失败总数" span={1}>{"123"}</Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>
                    <br></br>
                    <Row>
                        <Col span={24}>
                        <Descriptions title="API调用趋势" bordered>
                        </Descriptions>
                            <Line />
                        </Col>
                    </Row>
                </ProCard>
            </Col>
            <Col span={8}>
                {/* <Tabs/> */}

            </Col>
            <Col span={8}>
                <Tabs />
            </Col>
        </Row>
        <Row>
            <Col span={16}>

            </Col>
        </Row>
    </>
);

export default App;