import { PageContainer, ProCard, ProDescriptions, ProForm, ProFormGroup, ProFormInstance, ProFormList, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Avatar, Button, Card, Col, Descriptions, Divider, Row, Badge, Statistic, Collapse, TabsProps, Tabs, Space, Dropdown, MenuProps, Input } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import base from './icon/信息.svg';
import details from './icon/文档.svg';
import listPicture from "./icon/资产弹窗资产处置.svg"
import '../index.css';
import { detailAndHeaderApi } from '@/services/ant-design-pro/datax';
import { DownOutlined } from '@ant-design/icons';
import { MyIcon } from '@/services/utils/icon';
// import Table from './Table';
const { Meta } = Card;
const { Panel } = Collapse;
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
export default () => {
  const [name, setName] = useState("资产名称");
  const [detailsData, setDetailsData] = useState<any>({});
  const [metadata, setMetadata] = useState(11.28);
  const reqFormListRef = useRef<ProFormInstance>(); // 格式化参数表单ref
  const resFormListRef = useRef<ProFormInstance>(); // 格式化参数表单ref
  //标签页
  const [tabaction, setTabaction] = useState("1")
  const onChange = (key: string) => {
    setTabaction(key)
    console.log(key);
  };
  useEffect(() => {
    let id = localStorage.getItem("api_id");
    detailAndHeaderApi(id).then((res) => {
      console.log(res)
      setDetailsData(res);

      reqFormListRef?.current?.setFieldsValue({
        请求参数: res?.data?.reqParams || [],
      });
      resFormListRef?.current?.setFieldsValue({
        返回参数: res?.data?.resParams || [],
      });
    });
  }, []);
  const letxing = (value: any) => {
    if (value === '0') return '系统生成型';
    if (value === '1') return '第三方接入型';
  };
  const zhuangtai = (value: any) => {
    if (value === '1') return '待发布';
    if (value === '2') return '已发布';
    if (value === '3') return '已下线';
  };
  const xianliu = (rateLimit: any) => {
    if (rateLimit === '0') return '当前API未设置限流';
    if (rateLimit === '1') return '当前API限流，在' + rateLimit?.seconds + '分钟内，最大请求次数为：' + rateLimit?.times;
  };
  const peizhi = (value: string) => {
    if (value === '1') return '向导模式';
    if (value === '2') return '脚本模式';
  };

  const items: TabsProps['items'] = [//一级tab页
    {
      key: '1',
      label: `请求信息`,
      children: (
        <Collapse defaultActiveKey={['1', '2', '3']} >
          <Panel header="请求头" key="1">
            <ProDescriptions
              column={2}
              dataSource={{
                apiKey: detailsData?.header?.apiKey,
                secretKey: detailsData?.header?.secretKey,
              }}
              columns={[
                {
                  title: 'apiKey',
                  key: 'apiKey',
                  dataIndex: 'apiKey',
                  copyable: true,
                },
                {
                  title: '密钥',
                  key: 'secretKey',
                  dataIndex: 'secretKey',
                  valueType: 'password',
                  copyable: true,
                },
              ]}
            >
            </ProDescriptions>
          </Panel>
          <Panel header="请求参数" key="2">
            <ProForm
              formRef={reqFormListRef}
              submitter={false}>
              <ProFormList
                name="请求参数"
                key={'req'}
                creatorButtonProps={false}
                copyIconProps={false}
                deleteIconProps={false}
              >
                <ProFormGroup key="req-group">
                  <ProFormText name="paramName" label="参数名称: " width={150} />
                  <ProFormText name="exampleValue" label="参数值: " width={150} />
                  <ProFormSelect name="paramType" label="参数类型: " width={150}
                    valueEnum={{
                      1: { text: '字符串' },
                      2: { text: '整数' },
                      3: { text: '浮点数' },
                      4: { text: '时间' },
                      5: { text: '集合' },
                    }}
                    placeholder={''} />
                  <ProFormText name="paramComment" label="描述: " width={250}
                    placeholder={''} />
                </ProFormGroup>
              </ProFormList>
            </ProForm>
          </Panel>
          <Panel header="返回参数" key="3">
            <ProForm
              formRef={resFormListRef}
              submitter={false}>
              <ProFormList
                name="返回参数"
                key={'res'}
                creatorButtonProps={false}
                copyIconProps={false}
                deleteIconProps={false}
              >
                <ProFormGroup key="res-group">
                  <ProFormText name="fieldName" label="参数名称: " width={150} />
                  {/* <ProFormText name="exampleValue" label="值: " width={150} /> */}
                  <ProFormSelect name="dataType" label="参数类型: " width={150}
                    valueEnum={{
                      1: { text: '字符串' },
                      2: { text: '整数' },
                      3: { text: '浮点数' },
                      4: { text: '时间' },
                      5: { text: '集合' },
                    }}
                    placeholder={''} />
                  <ProFormText name="fieldComment" label="描述: " width={250}
                    placeholder={''} />
                </ProFormGroup>
              </ProFormList>
            </ProForm>
          </Panel>
        </Collapse>
        // 明细信息二级tab页
      )
    },
  ];
  return (
    <PageContainer title="查看API详情" extra={[
      <Button type="primary" onClick={() => history.back()}>
        返回
      </Button>]}>
      <Row style={{ height: '100%' }}>
        <Col span={6}>
          <Card >
            <Row style={{ marginLeft: 115 }}>
              <img width={100} src={listPicture} />
            </Row>
            {/* <br /> */}
            <Row style={{ marginLeft: '20%' }}>
              <h1>名称：{detailsData?.data?.apiName}</h1>
            </Row>
            {/* <Row style={{ marginLeft: 100 }}>元数据完善度：{
              <Statistic
                value={metadata}
                precision={2}
                valueStyle={{ fontSize: 15, color: '#3f8600' }}
                suffix="%"
              />}</Row>
            <br></br> */}
            <Row>
              <Col span={9} offset={5}>
                <Button type="primary">申请使用</Button>
              </Col>
              <Col span={5}>
                <Button type="primary">数据分析</Button>
              </Col>
            </Row>
            <Divider />
            <Card bordered={false} className="ant-tabs-nav-container">
              <Collapse defaultActiveKey={['1']}
                ghost={true}
              >
                <Panel header="基础信息" key="1">
                  <Descriptions column={1}>
                    <Descriptions.Item label="API名称">{detailsData?.data?.apiName}</Descriptions.Item>
                    <Descriptions.Item label="API描述">{detailsData?.data?.apiDesc}</Descriptions.Item>
                    <Descriptions.Item label="API类型" >{letxing(detailsData?.data?.apiDesc)}</Descriptions.Item>
                    <Descriptions.Item label="状态" >{zhuangtai(detailsData?.data?.status)}</Descriptions.Item>
                  </Descriptions>
                </Panel>
                <Panel header="配置信息" key="2">
                  <Descriptions column={1}>
                    <Descriptions.Item label="配置方式">{peizhi(detailsData?.data?.executeConfig?.configType)}</Descriptions.Item>
                    <Descriptions.Item label="数据源">{detailsData?.data?.executeConfig?.sourceId}</Descriptions.Item>
                    <Descriptions.Item label="表名" >{detailsData?.data?.executeConfig?.tableName}</Descriptions.Item>
                    {/* <Descriptions.Item label="SQL语句" >{detailsData?.data?.executeConfig?.sqlText}</Descriptions.Item> */}
                  </Descriptions>
                </Panel>
                <Panel header="安全信息" key="3">
                  <Descriptions column={1}>
                    <Descriptions.Item label="黑名单">null</Descriptions.Item>
                    <Descriptions.Item label="白名单">null</Descriptions.Item>
                    <Descriptions.Item label="限流" >{xianliu(detailsData?.data?.rateLimit)}</Descriptions.Item>
                  </Descriptions>
                </Panel>
              </Collapse>
              {/* <Meta avatar={<Avatar src={base} />} title="基本信息" /> */}
              <br></br>
            </Card>
          </Card>
        </Col>
        <Col span={18}>
          <div style={{ padding: 0, background: '#ffffff', width: '100%' }}>
            <Row>
              <ProCard bordered>
                <Space>
                  <Button type='primary'>{detailsData?.data?.reqMethod}</Button>
                  &nbsp;&nbsp;
                  <Input value={detailsData?.data?.apiUrl} style={{ width: '30vw' }} />
                </Space>
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
                {/* 一级tab页 */}
              </ProCard>
            </Row>
          </div>
        </Col>
      </Row>
    </PageContainer>
  );
};
