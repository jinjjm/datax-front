import React from 'react';
import { Badge, Col, Descriptions, Divider, Row, Space, Statistic } from 'antd';
import Tabs from "./Tabs"
import { ProCard, PageContainer } from '@ant-design/pro-components';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { PauseOutlined } from '@ant-design/icons';
import Line from './line';
import WordCloud from "./wordCLoud"
import Icon from "./长方形.svg"
import { useRequest } from 'umi';
import Pie from "./PieChart";
import Pie2 from "./PiePieChart";
import Pie3 from "./PiePiePieChart";
const App = () => {
    const apiLogsCalls = useRequest(
        () => {
            return {
                url: `http://172.16.4.72:8612/data/api/apiLogs/calls`,
                method: 'GET',
            };
        },
        {
            onSuccess: (result, params) => {
            }
        },
    );

    const titleStyle = {
        background: 'white',
        padding: '8px 16px',
        //   borderBottom: '2px solid #fff',
        display: 'flex',
        alignItems: 'center',
        width: '90.2%',
        marginLeft: '-10px',
        marginBottom: '0px',
    };
    const iconStyle = {
        marginRight: '6px',
        color: 'blue',
    };
    return (
        <>
            <PageContainer title="" >
                <ProCard bordered >
                    <Row>
                        <Col span={14}>
                            <ProCard bordered >
                                <Descriptions title="API总览" bordered>
                                </Descriptions>
                                {/* <div style={{ fontWeight: 'bold' }}>API调用总次数：{apiLogsCalls?.data?.[0].callTotal}</div> */}
                                <Row>
                                    <Col span={12} >
                                        <Pie2 />
                                    </Col>
                                    <Col span={12} >
                                        <Pie3 />
                                    </Col>
                                </Row>
                            </ProCard>
                        </Col>
                        <Col span={10}>
                            <ProCard bordered >
                                <Descriptions title="API调用次数总览" bordered>
                                </Descriptions>
                                {/* <div style={{ fontWeight: 'bold' }}>API调用总次数：{apiLogsCalls?.data?.[0].callTotal}</div> */}
                                <Row>
                                    <Col span={8} offset={1}>
                                        <Pie />
                                    </Col>
                                    <Col span={8} offset={5}>
                                        <br></br>
                                        <Row>
                                            <Col offset={4}>
                                                <Statistic
                                                    title="成功率"
                                                    value={11.28}
                                                    precision={0}
                                                    valueStyle={{ color: 'blue' }}
                                                    suffix="%"
                                                />
                                            </Col>
                                        </Row>
                                        <br></br>
                                        <Row>
                                            {apiLogsCalls?.data?.[0].dayGrowthRate < 0 ? (
                                                <>
                                                    < Statistic
                                                        title="日同比"
                                                        value={apiLogsCalls?.data?.[0].dayGrowthRate}
                                                        precision={0}
                                                        valueStyle={{ color: '#cf1322' }}
                                                        prefix={< ArrowDownOutlined />}
                                                        suffix="%"
                                                    />
                                                </>) : (
                                                <>
                                                    <Statistic
                                                        title="日同比"
                                                        value={apiLogsCalls?.data?.[0].dayGrowthRate}
                                                        precision={0}
                                                        valueStyle={{ color: '#3f8600' }}
                                                        prefix={<ArrowUpOutlined />}
                                                        suffix="%"
                                                    />
                                                </>)}
                                            <Col offset={2}>
                                                {apiLogsCalls?.data?.[0].weekGrowthRate < 0 ? (
                                                    <>
                                                        < Statistic
                                                            title="周同比"
                                                            value={apiLogsCalls?.data?.[0].weekGrowthRate}
                                                            precision={0}
                                                            valueStyle={{ color: '#cf1322' }}
                                                            prefix={<ArrowDownOutlined />}
                                                            suffix="%"
                                                        />
                                                    </>) : (
                                                    <>
                                                        <Statistic
                                                            title="周同比"
                                                            value={apiLogsCalls?.data?.[0].weekGrowthRate}
                                                            precision={0}
                                                            valueStyle={{ color: '#3f8600' }}
                                                            prefix={<ArrowUpOutlined />}
                                                            suffix="%"
                                                        />
                                                    </>)}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </ProCard>
                            {/* {callFailTotal:16callSuccessTotal:19callTotal:35dayGrowthRate:0successRate:"54.29%"weekGrowthRate: -100} */}
                        </Col>
                    </Row>
                </ProCard>
                <Row>
                    <Col span={16}>
                        <ProCard bordered style={{ height: "55vh" }}>
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
                        <ProCard bordered style={{ height: "55vh" }}>
                            <div style={{ fontWeight: "bolder", marginTop: 5 }}>API调用错误类型</div>
                            <WordCloud />
                        </ProCard>
                    </Col>
                </Row>
                <ProCard bordered style={{ height: "80vh", width: "100%" }}>
                    <div style={titleStyle}>
                        <img src={Icon} height={25} />
                        {/* <div style={{ color: 'white', fontSize: 16 }}>
                            {'全网地道等级分级/各区地道地区分级'}
                        </div> */}
                        <div style={{ color: 'black', fontSize: 16 }}>
                            {'排行榜'}
                        </div>
                    </div>
                    <Divider style={{ marginTop: -2, marginBottom: 7 }} />
                    <Row>
                        <Space>
                            <Tabs title={"总调用次数排行榜"} />
                            <Tabs title={"调用失败次数排行榜"} />
                            <Tabs title={"调用频率排行榜"} />
                            <Tabs title={"调用耗时排行榜"} />
                            <Tabs title={"调用数据量排行榜"} />
                        </Space>
                    </Row>
                </ProCard>

            </PageContainer>
        </>
    )
};

export default App;