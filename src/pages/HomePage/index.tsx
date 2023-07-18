import React from "react";
import { Card, Row, Col, Button, Timeline } from 'antd';
import { 
    SmileOutlined, 
    HomeOutlined, 
    AppstoreOutlined, 
    SettingOutlined, 
    UnlockOutlined, 
    BarChartOutlined } from '@ant-design/icons';
export default () => {
    const gridStyle: React.CSSProperties = {
        width: '1/3',
        textAlign: 'center',
        height: '20vh',
    };
    return (
        <div>
            <Card style={{ width: '80vw', height: '20vh' }}>
                <Row>
                    <Col span={4}>
                        <img src='https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
                            style={{ width: '9vw', height: '15vh' }}
                        />
                    </Col>
                    <Col span={15}>
                        <Row>
                            <div style={{ fontSize: '20px', marginTop: '3%' }}>早安，Serati Ma用户，开始您一天的工作吧</div>
                        </Row>
                        <Row>
                            <div style={{ fontSize: '15px', color: 'gray', marginTop: '3%' }}>今日晴，20℃-32℃</div>
                        </Row>
                    </Col>
                    <Col span={5}>
                        <Row style={{ marginTop: '10%' }}>
                            <div style={{ fontSize: '15px', color: 'gray', marginLeft: '4%' }}>待办</div>
                            <div style={{ fontSize: '15px', color: 'gray', marginLeft: '20%' }}>项目</div>
                            <div style={{ fontSize: '15px', color: 'gray', marginLeft: '20%' }}>团队</div>
                        </Row>
                        <Row>
                            <div style={{ fontSize: '25px', marginTop: '4%' }}>2/10</div>
                            <div style={{ fontSize: '25px', marginTop: '4%', marginLeft: '20%' }}>8</div>
                            <div style={{ fontSize: '25px', marginTop: '4%', marginLeft: '20%' }}>300</div>
                        </Row>
                    </Col>
                </Row>
            </Card>
            <Row style={{ marginTop: '1%' }}>
                <Col span={15}>
                    <Card title="最新动态" bordered={false} style={{ width: '50vw', height: '90vh' }} headStyle={{ fontSize: '20px', height: '10vh' }}
                        extra={<Button type="link">更多</Button>}>
                        <Timeline
                            items={[
                                {
                                    color: 'green',
                                    children: 'Create a services site 2015-09-01',
                                },
                                {
                                    color: 'green',
                                    children: 'Create a services site 2015-09-01',
                                },
                                {
                                    color: 'red',
                                    children: (
                                        <>
                                            <p>Solve initial network problems 1</p>
                                            <p>Solve initial network problems 2</p>
                                            <p>Solve initial network problems 3 2015-09-01</p>
                                        </>
                                    ),
                                },
                                {
                                    children: (
                                        <>
                                            <p>Technical testing 1</p>
                                            <p>Technical testing 2</p>
                                            <p>Technical testing 3 2015-09-01</p>
                                        </>
                                    ),
                                },
                                {
                                    color: 'gray',
                                    children: (
                                        <>
                                            <p>Technical testing 1</p>
                                            <p>Technical testing 2</p>
                                            <p>Technical testing 3 2015-09-01</p>
                                        </>
                                    ),
                                },
                                {
                                    color: 'gray',
                                    children: (
                                        <>
                                            <p>Technical testing 1</p>
                                            <p>Technical testing 2</p>
                                            <p>Technical testing 3 2015-09-01</p>
                                        </>
                                    ),
                                },
                                {
                                    color: '#00CCFF',
                                    dot: <SmileOutlined />,
                                    children: <p>Custom color testing</p>,
                                },
                            ]}
                        />
                    </Card>
                </Col>
                <Col span={9}>
                    <Card title="快捷导航" style={{ width: '29.2vw', height: '50vh', marginLeft:'5%'}} headStyle={{ fontSize: '20px', height: '10vh' }}>
                        <Card.Grid style={gridStyle}>
                            <div>
                                <HomeOutlined style={{ fontSize: '40px', marginTop: '20%',color:'#09fb96'}}/>
                            </div>
                            <div style={{fontSize:'15px', marginTop:'10%'}}>首页</div>
                        </Card.Grid>
                        <Card.Grid style={gridStyle}>
                            <div>
                                <AppstoreOutlined style={{ fontSize: '40px', marginTop: '20%',color:'#fe2d07'}}/>
                            </div>
                            <div style={{fontSize:'15px', marginTop:'10%'}}>仪表盘</div>
                        </Card.Grid>
                        <Card.Grid style={gridStyle}>
                            <img src={require('./组件信息.png')} style={{width:'3vw', height:'6vh', marginTop: '18%'}}/>
                            <div style={{fontSize:'15px', marginTop:'2%'}}>组件</div>
                        </Card.Grid>
                        <Card.Grid style={gridStyle}>
                            <div>
                                <SettingOutlined style={{ fontSize: '40px', marginTop: '20%',color:'#18ec57'}}/>
                            </div>
                            <div style={{fontSize:'15px', marginTop:'10%'}}>系统管理</div>
                        </Card.Grid>
                        <Card.Grid style={gridStyle}>
                            <div>
                                <UnlockOutlined style={{ fontSize: '40px', marginTop: '20%',color:'#12671b'}}/>
                            </div>
                            <div style={{fontSize:'15px', marginTop:'10%'}}>权限管理</div>
                        </Card.Grid>
                        <Card.Grid style={gridStyle}>
                            <div>
                                <BarChartOutlined style={{ fontSize: '40px', marginTop: '20%',color:'#0885f2'}}/>
                            </div>
                            <div style={{fontSize:'15px', marginTop:'10%'}}>图表</div>
                        </Card.Grid>
                    </Card>

                </Col>
            </Row>
        </div>
    )
}