import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormDependency,
  ProFormGroup,
  ProFormInstance,
  ProFormList,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
  StepsForm,
} from '@ant-design/pro-components';
import { Breadcrumb, Button, Divider, message, notification, Space, Tag, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';

import { getApiTrees2 } from '@/services/ant-design-pro/datax';
import { MyIcon } from '@/services/utils/icon';
import { FileSearchOutlined, SaveOutlined } from '@ant-design/icons';
import { NotificationPlacement } from 'antd/es/notification/interface';
import { history } from 'umi';
import { handleTreeData, TitleAdapter } from '../../DataService/services/Handle';
import { getServiceDetails, testUrl } from '../api';
import '../index.css';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
// xs, sm, md, lg, xl,
const width_form_item = 'lg'; // 大小
// true false
const request_item = true; // 是否必填项
const key1 = ['success', 'code', 'msg', 'data'];
const key2 = ['data', 'head', 'code', 'msg'];
const res = {
  success: true,
  code: 200,
  msg: '操作成功',
  data: [
    {
      data: {
        id: '1298954518389604354',
        status: '1',
      },
      header: {
        serviceKey: 'r/628r00siAeYvnHkMEEM9rafPUt6nxV',
        secretKey: 'bDhHFzcDcmo=',
      },
    },
    {
      data: {
        id: '1298954518389604354',
        status: '1',
      },
      header: {
        serviceKey: 'r/628r00siAeYvnHkMEEM9rafPUt6nxV',
        secretKey: 'bDhHFzcDcmo=',
      },
    },
  ],
};
//颜色分布
const tagColor = [
  'processing',
  'success',
  'error',
  'warning',
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
];

/**
 * 待修改：
 * 1、提交改保存
 * 2、bug 格式化参数需要点两次才能传值
 * 3、是否分页，选择否时，需要删除pagenum和size----解决
 */

export default () => {
  const formRef = useRef<ProFormInstance>(); // 详情表单ref
  const formListRef = useRef<ProFormInstance>(); // 格式化参数表单ref
  const [serviceTemp, setServiceTemp] = useState(''); // 新建、详情页面的标识
  const [readonlyfrom, setReadonlyfrom] = useState<boolean>(false); // 是否为仅可读表单
  const [serviceType, setServiceType] = useState(''); //''--关闭、'1'--格式化参数表开启、'2'--soap
  const [nextState, setNextState] = useState(true); // nextState测试完下一步按钮的状态,
  // const [testResponse, setTestResponse] = useState({}); // 测试接口返回数据
  const [testResType, setTestResType] = useState(false); // false--关闭返回结果展示 true--打开
  const step2FormRef = useRef<ProFormInstance<any>>();
  const step3FormRef = useRef<ProFormInstance<any>>();
  const [testRes, setTestRes] = useState({}); //''--关闭、'1'--格式化参数表开启、'2'--soap

  const [api, contextHolder] = notification.useNotification(); // 分页消息通知

  // 获取详情
  useEffect(() => {
    const serviceTempId = history.location.pathname.replace(
      '/datamarket/data-integration/service-details/',
      '',
    );
    setServiceTemp(serviceTempId);

    if (localStorage.getItem('service_id') === '') history.back();
    formRef.current?.resetFields(); // 清空表单
    if (serviceTempId === 'new') {
      setReadonlyfrom(false);
    } else {
      setReadonlyfrom(true);
      setNextState(false);
      getServiceDetails(serviceTempId).then((res) => {
        console.log(res);
        formRef.current?.setFieldsValue({ ...res?.data?.data });
      });
    }
  }, [localStorage.getItem('service_id')]);

  // 测试后将测试数据塞入
  useEffect(() => {
    step2FormRef.current?.setFieldsValue({
      输入字段名: key1.map((e) => {
        return {
          label: e,
          value: e,
        };
      }),
      输出字段: key2.map((e) => {
        return {
          label: e,
          value: e,
        };
      }),
      输出表: 'key',
      数据所在路径: 'aaaa',
    });
  }, [testResType]);

  // const onSelect = (keys: React.Key[], info: any) => {
  //     console.log('keys ', keys);
  //     console.log('info: ', info);
  // };
  const rightCardTitle = () => {
    if (serviceType === '1') {
      return '服务请求参数格式化';
    }
    if (serviceType === '2') {
      return 'SOAP内容';
    }
    if (testResType) {
      return '测试返回结果展示';
    }
  };
  const rightCardExtra = () => {
    if (serviceType === '1' || serviceType === '2') {
      return (
        <Space>
          <Button type="primary" onClick={() => formListRef.current?.submit()}>
            存入表单
          </Button>
          <Button onClick={() => setServiceType('')}>关闭</Button>
        </Space>
      );
    }
    if (testResType) {
      return (
        <Space>
          <Button onClick={() => setTestResType(false)}>关闭</Button>
        </Space>
      );
    }
  };
  // 通知分页
  const openNotification = (placement: NotificationPlacement) => {
    api.success({
      message: `已选择分页`,
      description: (
        <div style={{ display: 'flex' }}>
          设置在服务请求参数中，修改分页字段与个数， 默认为pageSize、pageNum
        </div>
      ),
      placement,
    });
  };

  //同步校验 数据对比
  const duibi = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 25 }}>
        <div style={{ flex: 1, textAlign: 'center' }} key={'leftkeys'}>
          <div style={{ fontWeight: 500, fontSize: 18 }}>输入表字段</div>
          {key1.map((e, i) => (
            <div key={i}>
              <Divider style={{ margin: '8px 0' }} />
              <Tag bordered={false} color={tagColor[i]} style={{ fontSize: 15 }}>
                {e}
              </Tag>
            </div>
          ))}
        </div>
        <Divider type="vertical" style={{ width: '10px', height: '100%' }} />
        <div style={{ flex: 1, textAlign: 'center' }} key={'rightkeys'}>
          <div style={{ fontWeight: 500, fontSize: 18 }}>输出表字段</div>
          {key2.map((e, i) => (
            <div key={i}>
              <Divider style={{ margin: '8px 0' }} />
              <Tag bordered={false} color={tagColor[i]} style={{ fontSize: 15 }}>
                {e}
              </Tag>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <PageContainer
      title=" "
      header={{
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>数据源</Breadcrumb.Item>
            <Breadcrumb.Item>服务集成</Breadcrumb.Item>
            <Breadcrumb.Item>{TitleAdapter(serviceTemp)}</Breadcrumb.Item>
          </Breadcrumb>
        ),
      }}
    >
      {contextHolder}
      <ProCard
        title={'服务集成' + (serviceTemp === 'new' ? '新增' : '详情')}
        headerBordered
        extra={
          <Space>
            {serviceTemp === 'new' ? (
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={() => formRef.current?.submit()}
              >
                {' '}
                提交{' '}
              </Button>
            ) : (
              <>
                <Button
                  type="primary"
                  icon={<MyIcon type="icon-jiekourizhi" />}
                  onClick={() => setReadonlyfrom(false)}
                >
                  {' '}
                  编辑{' '}
                </Button>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={() => formRef.current?.submit()}
                >
                  {' '}
                  保存{' '}
                </Button>
              </>
            )}
            <Button
              type="dashed"
              icon={<MyIcon type="icon-fanhui" />}
              onClick={() => history.back()}
            >
              返回
            </Button>
          </Space>
        }
      >
        <ProCard split="vertical">
          <ProCard colSpan="50%">
            <StepsForm
              formRef={formRef}
              onFinish={async (values: any) => {
                console.log(values);
                // let params = {
                //     httpService: null,
                //     webService: null,
                //     ...values,
                // }
                // if (serviceTemp === 'new') {
                //     addService(params).then((res) => {
                //         if (res.data?.id) {
                //             message.success("新建成功");
                //             waitTime(500);
                //             history.back();
                //         } else message.error("新建失败");
                //     })
                // } else {
                //     updateService(params).then((res) => {
                //         console.log(res)
                //         if (res.code === 200) {
                //             message.success("更新成功");
                //             waitTime(500);
                //             history.back();
                //         } else message.error("更新失败");
                //     })
                // }
                message.info('同步去了。。。。');
                await waitTime(500);
                return true;
              }}
              submitter={{
                render: (props) => {
                  if (props.step === 0) {
                    return (
                      <Space>
                        <Button
                          type="primary"
                          onClick={() => {
                            console.log(props?.form?.getFieldsValue())
                            testUrl(props?.form?.getFieldsValue()).then((res) => {
                              setTestRes(res);
                              setTestResType(true);
                              setServiceType('');
                            })
                          }}
                        >
                          测试
                        </Button>
                        <Button
                          type="primary"
                          onClick={() => props.onSubmit?.()}
                          disabled={nextState}
                        >
                          下一步
                        </Button>
                      </Space>
                    );
                  }
                  if (props.step === 1) {
                    return [
                      <Button key="pre" onClick={() => props.onPre?.()}>
                        返回上一步
                      </Button>,
                      <Button type="primary" key="goToTree" onClick={() => props.onSubmit?.()}>
                        下一步
                      </Button>,
                    ];
                  }

                  return [
                    <Button key="gotoTwo" onClick={() => props.onPre?.()}>
                      返回上一步
                    </Button>,
                    <Button type="primary" key="goToTree" onClick={() => props.onSubmit?.()}>
                      同步
                    </Button>,
                  ];
                },
              }}
            >
              <StepsForm.StepForm
                name="step1"
                title="接口服务测试"
                stepProps={{
                  description: '填入测试基本信息',
                }}
                onFinish={async () => {
                  console.log(formRef.current?.getFieldsValue());
                  await waitTime(500);
                  return true;
                }}
                readonly={readonlyfrom}
                {...formItemLayout}
                layout={'horizontal'}
              >
                <ProFormText
                  name={'serviceName'}
                  label="服务名称"
                  width={width_form_item}
                  rules={[{ required: request_item }]}
                />
                <ProFormText name={'id'} hidden />
                {/* <ProFormTreeSelect
                  label="服务分组"
                  name={'serviceGroup'}
                  allowClear
                  width={width_form_item}
                  request={async () =>
                    await getApiTrees2().then((res) => handleTreeData(res, false))
                  }
                  fieldProps={{
                    filterTreeNode: true,
                    showSearch: true,
                    autoClearSearchValue: true,
                    treeNodeFilterProp: 'menuName',
                    fieldNames: {
                      label: 'menuName',
                      value: 'id',
                      children: 'childrenMenu',
                    },
                    // onSelect: onSelect,
                  }}
                  hidden
                  // rules={[{ required: request_item }]}
                /> */}
                <ProFormSelect
                  name={'serviceType'}
                  label="服务类型"
                  width={width_form_item}
                  valueEnum={{
                    1: 'http接口',
                    2: 'webservice接口',
                  }}
                  fieldProps={{
                    //e--event
                    onChange: () => setServiceType(''),
                  }}
                  rules={[{ required: request_item }]}
                />
                <ProFormDependency name={['serviceType']}>
                  {({ serviceType }) => {
                    if (serviceType === '2') {
                      return (
                        <>
                          <ProFormText
                            name={['webService', 'wsdl']}
                            label="服务描述WSDL"
                            width={width_form_item}
                          />
                          <ProFormText
                            name={['webService', 'targetNamespace']}
                            label="报文头"
                            width={width_form_item}
                          />
                          <ProFormTextArea
                            name={['webService', 'soap']}
                            label="SOAP"
                            width={width_form_item}
                            fieldProps={{
                              autoSize: { minRows: 6, maxRows: 6 },
                            }}
                            addonAfter={
                              <Tooltip title="右侧查看" placement="top">
                                <a
                                  onClick={() =>
                                    setServiceType(formRef.current?.getFieldValue('serviceType'))
                                  }
                                >
                                  <FileSearchOutlined />
                                </a>
                              </Tooltip>
                            }
                          />
                          <ProFormText
                            name={['webService', 'method']}
                            label="请求方式"
                            width={width_form_item}
                          />
                        </>
                      );
                    } else {
                      return (
                        <>
                          <ProFormSelect
                            name={['httpService', 'httpMethod']}
                            label="服务请求方式"
                            width={width_form_item}
                            valueEnum={{
                              GET: 'GET',
                              POST: 'POST',
                              DELETE: 'DELETE',
                              PUT: 'PUT',
                            }}
                            rules={[{ required: request_item }]}
                          />
                          <ProFormText
                            name={['httpService', 'url']}
                            label="服务请求地址"
                            width={width_form_item}
                            rules={[{ required: request_item }]}
                          />
                          <ProFormText
                            name={['httpService', 'header']}
                            label="服务请求头"
                            width={width_form_item}
                            hidden
                          />
                          <ProFormRadio.Group
                            name={['httpService', 'fenye']}
                            label="是否分页"
                            width={width_form_item}
                            options={[
                              {
                                label: '否',
                                value: '0',
                              },
                              {
                                label: '是',
                                value: '1',
                              },
                            ]}
                            fieldProps={{
                              onChange: (e) => {
                                // console.log(e?.target?.value)
                                let temp = JSON.parse(
                                  formRef.current?.getFieldValue(['httpService', 'param']) || '{}',
                                );

                                if (e?.target?.value === '1') {
                                  openNotification('topLeft');
                                  temp = {
                                    ...temp,
                                    pageNum: 1, //页码
                                    pageSize: 5, //每页个数
                                  };
                                } else {
                                  // 删除pagenum和size
                                  temp.pageNum = undefined;
                                  temp.pageSize = undefined;
                                  console.log(temp);
                                }
                                formRef.current?.setFieldsValue({
                                  httpService: { param: JSON.stringify(temp) },
                                });
                              },
                            }}
                          />
                          <ProFormTextArea
                            name={['httpService', 'param']}
                            label="服务请求参数"
                            width={width_form_item}
                            addonAfter={
                              <Tooltip title={'格式化编辑'} placement="top">
                                <a
                                  onClick={() => {
                                    // ts 字符串转数组
                                    let temp = JSON.parse(
                                      formRef.current?.getFieldValue(['httpService', 'param']) ||
                                      '{}',
                                    );
                                    let list: { value: string; label: any; type: string }[] = [];
                                    Object.keys(temp).forEach(function (key: string) {
                                      list.push({
                                        label: key,
                                        value: temp[key],
                                        type: typeof temp[key],
                                      });
                                    });
                                    formListRef.current?.resetFields();
                                    formListRef.current?.setFieldsValue({ serviceList: list });
                                    setServiceType(formRef.current?.getFieldValue('serviceType'));
                                    setTestResType(false);
                                  }}
                                >
                                  <FileSearchOutlined />
                                </a>
                              </Tooltip>
                            }
                          />
                        </>
                      );
                    }
                  }}
                </ProFormDependency>
                <ProFormRadio.Group
                  name={'status'}
                  label="状态"
                  options={[
                    {
                      label: '启用',
                      value: '1',
                    },
                    {
                      label: '禁用',
                      value: '2',
                    },
                  ]}
                  // rules={[{ required: request_item }]}
                  width={width_form_item}
                  hidden
                />
              </StepsForm.StepForm>
              <StepsForm.StepForm
                name="step2"
                title="数据转化"
                formRef={step2FormRef}
                stepProps={{
                  description: '描述',
                }}
                onFinish={async () => {
                  console.log(formRef.current?.getFieldsValue());
                  await waitTime(500);
                  return true;
                }}
                {...formItemLayout}
                layout={'horizontal'}
                readonly={readonlyfrom}
              >
                <ProFormText
                  name={'数据所在路径'}
                  label="数据所在路径"
                  width={width_form_item}
                  placeholder={'例如: data.data '}
                  rules={[{ required: request_item }]}
                />
                <ProFormSelect
                  name={'输入字段名'}
                  label="输入字段名"
                  width={width_form_item}
                  fieldProps={{
                    mode: 'multiple',
                  }}
                  rules={[{ required: request_item }]}
                />
                <ProFormSelect
                  name={'输出表'}
                  label="输出表"
                  width={'md'}
                  rules={[{ required: request_item }]}
                  addonAfter={<a onClick={() => message.info('一键建表')}>一键建表</a>}
                />
                <ProFormSelect
                  name={'输出字段'}
                  label="输出字段"
                  width={width_form_item}
                  fieldProps={{
                    mode: 'multiple',
                  }}
                  rules={[{ required: request_item }]}
                />
              </StepsForm.StepForm>
              <StepsForm.StepForm
                name="step3"
                title="同步校验"
                formRef={step3FormRef}
                stepProps={{
                  description: '检查参数对应',
                }}
                {...formItemLayout}
                layout={'horizontal'}
              >
                {duibi()}
              </StepsForm.StepForm>
            </StepsForm>
          </ProCard>
          <ProCard
            colSpan="50%"
            style={{
              height: 560,
              overflow: 'auto',
              padding: '0 16px',
            }}
            title={rightCardTitle()}
            extra={rightCardExtra()}
            bordered={true}
          >
            {testResType ? (
              <pre>
                <code>{JSON.stringify(res, null, 4)}</code>
              </pre>
            ) : null}
            {serviceType === '' ? null : (
              <ProForm
                formRef={formListRef}
                layout={'vertical'}
                onFinish={async (values) => {
                  let obj: any = {};
                  (values?.serviceList || []).forEach((item: any) => {
                    obj[item?.label] = item?.value;
                  });
                  formRef.current?.setFieldsValue({ httpService: { param: JSON.stringify(obj) } });
                  return true;
                }}
                submitter={false}
              >
                {serviceType === '1' ? (
                  <ProFormList
                    name="serviceList"
                    initialValue={[
                      {
                        value: '',
                        label: '',
                      },
                    ]}
                  >
                    <ProFormGroup key="service-group">
                      <ProFormText name="label" label="名称: " width={140} />
                      <ProFormText name="value" label="值: " width={140} />
                      <ProFormSelect
                        name="type"
                        label="类型: "
                        valueEnum={{
                          string: '字符串型',
                          number: '数值型',
                          boolean: '布尔型',
                        }}
                        width={170}
                      />
                    </ProFormGroup>
                  </ProFormList>
                ) : (
                  <ProFormTextArea
                    name={'soap'}
                    fieldProps={{
                      autoSize: { minRows: 20, maxRows: 20 },
                    }}
                  />
                )}
              </ProForm>
            )}
          </ProCard>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};
