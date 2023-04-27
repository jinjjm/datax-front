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
} from '@ant-design/pro-components';
import { Breadcrumb, Button, message, Space, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';

import { history } from 'umi';
import { getApiTrees2 } from '@/services/ant-design-pro/datax';
import { MyIcon } from '@/services/utils/icon';
import { FileSearchOutlined, SaveOutlined } from '@ant-design/icons';
import { TitleAdapter, handleTreeData } from '../../DataService/services/Handle';
import { addService, getServiceDetails, updateService } from '../api';
import '../index.css'

const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 19 },
};
// xs, sm, md, lg, xl,
const width_form_item = 'lg'; // 大小
// true false
const request_item = true; // 是否必填项

export default () => {
    const formRef = useRef<ProFormInstance>(); // 详情表单ref
    const formListRef = useRef<ProFormInstance>(); // 格式化参数表单ref
    const [serviceTemp, setServiceTemp] = useState(''); // 新建、详情页面的标识
    const [readonlyfrom, setReadonlyfrom] = useState<Boolean>(true); // 是否为仅可读表单
    const [serviceType, setServiceType] = useState(''); //''--关闭、'1'--格式化参数表开启、'2'--soap

    useEffect(() => {
        const serviceTempId = history.location.pathname.replace(
            '/datamarket/data-integration/service-details/',
            '',
        );
        setServiceTemp(serviceTempId)

        if (localStorage.getItem('service_id') === '') history.back();
        formRef.current?.resetFields();// 清空表单
        if (serviceTempId === 'new') {
            setReadonlyfrom(false);
        } else {
            // setReadonlyfrom(true);
            getServiceDetails(serviceTempId).then((res) => {
                // res:{data,header}
                formRef.current?.setFieldsValue({ ...res?.data });
            })

        }
    }, [localStorage.getItem('service_id')]);

    const onSelect = (keys: React.Key[], info: any) => {
        // console.log('keys ', keys);
        // console.log('info: ', info);
    };
    return (
        <PageContainer title=" "
            header={{
                breadcrumb: (
                    <Breadcrumb>
                        <Breadcrumb.Item>数据源</Breadcrumb.Item>
                        <Breadcrumb.Item>服务集成</Breadcrumb.Item>
                        <Breadcrumb.Item>
                            {TitleAdapter(serviceTemp)}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                ),
            }}
        >
            <ProCard
                title={'服务集成' + (serviceTemp === 'new' ? '新增' : '详情')}
                headerBordered
                extra={
                    <Space>
                        {
                            serviceTemp === 'new' ?
                                <Button
                                    type="primary"
                                    icon={<SaveOutlined />}
                                    onClick={() => formRef.current?.submit()}
                                > 提交 </Button>
                                : <>
                                    <Button
                                        type="primary"
                                        icon={<MyIcon type="icon-jiekourizhi" />}
                                        onClick={() => setReadonlyfrom(false)}
                                    > 编辑 </Button>
                                    <Button
                                        type="primary"
                                        icon={<SaveOutlined />}
                                        onClick={() => formRef.current?.submit()}
                                    > 保存 </Button>
                                </>
                        }
                        <Button type="dashed" icon={<MyIcon type="icon-fanhui" />} onClick={() => history.back()}>
                            返回
                        </Button>
                    </Space>
                }
            >
                <ProCard split="vertical">
                    <ProCard colSpan="50%">
                        <ProForm
                            formRef={formRef}
                            readonly={readonlyfrom}
                            {...formItemLayout}
                            layout={'horizontal'}
                            name="fuwu"
                            submitter={false}
                            onFinish={async (values) => {
                                console.log(values);
                                let params = {
                                    httpService: null,
                                    webService: null,
                                    ...values,
                                }
                                if (serviceTemp === 'new') {
                                    addService(params).then((res) => {
                                        if (res.data?.id) {
                                            message.success("新建成功");
                                            waitTime(500);
                                            history.back();
                                        } else message.error("新建失败");
                                    })
                                } else {
                                    updateService(params).then((res) => {
                                        console.log(res)
                                        if (res.code === 200) {
                                            message.success("更新成功");
                                            waitTime(500);
                                            history.back();
                                        } else message.error("更新失败");
                                    })
                                }
                                await waitTime(500);
                                return true;
                            }}
                        >
                            <ProFormText
                                name={'serviceName'}
                                label="服务名称"
                                width={width_form_item}
                                rules={[{ required: request_item }]}
                            />
                            <ProFormText name={'id'} hidden />
                            <ProFormTreeSelect
                                name={'serviceGroup'}
                                label="服务分组"
                                allowClear
                                width={width_form_item}
                                request={async () => await getApiTrees2().then((res) => handleTreeData(res, false))}
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
                            <ProFormSelect
                                name={'serviceType'}
                                label="服务类型"
                                width={width_form_item}
                                rules={[{ required: request_item }]}
                                valueEnum={{
                                    1: 'http接口',
                                    2: 'webservice接口',
                                }}
                                fieldProps={{
                                    onChange: () => setServiceType('')
                                }}
                            />
                            <ProFormDependency name={['serviceType']}>
                                {({ serviceType }) => {
                                    if (serviceType === "2") {
                                        return <>
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
                                                    autoSize: { minRows: 6, maxRows: 6 }
                                                }}
                                                addonAfter={<Tooltip title="右侧查看" placement='top'>
                                                    <a onClick={
                                                        () => setServiceType(formRef.current?.getFieldValue("serviceType"))
                                                    }><FileSearchOutlined /></a>
                                                </Tooltip>
                                                }
                                            />
                                            <ProFormText
                                                name={['webService', 'method']}
                                                label="请求方式"
                                                width={width_form_item}
                                            />
                                        </>
                                    }
                                    else {
                                        return <>
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
                                            />
                                            <ProFormTextArea
                                                name={['httpService', 'param']}
                                                label="服务请求参数"
                                                width={width_form_item}
                                                // disabled
                                                addonAfter={<Tooltip title={"格式化编辑"} placement="top">
                                                    <a onClick={
                                                        () => {
                                                            // ts 字符串转数组
                                                            let temp = JSON.parse(formRef.current?.getFieldValue(["httpService", "param"]) || "{}");
                                                            let list: { value: string; label: any; type: string }[] = []
                                                            Object.keys(temp).forEach(function (key: string) {
                                                                list.push({
                                                                    label: key,
                                                                    value: temp[key],
                                                                    type: typeof temp[key],
                                                                });
                                                            })
                                                            formListRef.current?.setFieldsValue({ serviceList: list })
                                                            setServiceType(formRef.current?.getFieldValue("serviceType"))
                                                        }
                                                    }><FileSearchOutlined /></a>
                                                </Tooltip>}
                                            />
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
                                        </>
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
                                    }
                                ]}
                                rules={[{ required: request_item }]}
                                width={width_form_item}
                            />
                        </ProForm>
                    </ProCard>
                    <ProCard colSpan="50%"
                        style={{
                            height: 560,
                            overflow: 'auto',
                            padding: '0 16px',
                        }}
                        title={serviceType === '' ? '' : serviceType === '1' ? "服务请求参数格式化" : "SOAP内容"}
                        extra={serviceType === '' ? null : <Space>
                            <Button
                                type='primary'
                                onClick={() => formListRef.current?.submit()}
                            >存入表单</Button>
                            <Button onClick={() => setServiceType('')}>关闭</Button>
                        </Space>}>
                        <ProForm
                            formRef={formListRef}
                            hidden={serviceType === '' ? true : false}
                            layout={'vertical'}
                            onFinish={async (values) => {
                                let obj: any = {};
                                (values?.serviceList || []).forEach((item: any) => {
                                    obj[item?.label] = item?.value;
                                })
                                formRef.current?.setFieldsValue({ httpService: { param: JSON.stringify(obj) } });
                                return true;
                            }}
                            // {"wordKey":"我","dsfs":"算法上的","hah":true,"asdq":1212}
                            submitter={false} >
                            {
                                serviceType === "1" ?
                                    <ProFormList
                                        name="serviceList"
                                        initialValue={[{
                                            value: "",
                                            label: "",
                                        }]}
                                    >
                                        <ProFormGroup key="service-group" >
                                            <ProFormText name="label" label="名称: " width={140} />
                                            <ProFormText name="value" label="值: " width={140} />
                                            <ProFormSelect name="type" label="类型: "
                                                valueEnum={{
                                                    string: '字符串型',
                                                    number: '数值型',
                                                    boolean: '布尔型',
                                                }}
                                                width={170} />
                                        </ProFormGroup>
                                    </ProFormList>
                                    : <ProFormTextArea
                                        name={'soap'}
                                        fieldProps={{
                                            autoSize: { minRows: 20, maxRows: 20 }
                                        }}
                                    />
                            }
                        </ProForm>
                    </ProCard>
                </ProCard>
            </ProCard >

        </PageContainer>
    );
};
