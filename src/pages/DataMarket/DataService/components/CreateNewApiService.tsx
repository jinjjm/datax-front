import {
  EditableFormInstance,
  EditableProTable,
  ProCard,
  ProColumns,
  ProFormDependency,
  ProFormDigit,
  ProFormInstance,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components';
import { history as hhhistory } from '@umijs/max';
import { Button, Col, message, Row, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';

import { downloadApiDoc, getApiDetails } from '@/services/ant-design-pro/datax';
import { MyIcon } from '@/services/utils/icon';

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
 * 问题：1、每个下拉框确认
 * 2、table新添加数据后，如果不想要无法删除，无法取消
 * 3、删除操作有问题
 * 4、请求拦截器的使用requestInterceptors
 */
export default () => {
  const formRef = useRef<React.MutableRefObject<ProFormInstance<any> | undefined>[]>([]);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  // const [item_readonly, setItem_readonly] = useState(false);
  // const [item_readonly_params, setItem_readonly_params] = useState(false);
  const editableFormRef = useRef<EditableFormInstance>();
  const editableFormRefreq = useRef<EditableFormInstance>();
  const editableFormRefres = useRef<EditableFormInstance>();
  const [tableData, SetTableData] = useState([]);
  const [tableData_req, setTableData_req] = useState<any>([]);
  const [tableData_res, setTableData_res] = useState([]);

  let readonlyfrom = localStorage.getItem('api_edit_status') === 'false' ? true : false;

  const columns: ProColumns<API.APIZiDuanTableType>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      align: 'center',
      readonly: true,
    },
    {
      key: 'id',
      hideInTable: true,
    },
    {
      title: '列名',
      key: 'columnName',
      dataIndex: 'columnName',
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
      request: async () => [
        {
          value: '1',
          label: 'Y',
        },
        {
          value: '2',
          label: 'N',
        },
      ],
      fieldProps: (_, { rowIndex }) => {
        return {
          onSelect: () => {
            // 每次选中重置参数
            editableFormRef.current?.setRowData?.(rowIndex, { fraction: [] });
          },
        };
      },
      render: (_) => (_ === '1' ? 'Y' : 'N'),
    },
    {
      title: '是否允许为空',
      key: 'columnNullable',
      dataIndex: 'columnNullable',
      align: 'center',
      readonly: item_readonly,
      request: async () => [
        {
          value: '1',
          label: 'Y',
        },
        {
          value: '2',
          label: 'N',
        },
      ],
      fieldProps: (_, { rowIndex }) => {
        return {
          onSelect: () => {
            // 每次选中重置参数
            editableFormRef.current?.setRowData?.(rowIndex, { fraction: [] });
          },
        };
      },
      render: (_) => (_ === '1' ? 'Y' : 'N'),
    },
    {
      title: '列默认值',
      key: 'dataDefault',
      dataIndex: 'dataDefault',
      align: 'center',
      readonly: item_readonly,
    },
    {
      title: '列注释',
      key: 'columnComment',
      dataIndex: 'columnComment',
      align: 'center',
      readonly: item_readonly,
    },
    {
      title: '是否作为请求参数',
      key: 'reqable',
      dataIndex: 'reqable',
      align: 'center',
      request: async () => [
        {
          value: '1',
          label: '是',
        },
        {
          value: '2',
          label: '否',
        },
      ],
      fieldProps: (_, { rowIndex }) => {
        return {
          onSelect: () => {
            // 每次选中重置参数
            editableFormRef.current?.setRowData?.(rowIndex, { fraction: [] });
          },
        };
      },
      render: (_) => (_ === null ? '' : _ === '1' ? '是' : '否'),
    },
    {
      title: '是否作为返回参数',
      key: 'resable',
      dataIndex: 'resable',
      align: 'center',
      request: async () => [
        {
          value: '1',
          label: '是',
        },
        {
          value: '2',
          label: '否',
        },
      ],
      fieldProps: (_, { rowIndex }) => {
        return {
          onSelect: () => {
            // 每次选中重置参数
            editableFormRef.current?.setRowData?.(rowIndex, { fraction: [] });
          },
        };
      },
      render: (_) => (_ === null ? '' : _ === '1' ? '是' : '否'),
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      hideInTable: readonlyfrom,
      render: (text, record, _, action) => (
        <Space>
          <a
            key="editable"
            onClick={() => {
              action?.startEditable?.(record.columnName);
            }}
          >
            编辑
          </a>
          {/* <a
            key="delete"
            onClick={() => {
              SetTableData(tableData.filter((item: any) => item.columnName !== record.columnName));
            }}
          >
            删除
          </a> */}
        </Space>
      ),
    },
  ];
  const reqParamsColumns: ProColumns<API.reqParamsColumns>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      align: 'center',
      readonly: true,
    },
    {
      key: 'id',
      hideInTable: true,
    },
    {
      title: '参数名称',
      key: 'paramName',
      dataIndex: 'paramName',
      align: 'center',
      //readonly: item_readonly_params,
    },
    {
      title: '是否允许为空',
      key: 'nullable',
      dataIndex: 'nullable',
      align: 'center',
      // readonly: item_readonly,
      request: async () => [
        {
          value: '0',
          label: '否',
        },
        {
          value: '1',
          label: '是',
        },
      ],
      fieldProps: (_, { rowIndex }) => {
        return {
          onSelect: () => {
            // 每次选中重置参数
            editableFormRefreq.current?.setRowData?.(rowIndex, { fraction: [] });
          },
        };
      },
      render: (_) => (_ === '1' ? '是' : '否'),
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
      request: async () => [
        {
          value: '1',
          label: '字符串',
        },
        {
          value: '0',
          label: '整数',
        },
        {
          value: '2',
          label: '浮点数',
        },
      ],
      fieldProps: (_, { rowIndex }) => {
        return {
          onSelect: () => {
            // 每次选中重置参数
            editableFormRefreq.current?.setRowData?.(rowIndex, { fraction: [] });
          },
        };
      },
      render: (_) => (_ === '1' ? '字符串' : _ === '0' ? '整数' : '浮点数'),
    },
    {
      title: '操作符',
      key: 'whereType',
      dataIndex: 'whereType',
      align: 'center',
      // readonly: item_readonly,
      request: async () => [
        {
          value: '0',
          label: '小于',
        },
        {
          value: '1',
          label: '等于',
        },
        {
          value: '2',
          label: '大于',
        },
      ],
      fieldProps: (_, { rowIndex }) => {
        return {
          onSelect: () => {
            // 每次选中重置参数
            editableFormRefreq.current?.setRowData?.(rowIndex, { fraction: [] });
          },
        };
      },
      render: (_) => (_ === '0' ? '小于' : _ === '1' ? '等于' : '大于'),
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
      title: '操作',
      valueType: 'option',
      align: 'center',
      hideInTable: readonlyfrom,
      render: (text, record, _, action) => (
        <Space>
          <a
            key="editable"
            onClick={() => {
              action?.startEditable?.(record.paramName);
            }}
          >
            编辑
          </a>
        </Space>
      ),
    },
  ];
  const resParamsColumns: ProColumns<API.resParamsColumns>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      align: 'center',
      readonly: true,
    },
    {
      key: 'id',
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
      render: (text, record, _, action) => (
        <Space>
          <a
            key="editable"
            onClick={() => {
              action?.startEditable?.(record.fieldName);
            }}
          >
            编辑
          </a>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    if (localStorage.getItem('api_id') === null) history.back();
    let id = localStorage.getItem('api_id');
    console.log(id);
    // let data;
    if (id && id !== 'new' && id !== '')
      getApiDetails(id).then((res) => {
        formRef?.current?.forEach((formInstanceRef: any) => {
          formInstanceRef?.current?.setFieldsValue({
            shuxing: res,
            zhixing: res?.executeConfig,
            canshu: res,
          });
        });
        //
        // 给每个可编辑表格赋值, 但并不能对table数据进行初始化
        SetTableData(res?.executeConfig?.fieldParams);
        setTableData_req(res?.reqParams);
        setTableData_res(res?.resParams);
        console.log(res?.reqParams);
      });
  }, [localStorage.getItem('api_id'), history.state]);

  return (
    <ProCard
      title={'数据API详情'}
      headerBordered
      extra={
        <Space>
          <Button
            type="primary"
            icon={<MyIcon type="icon-jiekourizhi" />}
            onClick={() => downloadApiDoc(localStorage.getItem('api_id'))}
          >
            接口文档
          </Button>
          <Button
            type="primary"
            icon={<MyIcon type="icon-jiekou1" />}
            onClick={() => hhhistory.push('/datamarket/data-service')}
          >
            接口示例
          </Button>
          <Button type="dashed" icon={<MyIcon type="icon-fanhui" />} onClick={() => history.back()}>
            返回
          </Button>
        </Space>
      }
    >
      <StepsForm<{
        name: string;
      }>
        formMapRef={formRef}
        onFinish={async (values) => {
          console.log(values);
          await waitTime(1000);
          message.success('提交成功');
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
          onFinish={async () => {
            console.log(
              formRef?.current?.forEach((e) => {
                e?.current?.getFieldsValue();
              }),
            );
            await waitTime(500);
            return true;
          }}
        >
          <ProFormText
            name={['shuxing', 'apiName']}
            label="API名称"
            width={width_form_item}
            placeholder="请输入名称"
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
          <ProFormTextArea
            name={['shuxing', 'deny']}
            label="IP黑名单"
            width={width_form_item}
            tooltip="请使用英文逗号做分割"
          />
          <ProFormTextArea
            name={['shuxing', 'allow']}
            label="IP白名单"
            width={width_form_item}
            tooltip="请使用英文逗号做分割"
          />
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
          <ProFormTextArea name={['shuxing', 'remark']} label="备注" width={width_form_item} />
        </StepsForm.StepForm>
        <StepsForm.StepForm
          readonly={readonlyfrom}
          name="zhixing"
          title="执行配置"
          onFinish={async () => {
            console.log(
              formRef.current?.forEach((e) => {
                e?.current?.getFieldsValue();
              }),
            );
            console.log(tableData);
            console.log(tableData_req);
            console.log(tableData_res);
            await waitTime(500);
            return true;
          }}
          initialValues={{
            // fieldParams: formRef.current?.getFieldsValue().执行配置?.aa,
            fieldParams: tableData,
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
            name={['zhixing', 'tableName']}
            label="数据源"
            width={width_form_item}
            valueEnum={{
              robot_symptom_part: 'robot数据库',
              mysql_symptom_part: 'mysql数据库',
            }}
            rules={[{ required: request_item }]}
          />
          <ProFormDependency name={['zhixing', 'configType']}>
            {({ zhixing }) => {
              if (zhixing?.configType === '1') {
                return (
                  <>
                    <ProFormSelect
                      name={['zhixing', 'tableName']}
                      label="数据库表"
                      width={width_form_item}
                      valueEnum={{
                        患者表: '患者表',
                        部位表: '部位表',
                        症状表: '症状表',
                      }}
                      rules={[{ required: request_item }]}
                    />
                    <EditableProTable<API.APIZiDuanTableType>
                      editableFormRef={editableFormRef}
                      scroll={{ x: 1050 }}
                      rowKey="columnName"
                      headerTitle="字段列表"
                      name={['zhixing', 'fieldParams']}
                      bordered
                      columns={columns}
                      // recordCreatorProps={
                      //   readonlyfrom
                      //     ? false
                      //     : {
                      //       position: 'bottom',
                      //       // 每次新增的时候需要Key
                      //       record: () => ({ columnName: (Math.random() * 1000000).toFixed(0) }),
                      //     }
                      // }
                      recordCreatorProps={false}
                      onChange={SetTableData}
                      editable={{
                        // type: 'multiple',
                        editableKeys,
                        onSave: async (rowKey, data, row) => {
                          console.log(rowKey, data, row);
                          setItem_readonly(true);
                          await waitTime(500);
                        },
                        onChange: setEditableRowKeys,
                        actionRender: (row, config, dom) => [dom.save, dom.cancel],
                      }}
                    />
                  </>
                );
              } else {
                return <ProFormTextArea label="填写SQL脚本" name={['zhixing', 'sqlText']} />;
              }
            }}
          </ProFormDependency>
        </StepsForm.StepForm>
        <StepsForm.StepForm readonly={readonlyfrom} name="canshu" title="参数配置">
          <ProCard title="请求参数" headerBordered type="inner">
            <EditableProTable<API.reqParamsColumns>
              editableFormRef={editableFormRefreq}
              scroll={{ x: 1000 }}
              rowKey="paramName"
              name={['canshu', 'reqParams']}
              bordered
              // headerTitle={"请求参数"}
              columns={reqParamsColumns}
              recordCreatorProps={{
                // 每次新增的时候需要Key
                record: () => ({ paramName: Date.now() }),
              }}
              onChange={setTableData_req}
              editable={{
                type: 'multiple',
                editableKeys,
                onChange: setEditableRowKeys,
                onValuesChange: (record, recordList) => {
                  setTableData_req(recordList);
                },
                actionRender: (row, config, defaultDoms) => [defaultDoms.delete],
              }}
            />
          </ProCard>
          <ProCard title={'返回字段'} headerBordered type="inner">
            <EditableProTable<API.resParamsColumns>
              editableFormRef={editableFormRefres}
              scroll={{ x: 1000 }}
              rowKey="fieldName"
              name={['canshu', 'resParams']}
              bordered
              columns={resParamsColumns}
              recordCreatorProps={
                readonlyfrom
                  ? false
                  : {
                      position: 'bottom',
                      // 每次新增的时候需要Key
                      record: () => ({ fieldName: (Math.random() * 1000000).toFixed(0) }),
                    }
              }
              onChange={setTableData_res}
              editable={{
                // type: 'multiple',
                editableKeys,
                onSave: async (rowKey, data, row) => {
                  console.log(rowKey, data, row);
                  setItem_readonly_params(true);
                  await waitTime(500);
                },
                onChange: setEditableRowKeys,
                actionRender: (row, config, dom) => [dom.save, dom.cancel],
              }}
            />
          </ProCard>
        </StepsForm.StepForm>
      </StepsForm>
    </ProCard>
  );
};
