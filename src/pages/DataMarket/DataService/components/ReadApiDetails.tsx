import { PageContainer, ProCard, ProDescriptions, ProForm, ProFormGroup, ProFormInstance, ProFormList, ProFormSelect, ProFormText, ProTable } from '@ant-design/pro-components';
import {
  Avatar, Button, Card, Col, Descriptions, Divider, Row, Badge, Statistic, Collapse, TabsProps,
  Tabs, Space, Dropdown, MenuProps, Input, Tag, Alert, Timeline, message,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import base from './icon/信息.svg';
import details from './icon/文档.svg';
import listPicture from "./icon/资产弹窗资产处置.svg"
import '../index.css';
import { detailAndHeaderApi, execute } from '@/services/ant-design-pro/datax';
import { CheckCircleFilled, ClockCircleOutlined, CloseCircleFilled, DownOutlined } from '@ant-design/icons';
import { MyIcon } from '@/services/utils/icon';
import { ColumnsType } from 'antd/es/table';
// import Table from './Table';
const { Panel } = Collapse;

import { useRequest } from 'umi';


export default () => {
  const [detailsData, setDetailsData] = useState<any>({});
  const [resShowData, setResShowData] = useState<Object>({});// 接口请求的返回结果
  const [itemResHidden, setItemResHidden] = useState<Boolean>(false);// 隐藏返回结果面板
  const reqFormListRef = useRef<ProFormInstance>(); // 格式化参数表单ref
  const resFormListRef = useRef<ProFormInstance>(); // 格式化参数表单ref
  const fieldRef = useRef<ProFormInstance>(); // 格式化参数表单ref
  //标签页
  const [tabaction, setTabaction] = useState("1") // tab标识，用于切换tab时请求
  const onChangeItemRes = (key: string) => {
    // setTabaction(key)
  };
  const onChangeitems = (key: string) => {
    setTabaction(key)
    if (key === '3') {//3-请求日志
      setItemResHidden(true)
    } else {
      setItemResHidden(false)
    }
  };
  useEffect(() => {
    let id = localStorage.getItem("api_id");
    detailAndHeaderApi(id).then((res) => {
      setDetailsData(res);
      if (res?.data?.webParams) { // 防止
        setResShowData(JSON.parse(res?.data?.webParams))
      } else {
        setResShowData({})
      }
      if (res?.data?.apiType === '1') {//第三方接入
        let dd = {};
        if (res?.data?.httpParams?.param) {
          dd = JSON.parse(res?.data?.httpParams?.param);
        }
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
  }, []);
  // }, [tabaction]);
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


  const columns: ColumnsType<API.resLogsColumns> = [
    {
      title: 'API名称',
      dataIndex: 'apiName',
      key: 'name',
      align: 'center',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'API类型',
      dataIndex: 'apiType',
      key: 'apiType',
      align: 'center',
      render: (_, record) => {
        let content;
        if (record.apiType === '0') {
          content = '系统生成型';
        } else {
          content = '第三方接入型';
        }
        return <span>{content}</span>;
      },
    },
    {
      title: '调用者IP',
      dataIndex: 'callerIp',
      key: 'address',
      align: 'center',
    },
    {
      title: '请求路径',
      key: 'callerUrl',
      dataIndex: 'callerUrl',
      align: 'center',
    },
    {
      title: '调用数据量',
      key: 'callerSize',
      dataIndex: 'callerSize',
      align: 'center',
    },
    {
      title: '请求参数',
      dataIndex: 'callerParams',
      key: 'callerParams',
    },
    {
      title: '请求时间',
      dataIndex: 'callerDate',
      key: 'callerDate',
      align: 'center',
    },
    {
      title: '请求耗时',
      dataIndex: 'time',
      key: 'time',
      align: 'center',
    },
    {
      title: '请求状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (_, record) => {
        let content;
        if (record.status === '0') {
          content = '失败';
          return (
            <Alert message="失败" type="error" showIcon style={{ width: 85 }} />
          );
        } else {
          content = '成功';
          return (
            <Alert message="成功" type="success" showIcon style={{ width: 85 }} />
          );
        }
      },
    }
  ];

  const apiMonitors = useRequest(
    (data = {}) => {
      return {
        url: `http://172.16.4.72:8612/data/api/apiLogs/page?`,
        method: 'GET',
        params: {
          apiName: data?.apiName,
          pageSize: data?.pageSize,
        }
      };
    },
    {
      manual: true,
    }
  );
  const [timeLineData, setTimeLineData] = useState([]) // tab标识，用于切换tab时请求
  useEffect(() => {
    if (tabaction === '3') {
      let timeLine: any = [];
      let color, colorText, color2
      apiMonitors.run({ apiName: localStorage.getItem('api_name'), pageSize: 40 }).then((res) => {
        (res?.data || []).map((record: API.resLogsColumns) => {
          color = record?.status === '1' ? 'green' : 'red';
          color2 = record?.status === '1' ? 'rgb(86 176 60)' : 'rgb(218 76 65)';
          colorText = record?.status === '1' ? '成功' : '失败';
          if (record?.status === '1')
            timeLine.push({
              dot: <CheckCircleFilled color={color} />,
              label: record?.callerDate,
              children: <div style={{ display: 'flex' }}>
                {/* <Tag color={color2} style={{ height: '90%' }}>{record?.status === '1' ? <CheckCircleFilled /> : <CloseCircleFilled />}&nbsp;{colorText}</Tag> */}
                {"调用者IP："}<Tag color="volcano" style={{ height: '100%', color: '#000' }}>{record?.callerIp} </Tag>
                {"请求耗时："}<Tag color="cyan" style={{ height: '100%', color: '#000' }}>{record?.time} s</Tag>
              </div>,
              position: 'right',
              color: color,
            })
          else
            timeLine.push({
              dot: <CloseCircleFilled color={color} />,
              label: record?.callerDate,
              children: <div style={{ display: 'flex' }}>
                {/* <Tag color={color2} style={{ height: '90%' }}>{record?.status === '1' ? <CheckCircleFilled /> : <CloseCircleFilled />}&nbsp;{colorText}</Tag> */}
                {"调用者IP："}<Tag color="volcano" style={{ height: '100%', color: '#000' }}>{record?.callerIp} </Tag>
                {"请求耗时："}<Tag color="cyan" style={{ height: '100%', color: '#000' }}>{record?.time}</Tag>
              </div>,
              position: 'right',
              color: color,
            })
        })
      });
      setTimeLineData(timeLine);
    }
  }, [tabaction])

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
      disabled: detailsData?.data?.apiType === '1' ? true : false,
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
    },
    {
      key: '3',
      label: '调用历史',
      children: (
        <>
          <div
            style={{
              height: 650,
              overflow: 'auto',
              padding: '0 16px',

            }}>
            <Timeline
              style={{ marginLeft: '-30%' }}
              mode={'left'}
              items={timeLineData}
            />
          </div>
          {/* <ProTable<API.resLogsColumns>
            columns={columns}
            cardBordered
            request={(
              // 第一个参数 params 查询表单和 params 参数的结合
              // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
              params: {
                pageSize: number; // 页数
                current: number; // 每页个数
              },
              sort,
              filter,
            ) => {
              // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
              // 如果需要转化参数可以在这里进行修改
              return apiMonitors.run({
                apiName: localStorage.getItem('api_name'),
                pageNum: params?.current,
                pageSize: params?.pageSize,
              })
            }}
            rowKey="id"
            search={false}
            pagination={{
              pageSize: 10,
              onChange: (page) => console.log(page),
            }}
            dateFormatter="string"
            headerTitle="="
            toolBarRender={false}
          /> */}
        </>
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
            <code>{JSON.stringify(resShowData, null, 4)}</code>
          </pre>
        </Card>
        // 明细信息二级tab页
      )
    },
  ];
  const handle = () => {
    // detailsData?.header?.apiKey,
    //   secretKey: detailsData?.header?.secretKey,
    execute({ apiKey: detailsData?.header?.apiKey, secretKey: detailsData?.header?.secretKey })
      .then((res) => {
        if (res) {
          message.success("执行成功！")
          setResShowData(res)
        }
      })

  }
  return (
    <PageContainer title="查看API详情" extra={[
      <Button type="primary" onClick={() => history.back()}>
        返回
      </Button>]}>
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
                  <Button type='primary' onClick={handle}>执行</Button>
                </Space>
                <Tabs defaultActiveKey="1" items={items} onChange={onChangeitems} />
                {!itemResHidden && <Tabs defaultActiveKey="1" items={itemsRes} onChange={onChangeItemRes} />}
                {/* 一级tab页 */}
              </ProCard>
            </Row>
          </div>
        </Col>
      </Row>
    </PageContainer>
  );
};
