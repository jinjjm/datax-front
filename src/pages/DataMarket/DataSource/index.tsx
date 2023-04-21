import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Button, Card, Divider, Drawer, Input, List, Popconfirm, Space, Tag, Tooltip, message } from 'antd';
import { PlusOutlined, RedoOutlined } from '@ant-design/icons';
import { CheckCard, PageContainer, ProForm, ProFormDependency, ProFormDigit, ProFormInstance, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { MyIcon, mysqlIcon, oracleIcon, sqlserverIcon } from '@/services/utils/icon';
import { addSources, deleteDataSource, getSourcesPages, testConnectivityApi, testSync, updateDataSource } from '@/services/ant-design-pro/datax';


// 数据源图标索引列表
let databaseIcon = [
    "",
    mysqlIcon,//1-mysql
    "",
    oracleIcon,//3-oracle
    oracleIcon,//4-oracle
    "",
    sqlserverIcon,// 6-SQLServer2008及以下数据库   
    sqlserverIcon,//7-SQLServer2012+数据库 
];
// xs, sm, md, lg, xl,
const width_form_item = 'xl';

/**
 * 待做：1、分页查询，查询功能
 */
export default () => {
    const [open, setOpen] = useState(false); // 左侧抽屉表单打开控制
    const modalFormRef = useRef<ProFormInstance<any>>(); // 表单属性
    const [drawerTitle, setDrawerTitle] = useState(""); // 新增-编辑的title
    const [cardData, setCardData] = useState<any>([]); // 数据源卡片数据 
    const [pageSize, setPageSize] = useState(8); // 初始每页8个
    const [pageNum, setPageNum] = useState(1); // 初始第1页
    const [isCon, setIsCon] = useState(0); // 数据源联通性状态


    // 同步元数据
    const syncData = (id: any) => {
        testSync(id).then((res) => {
            if (res?.data === true) {
                message.success("元数据同步成功");
                // 同步后重新分页请求数据源卡片
                getSourcesPages({ pageSize, pageNum }).then((res) => {
                    setCardData([{}, ...res?.data]);
                })
            }
            else
                message.error("元数据同步失败")
        })
    };
    // 编辑源数据
    const editData = (item: any) => {
        setIsCon(item?.isCon);
        modalFormRef?.current?.setFieldsValue({ ...item });
        setDrawerTitle("编辑数据源");
        setOpen(true);
    }
    // 删除源数据卡片
    const deleteData = (id: any) => {
        deleteDataSource(id).then((res: any) => {
            if (res?.data === true) {
                message.success("删除成功");
                // 删除后重新分页请求数据源卡片
                getSourcesPages({ pageSize, pageNum }).then((res) => {
                    setCardData([{}, ...res?.data]);
                })
            }
            else
                message.error("删除失败")
        })
    }
    // 子卡片
    const listItem = (item: any) => {
        if (item && item.id) {
            return (
                <List.Item key={item.id} >
                    <Card
                        key={item.id}
                        hoverable
                        actions={[
                            <a key="option2" onClick={() => syncData(item?.id)}>元数据同步</a>,
                            <a key="option1" onClick={() => editData(item)}>编辑</a>,
                            <a key="option1" >
                                <Popconfirm title="请再次确认删除" onConfirm={() => deleteData(item?.id)}>
                                    删除
                                </Popconfirm>
                            </a>,
                        ]}
                    >
                        <CheckCard
                            key={item.id}
                            bordered={false} //取消边框
                            checked={false} //不会被选中
                            avatar={
                                <Avatar
                                    size={100}
                                    src={databaseIcon[item?.dbType]}
                                />
                            }
                            title={<h3><a>{item.sourceName}</a></h3>}
                            description={[
                                <a>数据库：{item?.dbSchema?.dbName}</a>,
                                <div>描述：{item?.sourceDes}</div>
                            ]}
                            extra={
                                <Space>
                                    {item?.isCon === '1' ? <Tooltip placement="top" title="连通性状态检查通过"><MyIcon type='icon-tongguo' style={{ fontSize: '160%' }} /></Tooltip>
                                        : <Tooltip placement="top" title="连通性状态未检查"><MyIcon type='icon-group43' style={{ fontSize: '130%' }} /></Tooltip>}
                                    {/* <Popconfirm title="请再次确认删除" onConfirm={() => deleteData(item?.id)}>
                                        <Tooltip placement="top" title="删除">
                                            <CloseCircleOutlined />
                                        </Tooltip>
                                    </Popconfirm> */}
                                </Space>
                            }
                            style={{ width: '112%', marginLeft: '-6%', marginTop: '-7%', height: '53%', marginBottom: '-8%' }}
                        />
                        <Divider />
                        <h3 style={{ marginTop: '-3%' }}><a>● 数据表</a></h3>
                        <div>表__个&nbsp;&nbsp;&nbsp;&nbsp;视图__个</div>
                        <h3><a>● 同步情况</a></h3>
                        {/* 0-未同步 1-正在同步 2-已同步 */}
                        {item?.isSync === "2" ? <Tag color='#4DBE30'>已同步</Tag>
                            : item?.isSync === "1" ? <Tag color='#FF9900'>正在同步</Tag>
                                : item?.isSync === "0" ? <Tag color='#EE0030'>未同步</Tag>
                                    : null}
                    </Card>
                </List.Item>
            );
        }
        return (
            <List.Item id='new'>
                <Button type="dashed" style={{ width: "100%", height: "365px" }}
                    onClick={() => {
                        modalFormRef?.current?.resetFields();
                        setDrawerTitle("新建数据源");
                        setIsCon(0);
                        setOpen(true)
                    }}>
                    <h3><a><PlusOutlined /> 新增数据源</a> </h3>
                </Button>
            </List.Item>
        );
    }
    // 测试连通性
    const testConnectivity = async () => {
        let values = modalFormRef?.current?.getFieldsValue();
        const resCode = testConnectivityApi(values);
        if (await resCode === 200) {
            message.success("连通性测试成功");
            setIsCon(1);
        } else {
            message.error("连通性测试失败");
        }
    }
    //进入页面，调用分页查询数据源接口
    useEffect(() => {
        // 在返回结果头部添加空对象，作为新增数据源的card
        getSourcesPages({ pageSize, pageNum }).then((res) => {
            setCardData([{}, ...res?.data]);
        })
    }, [])
    return (
        <PageContainer
            header={{ ghost: false, }}
            content={<Space>
                <Input.Search size={"middle"} placeholder="数据源查询" enterButton />
                {/* <Button key={"new"} type='primary' icon={<PlusOutlined />}>新建</Button> */}
                <Button key={"flash"} type='link' icon={<RedoOutlined />}
                    onClick={() => getSourcesPages({ pageSize, pageNum })
                        .then((res) => {
                            setCardData([{}, ...res?.data]);
                        })}
                >刷新</Button>
            </Space>}
        >
            <List
                rowKey="id"
                grid={{ gutter: 16, column: 4 }}
                dataSource={cardData || []}
                renderItem={(item) => listItem(item)}
                pagination={{ position: "bottom", align: "end", pageSize: 8 }}
            >
            </List>
            <Drawer
                title={drawerTitle}
                width={500}
                open={open}
                onClose={() => setOpen(false)}
                forceRender={true}
            >
                <ProForm
                    formRef={modalFormRef}
                    name="createNewDataSource"
                    onFinish={async (values) => {
                        // 带有id则为修改接口，不带则为添加接口
                        // { ...values, isCon: isCon } 联通性标志位是单独测试的，需要单独处理赋值
                        if (values?.id) {
                            updateDataSource({ id: values?.id, params: values }).then((res) => {
                                if (res?.data === true) {
                                    message.success("更新成功");
                                    setOpen(false);
                                    // 新增--编辑 后重新分页请求数据源卡片
                                    getSourcesPages({ pageSize, pageNum }).then((res) => {
                                        setCardData([{}, ...res?.data]);
                                    })
                                } else {
                                    message.error("更新失败");
                                }
                            });
                        } else {
                            addSources({ ...values, isCon: isCon }).then((res) => {
                                if (res?.data === true) {
                                    message.success("添加成功");
                                    setOpen(false);
                                    // 新增--编辑 后重新分页请求数据源卡片
                                    getSourcesPages({ pageSize, pageNum }).then((res) => {
                                        setCardData([{}, ...res?.data]);
                                    })
                                } else {
                                    message.error("添加失败");
                                }
                            });
                        }

                    }}
                    layout="vertical"
                    submitter={{
                        render: (props, doms) => {
                            return [
                                <Button type='primary' key="testConnectivity" onClick={testConnectivity}>
                                    测试连通性
                                </Button>,
                                // 确认新建
                                <Button type='primary' htmlType='button' key="yes" onClick={() => props.form?.submit()}>
                                    确认
                                </Button>,
                            ];
                        },
                    }}

                >
                    <ProFormText name={"isCon"} hidden />
                    <ProFormText name={"id"} hidden />
                    <ProFormSelect
                        name={"dbType"}
                        label="数据源类型"
                        valueEnum={{
                            1: 'MySQL数据库',
                            3: 'Oracle11g及以下数据库',
                            4: 'Oracle12c+数据库',
                            6: 'SQLServer2008及以下数据库',
                            7: 'SQLServer2012+数据库',
                        }}
                        width={width_form_item}
                        rules={[{ required: true, message: '这是必填项' }]}
                    />
                    <ProFormText
                        width={width_form_item}
                        name="sourceName"
                        required
                        label="数据源名称"
                        rules={[{ required: true, message: '这是必填项' }]}
                    />
                    {/*  */}
                    <ProFormText
                        width={width_form_item}
                        name="sourceDes"
                        label="数据描述"
                    />
                    <ProFormText
                        width={width_form_item}
                        required
                        label="主机"
                        name={["dbSchema", "host"]}
                        rules={[{ required: true, message: '这是必填项' }]}
                    />
                    <ProFormDigit
                        width={width_form_item}
                        label="端口号"
                        name={["dbSchema", "port"]}
                        min={0}
                        required
                        rules={[{ required: true, message: '这是必填项' }]}
                    />
                    <ProFormText
                        width={width_form_item}
                        name={["dbSchema", "dbName"]}
                        required
                        label="数据库"
                        rules={[{ required: true, message: '这是必填项' }]}
                    />
                    <ProFormDependency name={['dbType']}>
                        {({ dbType }) => {
                            if (dbType === "3" || dbType === "4") {
                                return (
                                    <ProFormText
                                        width={width_form_item}
                                        name={["dbSchema", "sid"]}
                                        required
                                        label="服务名"
                                    />)
                            }
                        }}
                    </ProFormDependency>
                    <ProFormText
                        width={width_form_item}
                        name={["dbSchema", "username"]}
                        required
                        label="用户名"
                        rules={[{ required: true, message: '这是必填项' }]}
                    />
                    <ProFormText.Password
                        width={width_form_item}
                        name={["dbSchema", "password"]}
                        required
                        label="密码"
                        rules={[{ required: true, message: '这是必填项' }]}
                    />

                </ProForm>
            </Drawer>
        </PageContainer >

    );
}
