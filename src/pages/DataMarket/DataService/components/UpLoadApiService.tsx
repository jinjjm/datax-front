import {
    ModalForm,
    PageContainer,
    ProCard,
    ProForm,
    ProFormDependency,
    ProFormDigit,
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
import { Breadcrumb, Button, Col, Divider, message, Modal, notification, Row, Space, Tag, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { history as hhhistory } from '@umijs/max';

import { addDataApis, getApiDetails, getApiTrees1, getApiTrees2, getDatabaseTableName, getDatasourceList, getTableColumn, updateDataApis } from '@/services/ant-design-pro/datax';
import { MyIcon } from '@/services/utils/icon';
import { FileSearchOutlined, SaveOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { handleTreeData } from '../services/Handle';

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
    const step1FormRef = useRef<ProFormInstance<any>>();
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
        formRef.current?.resetFields(); // 清空表单
        const serviceTempId = history.location.pathname.replace(
            '/datamarket/data-service/',
            '',
        );
        setServiceTemp(serviceTempId);
        let id = localStorage.getItem('api_id');
        if (id === null) {
            hhhistory.push('/user/login')
            message.warning('请重新登录')
        }
        else {
            getApiDetails(id).then((response) => {
                formRef.current?.setFieldsValue(response);
                step2FormRef.current?.setFieldsValue({
                    httpMethod: response?.httpParams?.httpMethod,
                    url: response?.httpParams?.url,
                    param: response?.httpParams?.param,
                    paramType: response?.httpParams?.paramType,
                    header: response?.httpParams?.header
                })
            });
        }


    }, [localStorage.getItem('api_id')]);

    const onSelect = (keys: React.Key[], info: any) => {
        console.log('keys ', keys);
        console.log('info: ', info);
    };

    const rightCardTitle = () => {
        if (serviceType === '1') {
            return '服务请求参数格式化';
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
    };

    return (
        <PageContainer
            title=" "
            header={{
                breadcrumb: (
                    <Breadcrumb>
                        <Breadcrumb.Item>数据服务</Breadcrumb.Item>
                        <Breadcrumb.Item>服务管理</Breadcrumb.Item>
                        <Breadcrumb.Item>导入</Breadcrumb.Item>
                    </Breadcrumb>
                ),
            }}
        >
            {contextHolder}
            <ProCard
                title={'导入'}
                headerBordered
                extra={<Space>
                    <Button
                        type="dashed"
                        icon={<MyIcon type="icon-fanhui" />}
                        onClick={() => {
                            hhhistory.push('/datamarket/data-service');
                            localStorage.clear()//清除localstorage存储的变量
                        }}
                    >
                        返回
                    </Button>
                </Space>}
            >
                <ProCard split="vertical">
                    <ProCard colSpan="50%">
                        <StepsForm
                            formRef={formRef}
                            onFinish={async (values: any) => {
                                console.log(values);
                                let params = {
                                    ...values,
                                    httpParams: {
                                        httpMethod: values?.httpMethod,
                                        url: values?.url,
                                        param: values?.param,
                                        paramType: values?.paramType,
                                        header: values?.header,
                                    },
                                    apiUrl: values?.url,
                                    reqMethod: values?.httpMethod,
                                    resType: 'JSON',//不用但需传参
                                    param: undefined,
                                    httpMethod: undefined,
                                    paramType: undefined,
                                    url: undefined,
                                    header: undefined,
                                }
                                if (localStorage.getItem("api_id") === 'daoru') {//新建
                                    // 导入api
                                    addDataApis(params).then((res: any) => {
                                        if (res?.code === 200) {
                                            message.success("导入成功");
                                            history.back();
                                        } else message.error("导入失败");
                                    })
                                } else {//更新
                                    updateDataApis(params).then((res: any) => {
                                        if (res.code === 200) {
                                            message.success("更新成功");
                                            history.back();
                                        } else message.error("更新失败");
                                    })
                                }
                                await waitTime(500);
                            }}
                        >
                            <StepsForm.StepForm
                                name={'step1'}
                                formRef={step1FormRef}
                                readonly={readonlyfrom}
                                {...formItemLayout}
                                layout={'horizontal'}
                                title="属性配置"
                                onFinish={async (values) => {
                                    await waitTime(500);
                                    return true;
                                }}
                                initialValues={{
                                    apiType: '1',
                                    // allow_or_deny: 'hei',
                                    rateLimit: {
                                        enable: '0'
                                    },
                                    status: '1',
                                    apiVersion: 'v1.0.0'
                                }}
                            >
                                <ProFormSelect
                                    name={'apiType'}
                                    label="API类型"
                                    width={width_form_item}
                                    valueEnum={{
                                        0: '系统生成型',
                                        1: '第三方接入型',
                                    }}
                                    disabled
                                    rules={[{ required: request_item }]}
                                />
                                <ProFormText
                                    name={'apiName'}
                                    label="API名称"
                                    width={width_form_item}
                                    placeholder="请输入名称"
                                    rules={[{ required: request_item }]}
                                />
                                <ProFormText name={'id'} hidden />
                                <ProFormTextArea name={'apiDesc'} label="API描述" width={width_form_item} />
                                <ProFormTreeSelect
                                    name={'apiGroup'}
                                    placeholder="选择API分组"
                                    label="API分组"
                                    allowClear
                                    width={width_form_item}
                                    request={async () => await getApiTrees1().then((res) => handleTreeData(res, false))}
                                    fieldProps={{
                                        filterTreeNode: true,
                                        showSearch: true,
                                        autoClearSearchValue: true,
                                        treeNodeFilterProp: 'menuName',
                                        fieldNames: {
                                            label: "menuName",
                                            value: "id",
                                            children: "childrenMenu",
                                        },
                                        onSelect: onSelect,
                                    }}
                                    rules={[{ required: request_item }]}
                                />
                                <ProFormText
                                    name={'apiVersion'}
                                    label="API版本"
                                    width={width_form_item}
                                    rules={[{ required: request_item }]}
                                />
                                <ProFormSelect
                                    name={'reqMethod'}
                                    label="请求方式"
                                    width={width_form_item}
                                    valueEnum={{
                                        GET: 'GET',
                                        POST: 'POST',
                                        DELETE: 'DELETE',
                                        PUT: 'PUT',
                                    }}
                                    hidden
                                />
                                <ProFormSelect
                                    name={'resType'}
                                    label="返回格式"
                                    valueEnum={{
                                        JSON: 'JSON',
                                        OBJECT: 'OBJECT',
                                    }}
                                    width={width_form_item}
                                    hidden
                                />
                                <ProFormRadio.Group
                                    name={'allow_or_deny'}
                                    label="限制条件"
                                    width={width_form_item}
                                    options={[
                                        {
                                            label: '黑名单',
                                            value: 'hei',
                                        },
                                        {
                                            label: '白名单',
                                            value: 'bai',
                                        },
                                    ]}
                                />
                                <ProFormDependency name={['allow_or_deny']}>
                                    {({ allow_or_deny }) => {
                                        if (allow_or_deny === 'hei')
                                            return (
                                                <ProFormTextArea
                                                    name={'deny'}
                                                    label="IP黑名单"
                                                    width={width_form_item}
                                                    tooltip="请使用英文逗号做分割"
                                                />
                                            )
                                        else if (allow_or_deny === 'bai')
                                            return (
                                                <ProFormTextArea
                                                    name={'allow'}
                                                    label="IP白名单"
                                                    width={width_form_item}
                                                    tooltip="请使用英文逗号做分割"
                                                />
                                            )
                                        else return null;
                                    }}
                                </ProFormDependency>
                                <ProFormRadio.Group
                                    name={['rateLimit', 'enable']}
                                    label="是否限流"
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
                                />
                                <Row>
                                    <Col offset={3}>
                                        <ProFormDependency name={['rateLimit', 'enable']}>
                                            {({ rateLimit }) => {
                                                if (rateLimit?.enable === '1') {
                                                    return (
                                                        <Row>
                                                            在&nbsp;&nbsp;
                                                            <ProFormDigit
                                                                width={'xs'}
                                                                name={['rateLimit', 'seconds']}
                                                                min={0}
                                                            />
                                                            分钟内请求次数，最大&nbsp;&nbsp;
                                                            <ProFormDigit
                                                                width={'xs'}
                                                                name={['rateLimit', 'times']}
                                                                min={0}
                                                            />
                                                            次
                                                        </Row>
                                                    );
                                                }
                                            }}
                                        </ProFormDependency>
                                    </Col>
                                </Row>
                                <ProFormRadio.Group
                                    name={'status'}
                                    label="状态"
                                    width={width_form_item}
                                    options={[
                                        {
                                            label: '待发布',
                                            value: '1',
                                        },
                                        {
                                            label: '已发布',
                                            value: '2',
                                        },
                                        {
                                            label: '已下线',
                                            value: '3',
                                        },
                                    ]}
                                />
                            </StepsForm.StepForm>
                            <StepsForm.StepForm
                                name="step2"
                                title="接口服务"
                                onFinish={async () => {
                                    await waitTime(500);
                                    return true;
                                }}
                                formRef={step2FormRef}
                                readonly={readonlyfrom}
                                {...formItemLayout}
                                layout={'horizontal'}
                                initialValues={{
                                    // url: 'http://10.1.40.85:7778/sources/queryList',
                                    // httpMethod: 'POST',
                                    // paramType: '2',
                                    // param: "{\"dataSourceId\": \"1377933635223552\",\"offset\": 0,\"pageNum\": 1,\"pageSize\": 2,\"sql\": \"select * from data_governance.metadata_source\"}"
                                    // {"datasourceId":"1377933635223552 ","offset": 0, "pagelum": 1, "pagesize": 2,"sgl": "select *from data_governance.metadata_source"}
                                }}
                            >
                                <ProFormSelect
                                    name={'httpMethod'}
                                    label="请求方式"
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
                                    label="请求地址"
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
                                    name={'header'}
                                    label="请求头"
                                    width={width_form_item}
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
                                                    setServiceType('1');
                                                    setTestResType(false);
                                                }}
                                            >
                                                <FileSearchOutlined />
                                            </a>
                                        </Tooltip>
                                    }
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
                    >

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
                            </ProForm>
                        )}
                    </ProCard>
                </ProCard>
            </ProCard>
        </PageContainer >
    );
};
