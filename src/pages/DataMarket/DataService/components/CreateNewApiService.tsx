import {
  EditableFormInstance,
  EditableProTable,
  ProCard,
  ProColumns,
  ProForm,
  ProFormDependency,
  ProFormDigit,
  ProFormInstance,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
  StepsForm,
} from '@ant-design/pro-components';
import { history as hhhistory } from '@umijs/max';
import { Button, Checkbox, Col, message, Modal, Row, Space, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';

import { addDataApis, downloadApiDoc, getApiDetails, getApiTrees1, getDatabaseTableName, getDatasourceList, getTableColumn, updateDataApis } from '@/services/ant-design-pro/datax';
import { MyIcon } from '@/services/utils/icon';
import { PlusCircleOutlined } from '@ant-design/icons';
import { handleAPIDetials, handleTransforString, handleTreeData } from '../services/Handle';
import { nanoid } from 'nanoid';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
// xs, sm, md, lg, xl,
const width_form_item = 'xl';
// true false
const request_item = true;
const item_readonly = true;
/**
 * 问题：解决---1、每个下拉框确认
 * 删除--2、table新添加数据后，如果不想要无法删除，无法取消
 * 解决--3、删除操作有问题
 * 4、请求拦截器的使用requestInterceptors
 * 解决--5 在默认可编辑状态下无法自动保存
 * 解决6、步骤二和步骤三的联动性，根据步骤二所选的请求、返回参数来确认步骤三的表格问题
 * 完成7、最后的表单提交接口未完成
 */
export default () => {
  const formRef = useRef<React.MutableRefObject<ProFormInstance<any> | undefined>[]>([]);
  const modalFormRef = useRef<ProFormInstance<any>>();
  // 不能只用一个formRef
  const step2FormRef = useRef<ProFormInstance<any>>();
  const step3FormRef = useRef<ProFormInstance<any>>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [editableKeys_req, setEditableRowKeys_req] = useState<React.Key[]>([]);
  const [editableKeys_res, setEditableRowKeys_res] = useState<React.Key[]>([]);
  // const [item_readonly, setItem_readonly] = useState(false);
  // const [item_readonly_params, setItem_readonly_params] = useState(false);
  const editableFormRef = useRef<EditableFormInstance>();
  // const editableFormRefreq = useRef<EditableFormInstance>();
  const editableFormRefres = useRef<EditableFormInstance>();
  const [tableData, setTableData] = useState([]);
  const [tableData_req, setTableData_req] = useState<any>([]);
  const [tableData_res, setTableData_res] = useState([]);
  const [tuominModal, settuominModal] = useState(false);

  let readonlyfrom = localStorage.getItem('api_edit_status') === 'false' ? true : false;

  // col_id 可编辑表格的key，唯一标识，必须要有
  const columns: ProColumns<API.APIZiDuanTableType>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      align: 'center',
      readonly: true,
      key: 'sa',
      width: '5%',
    },
    {
      title: '列名',
      key: 'columnName',
      dataIndex: 'columnName',
      align: 'center',
      readonly: item_readonly,
      width: '10%',
    },
    {
      title: '注释',
      key: 'columnComment',
      dataIndex: 'columnComment',
      align: 'center',
      readonly: item_readonly,
    },
    {
      title: '数据类型',
      key: 'dataType',
      dataIndex: 'dataType',
      align: 'center',
      readonly: item_readonly,
    },
    {
      title: '数据长度',
      key: 'dataLength',
      align: 'center',
      dataIndex: 'dataLength',
      readonly: item_readonly,
    },
    {
      title: '数据精度',
      key: 'dataPrecision',
      align: 'center',
      dataIndex: 'dataPrecision',
      readonly: item_readonly,
    },
    {
      title: '数据小数位',
      key: 'dataScale',
      dataIndex: 'dataScale',
      align: 'center',
      readonly: item_readonly,
    },
    {
      title: '是否主键',
      key: 'columnKey',
      dataIndex: 'columnKey',
      align: 'center',
      readonly: item_readonly,
      valueType: 'select',
      valueEnum: {
        1: { text: '是' },
        0: { text: '否', },
      },
    },
    {
      title: '是否允许为空',
      key: 'columnNullable',
      dataIndex: 'columnNullable',
      align: 'center',
      readonly: item_readonly,
      valueType: 'select',
      valueEnum: {
        1: { text: '是' },
        0: { text: '否', },
      },
    },
    {
      title: '列默认值',
      key: 'dataDefault',
      dataIndex: 'dataDefault',
      align: 'center',
      readonly: item_readonly,
    },
    {
      title: '是否作为请求参数',
      key: 'reqable',
      dataIndex: 'reqable',
      align: 'center',
      valueType: 'checkbox',
      valueEnum: {
        1: true,
        0: false,
      }
    },
    {
      title: '是否作为返回参数',
      key: 'resable',
      dataIndex: 'resable',
      align: 'center',
      valueType: 'checkbox',
      valueEnum: {
        1: true,
        0: false,
      },
    },
  ];
  const reqParamsColumns: ProColumns<API.reqParamsColumns>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      align: 'center',
      readonly: true,
      key: 'sha?',
      width: '5%',
    },
    {
      title: '参数名称',
      key: 'paramName',
      dataIndex: 'paramName',
      align: 'center',
      width: '15%',
    },
    {
      title: '描述',
      key: 'paramComment',
      dataIndex: 'paramComment',
      align: 'center',
      //readonly: item_readonly_params,
    },
    {
      title: '参数类型',
      key: 'paramType',
      dataIndex: 'paramType',
      align: 'center',
      // readonly: item_readonly,
      valueType: 'select',
      valueEnum: {
        1: { text: '字符串' },
        2: { text: '整数' },
        3: { text: '浮点数' },
        4: { text: '时间' },
        5: { text: '集合' },
      },
    },
    {
      title: '操作符',
      key: 'whereType',
      dataIndex: 'whereType',
      align: 'center',
      // readonly: item_readonly,
      valueType: 'select',
      valueEnum: {
        1: { text: '等于' },
        2: { text: '不等于' },
        3: { text: '模糊查询' },
        4: { text: '左模糊查询' },
        5: { text: '右模糊查询' },
        6: { text: '大于' },
        7: { text: '大于等于' },
        8: { text: '小于' },
        9: { text: '小于等于' },
        10: { text: '是否为空' },
        11: { text: '是否不为空' },
        12: { text: '包含' },
        13: { text: '不包含' },
      },
    },
    {
      title: '示例值',
      key: 'exampleValue',
      dataIndex: 'exampleValue',
      align: 'center',
      //readonly: item_readonly_params,
    },
    {
      title: '默认值',
      key: 'defaultValue',
      dataIndex: 'defaultValue',
      align: 'center',
      //readonly: item_readonly_params,
    },
    {
      title: '是否允许为空',
      key: 'nullable',
      dataIndex: 'nullable',
      align: 'center',
      // readonly: item_readonly,
      valueType: 'checkbox',
      valueEnum: {
        0: false,
        1: true,
      },
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      hideInTable: readonlyfrom,
      render: () => {
        return null;
      },
      // render: (text, record, _, action) => (
      //   <Space>
      //     <a
      //       key="editable"
      //       onClick={() => {
      //         action?.startEditable?.(record.paramName);
      //       }}
      //     >
      //       编辑
      //     </a>
      //   </Space>
      // ),
    },
  ];
  const resParamsColumns: ProColumns<API.resParamsColumns>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      align: 'center',
      readonly: true,
      key: 'sha??',
      width: '5%',
    },
    {
      key: 'col_id',
      dataIndex: 'col_id',
      hideInTable: true,
    },
    {
      title: '字段名称',
      key: 'fieldName',
      dataIndex: 'fieldName',
      align: 'center',
      //readonly: item_readonly_params,
    },
    {
      title: '描述',
      key: 'fieldComment',
      dataIndex: 'fieldComment',
      align: 'center',
      //readonly: item_readonly_params,
    },
    {
      title: '数据类型',
      key: 'dataType',
      dataIndex: 'dataType',
      align: 'center',
      //readonly: item_readonly_params,
    },
    {
      title: '示例值',
      key: 'exampleValue',
      dataIndex: 'exampleValue',
      align: 'center',
      //readonly: item_readonly_params,
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      hideInTable: readonlyfrom,
      render: () => null,
    },
  ];
  useEffect(() => {
    if (localStorage.getItem('api_id') === null) {
      hhhistory.push('/user/login')
      message.warning('请重新登录')
    };
    let id = localStorage.getItem('api_id');
    // let data;
    if (id && id !== 'new' && id !== '') {
      getApiDetails(id).then((response) => {
        let res = handleAPIDetials(response);
        formRef?.current?.forEach((formInstanceRef: any) => {
          formInstanceRef?.current?.setFieldsValue({
            shuxing: res,
            zhixing: res?.executeConfig,
            canshu: res,
          });
        });
        //设置默认可编辑表格——打开所有行
        setEditableRowKeys(() => (res?.executeConfig?.fieldParams || [])
          .map((item: { col_id: any; }) => item.col_id));
        setEditableRowKeys_req(() => (res?.reqParams || [])
          .map((item: { col_id: any; }) => item.col_id));
        setEditableRowKeys_res(() => (res?.resParams || [])
          .map((item: { col_id: any; }) => item.col_id));
        // 给每个可编辑表格赋值, 但并不能对table数据进行初始化
        // setTableData(res?.executeConfig?.fieldParams);
        // setTableData_req(res?.reqParams);
        // setTableData_res(res?.resParams);
      });
    }
  }, [localStorage.getItem('api_id'), history.state]);

  const onSelect = (keys: React.Key[], info: any) => {
    // console.log('keys ', keys);
    // console.log('info: ', info);
  };
  return (
    <ProCard
      title={'数据API详情'}
      headerBordered
      extra={
        <Space>
          <Button
            type="primary"
            icon={<MyIcon type="icon-jiekourizhi" />}
            onClick={() => {
              let api_id = localStorage.getItem('api_id');
              api_id === 'new' ? message.warning("请提交后获取接口文档。") : downloadApiDoc(localStorage.getItem('api_id'));
            }}
          >
            接口文档
          </Button>
          <Button
            type="primary"
            icon={<MyIcon type="icon-jiekou1" />}
            onClick={() => hhhistory.push('/datamarket/data-service')}
          >
            接口测试
          </Button>
          <Button type="dashed" icon={<MyIcon type="icon-fanhui" />} onClick={() => {
            hhhistory.push('/datamarket/data-service');
            localStorage.clear()//清除localstorage存储的变量
          }}>
            返回
          </Button>
        </Space>
      }
    >
      <StepsForm
        formMapRef={formRef}
        onFinish={async (values) => {
          const { shuxing, zhixing, canshu } = values;
          // 传参 
          let params = {
            apiDesc: null,
            allow: null,
            deny: null,
            ...shuxing,
            executeConfig: {
              sqlText: null,
              tableId: null,
              ...zhixing,
              fieldParams: handleTransforString(zhixing?.fieldParams, "fieldParams") || [],
            },
            reqParams: handleTransforString(canshu?.reqParams, "reqParams") || [],
            resParams: canshu?.resParams || [],
          };
          // console.log("params: ", params);
          if (params?.id) {
            // 修改
            updateDataApis(params).then((res: any) => {
              if (res.code === 200) {
                message.success("更新成功");
                history.back();
              } else message.error("更新失败");
            })
          } else {
            // 新建
            addDataApis(params).then((res: any) => {
              if (res.code === 200) {
                message.success("新建成功");
                history.back();
              } else message.error("新建失败");
            })
          }
          await waitTime(1000);
        }}
        formProps={{
          validateMessages: {
            required: '此项为必填项',
          },
        }}
        stepsProps={{
          direction: 'vertical',
        }}
      >
        <StepsForm.StepForm
          readonly={readonlyfrom}
          {...formItemLayout}
          layout={'horizontal'}
          name="shuxing"
          title="属性配置"
          onFinish={async (values) => {
            // console.log(values);
            await waitTime(500);
            return true;
          }}
          initialValues={{
            "shuxing": {
              "status": "1",
              "apiVersion": 'v1.0.0',
              "apiType": localStorage.getItem('api_id') === 'daoru' ? '1' : '0'
            },
          }}
        >
          <ProFormSelect
            name={['shuxing', 'apiType']}
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
            name={['shuxing', 'apiName']}
            label="API名称"
            width={width_form_item}
            placeholder="请输入名称"
            rules={[{ required: request_item }]}
          />
          <ProFormText name={['shuxing', 'id']} hidden />
          <ProFormTextArea name={['shuxing', 'apiDesc']} label="API描述" width={width_form_item} />
          <ProFormTreeSelect
            name={['shuxing', 'apiGroup']}
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
            name={['shuxing', 'apiVersion']}
            label="API版本"
            width={width_form_item}
            rules={[{ required: request_item }]}
          />
          <ProFormText
            name={['shuxing', 'apiUrl']}
            label="API路径"
            width={width_form_item}
            rules={[{ required: request_item }]}
          />
          <ProFormSelect
            name={['shuxing', 'reqMethod']}
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
          <ProFormSelect
            name={['shuxing', 'resType']}
            label="返回格式"
            valueEnum={{
              JSON: 'JSON',
              OBJECT: 'OBJECT',
            }}
            rules={[{ required: request_item }]}
            width={width_form_item}
          />
          <ProFormRadio.Group
            name={['shuxing', 'allow_or_deny']}
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
          <ProFormDependency name={['shuxing', 'allow_or_deny']}>
            {({ shuxing }) => {
              if (shuxing?.allow_or_deny === 'hei')
                return (
                  <ProFormTextArea
                    name={['shuxing', 'deny']}
                    label="IP黑名单"
                    width={width_form_item}
                    tooltip="请使用英文逗号做分割"
                  />
                )
              else if (shuxing?.allow_or_deny === 'bai')
                return (
                  <ProFormTextArea
                    name={['shuxing', 'allow']}
                    label="IP白名单"
                    width={width_form_item}
                    tooltip="请使用英文逗号做分割"
                  />
                )
              else return null;
            }}
          </ProFormDependency>
          <ProFormRadio.Group
            name={['shuxing', 'rateLimit', 'enable']}
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
              <ProFormDependency name={['shuxing', 'rateLimit', 'enable']}>
                {({ shuxing }) => {
                  if (shuxing?.rateLimit?.enable === '1') {
                    return (
                      <Row>
                        在&nbsp;&nbsp;
                        <ProFormDigit
                          width={'xs'}
                          name={['shuxing', 'rateLimit', 'seconds']}
                          min={0}
                        />
                        分钟内请求次数，最大&nbsp;&nbsp;
                        <ProFormDigit
                          width={'xs'}
                          name={['shuxing', 'rateLimit', 'times']}
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
            name={['shuxing', 'status']}
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
          formRef={step2FormRef}
          readonly={readonlyfrom}
          name="zhixing"
          title="执行配置"
          layout={readonlyfrom ? 'horizontal' : 'vertical'}
          onFinish={async (values: any) => {
            // console.log(values)
            let reqTb: any[] = [];
            let resTb: any[] = [];
            // 如果是新建或是修改了请求返回列名，需要根据表单二的内容对表单三进行赋值
            if (localStorage.getItem('api_id') === 'new') {
              (values?.zhixing?.fieldParams || []).map((e: any) => {
                // 作为请求参数
                e.reqable.length === 0 ? null
                  : reqTb.push({
                    paramName: e.columnName,
                    nullable: e.columnNullable,
                    paramComment: e.columnComment,
                    paramType: "1",
                    col_id: nanoid(),
                  });
                // 作为返回参数
                e.resable.length === 0 ? null
                  : resTb.push({
                    fieldName: e.columnName,
                    fieldComment: e.columnComment,
                    col_id: nanoid(),
                  });
              })
            } else {
              // 修改了请求返回列名
              let canshu = formRef?.current[2].current?.getFieldsValue().canshu;
              // 不是新建，需要筛选哪些是新家，哪些是新排除掉的字段
              (values?.zhixing?.fieldParams || []).map((e: any) => {
                // 作为请求参数
                if (e.reqable.length === 1) {
                  let temp: any = canshu?.reqParams?.filter((e1: any) => e1.paramName === e.columnName)
                  // temp是数组类型
                  if (temp.length) {
                    temp[0].nullable = temp.nullable === "1" ? ['1'] : [];
                    reqTb.push(temp[0]);
                  } else {
                    reqTb.push({
                      paramName: e.columnName,
                      nullable: e.columnNullable,
                      paramComment: e.columnComment,
                      // paramType: "1",
                      col_id: nanoid(),
                    })
                  }
                }
                // 作为返回参数
                if (e.resable.length === 1) {
                  let temp = canshu?.resParams?.filter((e1: any) => e1.fieldName === e.columnName)
                  if (temp.length) {
                    resTb.push(temp[0]);
                  } else {
                    resTb.push({
                      fieldName: e.columnName,
                      fieldComment: e.columnComment,
                      col_id: nanoid(),
                    })
                  }
                }
              })
            }
            // 加到step3中
            step3FormRef.current?.setFieldsValue({
              canshu: {
                reqParams: reqTb,
                resParams: resTb,
              }
            })
            // 打开可编辑的所有行
            setEditableRowKeys_res(() => (resTb || [])
              .map((item: { col_id: any; }) => item.col_id));
            setEditableRowKeys_req(() => (reqTb || [])
              .map((item: { col_id: any; }) => item.col_id));
            await waitTime(500);
            return true;
          }}
          initialValues={{
            // fieldParams: formRef.current?.getFieldsValue().执行配置?.aa,
            // fieldParams: tableData,
            zhixing: { configType: "1" },
          }}
        >
          <ProFormSelect
            name={['zhixing', 'configType']}
            label="配置方式"
            width={width_form_item}
            valueEnum={{
              1: '向导模式',
              2: '脚本模式',
            }}
            rules={[{ required: request_item }]}
          // 根据选项下面展示不同内容
          />
          <ProFormSelect
            name={['zhixing', 'sourceId']}
            label="数据源"
            width={width_form_item}
            // valueEnum={{
            //   robot_symptom_part: 'robot数据库',
            //   mysql_symptom_part: 'mysql数据库',
            // }}
            request={async () => await getDatasourceList()}
            rules={[{ required: request_item }]}
            debounceTime={1}
            fieldProps={{
              onChange: async (e, option) => {
                step2FormRef.current?.setFieldsValue({
                  zhixing: {
                    tableName: null,
                    fieldParams: [],
                  }
                });
              },
            }}
          />
          <ProFormDependency name={['zhixing', 'configType']}>
            {({ zhixing }) => {
              if (zhixing?.configType === '2') {
                return <ProFormTextArea label="填写SQL脚本" name={['zhixing', 'sqlText']} />;
              } else {
                return (
                  <>
                    <ProFormSelect
                      name={['zhixing', 'tableName']}
                      label="数据库表"
                      width={width_form_item}
                      dependencies={['zhixing', 'sourceId']}
                      request={async (params) => {
                        if (params.zhixing.sourceId) return await getDatabaseTableName(params.zhixing.sourceId);
                      }}
                      rules={[{ required: request_item }]}
                      fieldProps={{
                        onChange: async (e, option: any) => {
                          let data = step2FormRef.current?.getFieldsValue();
                          let table = await getTableColumn({ id: data.zhixing.sourceId, tableName: e });
                          // 改变时赋值数据表名
                          step2FormRef.current?.setFieldsValue({
                            zhixing: {
                              tableName: option?.label,
                              fieldParams: table,
                            }
                          });
                          // 打开可编辑
                          setEditableRowKeys(() => (table || [])
                            .map((item: { col_id: any; }) => item.col_id));
                        }
                      }}
                    />
                    <EditableProTable<API.APIZiDuanTableType>
                      editableFormRef={editableFormRef}
                      scroll={{ x: 1020 }}
                      rowKey="col_id"
                      headerTitle="字段列表"
                      name={['zhixing', 'fieldParams']}
                      bordered
                      columns={columns}
                      recordCreatorProps={false}
                      onChange={setTableData}
                      editable={{
                        type: 'multiple',
                        editableKeys,
                        onChange: setEditableRowKeys,
                      }}
                    />
                  </>
                );
              }
            }}
          </ProFormDependency>
        </StepsForm.StepForm>
        <StepsForm.StepForm
          formRef={step3FormRef}
          readonly={readonlyfrom}
          name="canshu"
          title="参数配置">
          <ProCard title="请求参数" headerBordered type="inner">
            <EditableProTable<API.reqParamsColumns>
              scroll={{ x: 1000 }}
              rowKey="col_id"
              name={['canshu', 'reqParams']}
              bordered
              columns={reqParamsColumns}
              value={tableData_req}
              recordCreatorProps={
                readonlyfrom
                  ? false
                  : {
                    // 每次新增的时候需要Key
                    record: () => ({ col_id: nanoid() }),
                  }
              }
              onChange={setTableData_req}
              editable={{
                type: 'multiple',
                editableKeys: editableKeys_req,
                onChange: setEditableRowKeys_req,
                actionRender: (row, config, defaultDoms) => [defaultDoms.delete],
              }}
            />
          </ProCard>
          <ProCard title={'返回字段'} headerBordered type="inner">
            <EditableProTable<API.resParamsColumns>
              editableFormRef={editableFormRefres}
              scroll={{ x: 1000 }}
              rowKey="col_id"
              name={['canshu', 'resParams']}
              bordered
              columns={resParamsColumns}
              recordCreatorProps={
                readonlyfrom
                  ? false
                  : {
                    position: 'bottom',
                    // 每次新增的时候需要Key
                    record: () => ({ col_id: nanoid() }),
                  }
              }
              onChange={setTableData_res}
              editable={{
                type: 'multiple',
                editableKeys: editableKeys_res,
                onChange: setEditableRowKeys_res,
                actionRender: (row, config, dom) => [
                  dom.delete,
                  <a key="editable" onClick={() => {
                    modalFormRef?.current?.resetFields();//重置表单
                    modalFormRef?.current?.setFieldsValue({ ...row });//赋值
                    settuominModal(true);
                  }}>
                    脱敏
                  </a>
                ],
              }}
            />
          </ProCard>
        </StepsForm.StepForm>
      </StepsForm>
      <Modal
        title={"字段脱敏"}
        open={tuominModal}
        onCancel={() => { settuominModal(false); modalFormRef?.current?.resetFields(); }}
        footer={[]}
        forceRender={true}//modal要刷新，否则第一次赋值会失败
      >
        <ProForm
          formRef={modalFormRef}
          name="tuomin"
          onFinish={async (values) => {
            // console.log(values)
            settuominModal(false);
          }}
          layout={'horizontal'}
          submitter={{
            render: (props) => {
              return [
                <Button type='primary' htmlType="button" key="submit" onClick={() => props.form?.submit?.()}>
                  确认
                </Button>
              ]
            }
          }}
        >
          <ProFormText
            width="md"
            name="fieldName"
            required
            label="字段名称"
            disabled
          />
          <ProFormSelect
            name={"leixing"}
            label="脱敏类型"
            width="md"
            required
            valueEnum={{
              1: '正则替换',
              2: '加密算法',
            }}
          />
          <ProFormDependency name={["leixing", "guize"]}>
            {({ leixing }) => {
              return (
                <ProFormSelect
                  name={"guize"}
                  label="脱敏规则"
                  width="md"
                  required
                  valueEnum={leixing === '1' ? {
                    1: '中文姓名',
                    2: '身份证号',
                    3: '周定电话',
                    4: '手机号码',
                    5: '地址',
                    6: '电子邮箱',
                    7: '银行卡号',
                    8: '公司开户银行联号',
                  } : {
                    1: 'BASE64加密',
                    2: 'MD5加密',
                    3: 'SHA_1加密',
                    4: 'SHA 256加密',
                    5: 'AES加密',
                    6: 'DES加密',
                  }}
                  addonAfter={
                    <Tooltip placement="bottom" title="添加自定义规则">
                      <PlusCircleOutlined onClick={() => message.info("暂不支持添加")} />
                    </Tooltip>}
                />
              )
            }}
          </ProFormDependency>

        </ProForm>
      </Modal>
    </ProCard >
  );
};
