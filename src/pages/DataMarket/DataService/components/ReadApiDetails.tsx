import { PageContainer, ProCard, ProDescriptions, ProForm, ProFormGroup, ProFormInstance, ProFormList, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Avatar, Button, Card, Col, Descriptions, Divider, Row, Badge, Statistic, Collapse, TabsProps, Tabs, Space, Dropdown, MenuProps, Input, Table } from 'antd';
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
  const fieldRef = useRef<ProFormInstance>(); // 格式化参数表单ref
  //标签页
  const [tabaction, setTabaction] = useState("1")
  const onChange = (key: string) => {
    setTabaction(key)
  };
  useEffect(() => {
    let id = localStorage.getItem("api_id");
    detailAndHeaderApi(id).then((res) => {
      setDetailsData(res);
      if (res?.data?.apiType === '1') {//第三方接入
        let dd = JSON.parse(res?.data?.httpParams?.param || "");
        let list: { name: string; value: any; }[] = [];
        Object.keys(dd).forEach(function (key: string) {
          list.push({
            name: key,
            value: dd[key],
          });
        });
        reqFormListRef?.current?.setFieldsValue({
          请求参数: list,
        });
      } else {//系统生成
        reqFormListRef?.current?.setFieldsValue({
          请求参数: res?.data?.reqParams || [],
        });
        resFormListRef?.current?.setFieldsValue({
          返回参数: res?.data?.resParams || [],
        });
        fieldRef?.current?.setFieldsValue({
          配置参数: res?.data?.executeConfig?.fieldParams || [],
        })
      }
    });
  }, [tabaction]);
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
    if (rateLimit?.enable === '0') return '当前API未设置限流';
    if (rateLimit?.enable === '1') return '当前API限流，在' + rateLimit?.seconds + '秒内，最大请求次数为：' + rateLimit?.times;
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
                  title: 'api_key',
                  key: 'apiKey',
                  dataIndex: 'apiKey',
                  copyable: true,
                },
                {
                  title: 'secret_key',
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
            {detailsData?.data?.apiType === '1' && <ProDescriptions
              column={2}
              dataSource={{
                paramType: detailsData?.data?.httpParams?.paramType,
              }}
              columns={[
                {
                  title: '请求参数类型',
                  key: 'paramType',
                  dataIndex: 'paramType',
                  valueEnum: {
                    0: { text: 'none' },
                    1: { text: 'form-data' },
                    2: { text: 'application/json' },
                    3: { text: 'x-www-form-urlencoded' }
                  }
                },
              ]}
            >
            </ProDescriptions>}
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
                {
                  detailsData?.data?.apiType === '0' ?
                    <ProFormGroup key="req-group-xitong">
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
                    :
                    <ProFormGroup key="req-group-sanfang">
                      <ProFormText name="name" label="参数名称: " width={150} />
                      <ProFormText name="value" label="参数值: " width={450} />
                    </ProFormGroup>
                }
              </ProFormList>
            </ProForm>
          </Panel>
          <Panel header="返回参数" key="3" hidden={detailsData?.data?.apiType === '0' ? false : true}>
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
    {
      key: '2',
      label: '执行配置',
      hidden: detailsData?.data?.apiType === '1' ? true : false,
      children: (
        <Collapse defaultActiveKey={['1', '2', '3']} >
          <Panel header="配置基本信息" key="1">
            <ProDescriptions
              column={3}
              dataSource={{
                sourceId: detailsData?.data?.executeConfig?.sourceId,
                tableName: detailsData?.data?.executeConfig?.tableName,
                configType: detailsData?.data?.executeConfig?.configType,
              }}
              columns={[
                {
                  title: '数据源',
                  key: 'sourceId',
                  dataIndex: 'sourceId',
                },
                {
                  title: '配置方式',
                  key: 'configType',
                  dataIndex: 'configType',
                  valueEnum: {
                    1: { text: '向导模式' },
                    2: { text: '脚本模式' },
                  }
                },
                {
                  title: '数据库表名称',
                  key: 'tableName',
                  dataIndex: 'tableName',
                },
              ]}
            >
            </ProDescriptions>
          </Panel>
          <Panel header="字段信息" key="2">
            <ProForm
              formRef={fieldRef}
              submitter={false} >
              <ProFormList
                name="配置参数"
                key={'peizhi'}
                creatorButtonProps={false}
                copyIconProps={false}
                deleteIconProps={false}
              >
                <ProFormGroup key="zhixing-group" >
                  <ProFormText name="columnName" label="参数名称: " width={150} />
                  <ProFormText name="dataType" label="参数类型: " width={150} />
                  <ProFormText name="dataLength" label="长度: " width={150} />
                  <ProFormSelect name="reqable" label="是否为请求参数: " width={150}
                    valueEnum={{
                      0: { text: '否' },
                      1: { text: '是' },
                    }} />
                  <ProFormSelect name="resable" label="是否为返回参数: " width={150}
                    valueEnum={{
                      0: { text: '否' },
                      1: { text: '是' },
                    }} />
                </ProFormGroup>
              </ProFormList>
            </ProForm>
          </Panel>
        </Collapse>
      )
    }
  ];
  const itemsRes: TabsProps['items'] = [//一级tab页
    {
      key: '1',
      label: `返回结果`,
      children: (
        <Card bordered
          style={{
            height: 600,
            overflow: 'auto',
            padding: '0 16px',
          }}>
          <pre>
            <code>{JSON.stringify(detailsData, null, 4)}</code>
          </pre>
        </Card>
        // 明细信息二级tab页
      )
    },
  ];
  return (
    <PageContainer title="查看API详情" extra={[
      <Button type="primary" onClick={() => history.back()}>
        返回
      </Button>]}>
      {/* <Table
        dataSource={[{
          value: '类型',
          v1:"varchar",
          v2:"varchar",
          v3:'int'
        }]}
        columns={[
          {
            title: '名称',
            dataIndex: 'value',
            key: 'value',
          },
          {
            title: "id",
            dataIndex: 'v1',
            key: 'v1',
          },
          {
            title: "name",
            dataIndex: 'v2',
            key: 'v2',
          },
          {
            title: "age",
            dataIndex: 'v3',
            key: 'v3',
          },
        ]} /> */}
      <Row style={{ height: '100%', backgroundColor: '#fff' }}>
        <Col span={6} >
          <Card >
            <div style={{ display: 'flow', flexDirection: 'row', textAlign: 'center' }}>
              {/* <img width={100} src={listPicture} /> */}
              <MyIcon type='icon-shujuzichansousuoicon' style={{ fontSize: 110 }} />
            </div>
            {/* <br /> */}
            <div style={{ display: 'flow', flexDirection: 'row', textAlign: 'center' }}>
              <h1>{detailsData?.data?.apiName}</h1>
            </div>
            <Divider />
            <Card bordered={false} className="ant-tabs-nav-container">
              <Collapse defaultActiveKey={['1', '2']}
                ghost={true}
              >
                <Panel header="基础信息" key="1">
                  <Descriptions column={1}>
                    <Descriptions.Item label="API描述">{detailsData?.data?.apiDesc}</Descriptions.Item>
                    <Descriptions.Item label="API类型" >{letxing(detailsData?.data?.apiType)}</Descriptions.Item>
                    <Descriptions.Item label="API版本">{detailsData?.data?.apiVersion}</Descriptions.Item>
                    <Descriptions.Item label="状态" >{zhuangtai(detailsData?.data?.status)}</Descriptions.Item>
                  </Descriptions>
                </Panel>
                <Panel header="安全信息" key="2">
                  <Descriptions column={1}>
                    <Descriptions.Item label="黑名单">{detailsData?.data?.deny}</Descriptions.Item>
                    <Descriptions.Item label="白名单">{detailsData?.data?.allow}</Descriptions.Item>
                    <Descriptions.Item label="限流" >{xianliu(detailsData?.data?.rateLimit)}</Descriptions.Item>
                  </Descriptions>
                </Panel>
                <Panel header="管理信息" key="4" >
                  <Descriptions column={1}>
                    <Descriptions.Item label="创建时间">{detailsData?.data?.createTime}</Descriptions.Item>
                    <Descriptions.Item label="创建人">createBy</Descriptions.Item>
                    <Descriptions.Item label="创建人所属部门">createDept</Descriptions.Item>
                    <Descriptions.Item label="最后更新时间">updateTime</Descriptions.Item>
                    {/* <Descriptions.Item label="SQL语句" >{detailsData?.data?.executeConfig?.sqlText}</Descriptions.Item> */}
                  </Descriptions>
                </Panel>
              </Collapse>
              {/* <Meta avatar={<Avatar src={base} />} title="基本信息" /> */}
              <br></br>
            </Card>
          </Card>
        </Col>
        <Col span={18} >
          <div style={{ padding: 0, background: '#ffffff', width: '100%' }}>
            <Row>
              <ProCard bordered >
                <Space>
                  <Button type='primary'>{detailsData?.data?.reqMethod}</Button>
                  &nbsp;&nbsp;
                  <Input value={detailsData?.data?.apiUrl} style={{ width: '30vw' }} />
                  <Button type='primary'>执行</Button>
                </Space>
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
                <Tabs defaultActiveKey="1" items={itemsRes} onChange={onChange} />
                {/* 一级tab页 */}
              </ProCard>
            </Row>
          </div>
        </Col>
      </Row>
    </PageContainer>
  );
};
