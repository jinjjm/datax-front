import {
  ModalForm,
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
import { Breadcrumb, Button, Divider, message, Modal, notification, Space, Tag, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';

import { getApiTrees2, getDatabaseTableName, getDatasourceList, getTableColumn } from '@/services/ant-design-pro/datax';
import { MyIcon } from '@/services/utils/icon';
import { FileSearchOutlined, SaveOutlined } from '@ant-design/icons';
import { NotificationPlacement } from 'antd/es/notification/interface';
import { history } from 'umi';
import { handleTreeData, TitleAdapter } from '../../DataService/services/Handle';
import { createTableSql, ddlTableSql, getServiceDetails, syncData, testUrl } from '../api';
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
  const [testRes, setTestRes] = useState({}); //测试返回数据
  const [testResColumn, setTestResColumn] = useState([]); //输入字段名
  const [column, setColumn] = useState([]); //输出字段
  const [isModalOpen, setIsModalOpen] = useState(false);//一键建表痰喘
  const formRefModal = useRef<ProFormInstance>(); // 详情表单ref

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
          {(step2FormRef.current?.getFieldValue('dataColumn') || []).map((e, i) => (
            <div key={i}>
              <Divider style={{ margin: '8px 0' }} />
              <Tag bordered={false} color={tagColor[i]} style={{ fontSize: 15 }}>
                {e?.label}
              </Tag>
            </div>
          ))}
        </div>
        <Divider type="vertical" style={{ width: '10px', height: '100%' }} />
        <div style={{ flex: 1, textAlign: 'center' }} key={'rightkeys'}>
          <div style={{ fontWeight: 500, fontSize: 18 }}>输出表字段</div>
          {(step2FormRef.current?.getFieldValue('column') || []).map((e, i) => (
            <div key={i}>
              <Divider style={{ margin: '8px 0' }} />
              <Tag bordered={false} color={tagColor[i]} style={{ fontSize: 15 }}>
                {e?.label}
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
                let params = {
                  ...values,
                  column: values.column.map((e: { value: any; }) => e.value),
                  dataColumn: values.dataColumn.map((e: { value: any; }) => e.value),
                };
                if (serviceTemp === 'new') {
                  syncData(params).then((res) => {
                    console.log(res);
                    message.info('新建同步完成')
                  })
                } else {
                  message.info('修改同步完成')
                }
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
                              setTestRes(JSON.parse(res?.response));
                              //dataColumn 内容和下拉框赋值
                              let d = (res?.dataColumn || []).map((e) => {
                                return {
                                  value: e,
                                  label: e
                                }
                              });
                              step2FormRef.current?.setFieldsValue({
                                dataPath: res?.dataKey,
                                dataColumn: d,
                              })
                              setTestResColumn(d)
                              setTestResType(true);
                              setServiceType('');
                              setNextState(false)
                            });
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
                  return [
                    <Button key="gotoTwo" onClick={() => props.onPre?.()}>
                      返回上一步
                    </Button>,
                    <ModalForm
                      title="同步校验字段"
                      trigger={<Button type="primary">同步</Button>}
                      onFinish={async () => {
                        //提交同步
                        props.onSubmit?.();
                        await waitTime(500);
                        return true;
                      }}
                    >
                      {duibi()}
                    </ModalForm>
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
                initialValues={{
                  url: 'http://10.1.40.85:7778/sources/queryList',
                  serviceType: '1',
                  httpMethod: 'POST',
                  paramType: '2',
                  fenye: '0',
                  param: "{\"dataSourceId\": \"1377933635223552\",\"offset\": 0,\"pageNum\": 1,\"pageSize\": 2,\"sql\": \"select * from data_governance.metadata_source\"}"
                  // {"datasourceId":"1377933635223552 ","offset": 0, "pagelum": 1, "pagesize": 2,"sgl": "select *from data_governance.metadata_source"}
                }}
              >
                <ProFormText
                  name={'serviceName'}
                  label="服务名称"
                  width={width_form_item}
                />
                <ProFormText name={'id'} hidden />
                <ProFormSelect
                  name={'serviceType'}
                  label="服务类型"
                  width={width_form_item}
                  options={[
                    {
                      label: 'http接口',
                      value: '1',
                    },
                    {
                      label: 'webservice接口',
                      value: '2',
                    },
                  ]}
                  disabled
                  fieldProps={{
                    //e--event
                    onChange: () => setServiceType(''),
                  }}
                  rules={[{ required: request_item }]}
                />
                <ProFormSelect
                  name={'httpMethod'}
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
                  name={'url'}
                  label="服务请求地址"
                  width={width_form_item}
                  rules={[{ required: request_item }]}
                />
                <ProFormText
                  name={'header'}
                  label="服务请求头"
                  width={width_form_item}
                  hidden
                />
                <ProFormSelect
                  name={'paramType'}
                  label="参数类型"
                  width={width_form_item}
                  options={[
                    {
                      label: 'none',
                      value: '0',
                    },
                    {
                      label: 'form-data',
                      value: '1',
                    },
                    {
                      label: 'application/json',
                      value: '2',
                    },
                    {
                      label: 'x-www-form-urlencoded',
                      value: '3',
                    },
                  ]}
                  rules={[{ required: request_item }]}
                />
                <ProFormTextArea
                  name={'param'}
                  label="服务请求参数"
                  width={width_form_item}
                  addonAfter={
                    <Tooltip title={'格式化编辑'} placement="top">
                      <a
                        onClick={() => {
                          // ts 字符串转数组
                          let temp = JSON.parse(
                            formRef.current?.getFieldValue('param') ||
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
                <ProFormRadio.Group
                  name={'fenye'}
                  label="同步结果是否分页"
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
                // fieldProps={{
                //   onChange: (e) => {
                //     // console.log(e?.target?.value)
                //     let temp = JSON.parse(
                //       formRef.current?.getFieldValue('param') || '{}',
                //     );

                //     if (e?.target?.value === '1') {
                //       // openNotification('topLeft');//通知
                //       temp = {
                //         ...temp,
                //         pageNum: 1, //页码
                //         pageSize: 5, //每页个数
                //       };
                //     } else {
                //       // 删除pagenum和size
                //       temp.pageNum = undefined;
                //       temp.pageSize = undefined;
                //       console.log(temp);
                //     }
                //     formRef.current?.setFieldsValue({
                //       param: JSON.stringify(temp),
                //     });
                //   },
                // }}
                />
                <ProFormDependency name={['fenye']}>
                  {({ fenye }) => {
                    if (fenye === '1') {
                      return (
                        <ProFormGroup style={{ marginLeft: '13%' }}>
                          <ProFormText name={'pageNumName'} initialValue={"pageNum"} label={'页数'} />
                          <ProFormText name={'pageNum'} />
                          <ProFormText name={'pageSizeName'} initialValue={"pageSize"} label={'每页条数'} />
                          <ProFormText name={'pageSize'} />
                        </ProFormGroup>
                      )
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
                {...formItemLayout}
                layout={'horizontal'}
                readonly={readonlyfrom}
              >
                <ProFormText
                  name={'dataPath'}
                  label="数据所在路径"
                  width={width_form_item}
                  placeholder={'例如: data.data '}
                  rules={[{ required: request_item }]}
                />
                <ProFormSelect
                  name={'dataColumn'}
                  label="输入字段名"
                  width={width_form_item}
                  options={testResColumn}
                  fieldProps={{
                    mode: 'multiple',
                  }}
                  rules={[{ required: request_item }]}
                />
                <ProFormSelect
                  name={'sourceId'}
                  label="输出数据源"
                  width={width_form_item}
                  request={async () => await getDatasourceList()}
                  rules={[{ required: request_item }]}
                  fieldProps={{
                    onChange: async (e, option: any) => {
                      // 改变时赋值数据表名
                      step2FormRef.current?.setFieldsValue({
                        tableName: null,
                        column: [],
                      });
                    }
                  }}
                />
                <ProFormSelect
                  name={'tableName'}
                  label="输出表"
                  width={'md'}
                  dependencies={['sourceId']}
                  rules={[{ required: request_item }]}
                  request={async (params) => {
                    if (params.sourceId) return await getDatabaseTableName(params.sourceId);
                  }}
                  addonAfter={<a onClick={() => {
                    formRefModal.current?.resetFields();
                    setIsModalOpen(true)
                  }}>一键建表</a>}
                  fieldProps={{
                    onChange: async (e, option: any) => {
                      let data = step2FormRef.current?.getFieldsValue();
                      let table = await getTableColumn({ id: data.sourceId, tableName: e });
                      // 改变时赋值数据表名
                      let names = (table || []).map((e) => {
                        return {
                          value: e.colName,
                          label: e.colName,
                        }
                      });
                      setColumn(names)
                      step2FormRef.current?.setFieldsValue({
                        column: names,
                      });
                    }
                  }}
                />
                <ProFormSelect
                  name={'column'}
                  label="输出字段"
                  width={width_form_item}
                  fieldProps={{
                    mode: 'multiple',
                  }}
                  options={column}
                  rules={[{ required: request_item }]}
                />
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
                <code>{JSON.stringify(testRes, null, 4)}</code>
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
                  formRef.current?.setFieldsValue({ param: JSON.stringify(obj) });
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
      <Modal
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        width={600}
        footer={[]}
      >
        <ProForm
          formRef={formRefModal}
          onFinish={async (values: any) => {
            ddlTableSql({
              sql: values?.sql,
              targetSourceId: values?.targetSourceId
            }).then(async (res) => {
              if (res === 200) {
                await waitTime(500);
                message.success("建表成功");
                setIsModalOpen(false);
              }
            })
          }}
          initialValues={{
            columnNames: testResColumn,
          }}>
          <ProFormSelect
            name={'columnNames'}
            label="字段名列表"
            width={width_form_item}
            options={testResColumn}
            fieldProps={{
              mode: 'multiple',
            }}
            rules={[{ required: request_item }]}
          />
          <ProFormText
            name={'tableName'}
            label="表名"
            width={width_form_item}
            placeholder={''}
            rules={[{ required: request_item }]}
          />
          <ProFormTextArea
            name={'sql'}
            label="建表语句"
            width={width_form_item}
            rules={[{ required: request_item }]}
            addonAfter={<a onClick={() => {
              let { columnNames, tableName } = formRefModal.current?.getFieldsValue();
              createTableSql({
                columnNames: columnNames?.map((e) => e.value),
                tableName: tableName
              }).then((res) => {
                formRefModal.current?.setFieldsValue({
                  sql: res,
                })
              })
            }}>获取建表语句</a>}
          />
          <ProFormSelect
            name={'targetSourceId'}
            label="数据源"
            width={width_form_item}
            request={async () => await getDatasourceList()}
            rules={[{ required: request_item }]}
          />
        </ProForm>
      </Modal>
    </PageContainer >
  );
};
