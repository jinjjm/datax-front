import {
  EditableFormInstance,
  EditableProTable,
  ProCard,
  ProColumns,
  ProFormCheckbox,
  ProFormInstance,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components';
import { Button, message, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';

import { getApiDetails } from '@/services/ant-design-pro/datax';
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
const width_form_item = 'md';
// true false
const request_item = false;
// const item_readonly = false;
export default () => {
  const formRef = useRef<ProFormInstance>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [item_readonly, setItem_readonly] = useState(false);
  const editableFormRef = useRef<EditableFormInstance>();

  let w = localStorage.getItem('api_id') === null ? history.back() : null;
  console.log(w);
  let readonlyfrom = localStorage.getItem('api_edit_status') === 'true' ? true : false;
  const ddd = [
    {
      columnName: 'id',
      dataType: 'varchar',
      dataLength: 50,
      dataPrecision: null,
      dataScale: null,
      columnKey: '1',
      columnNullable: '0',
      columnPosition: 1,
      dataDefault: null,
      columnComment: '主键',
      reqable: '1',
      resable: '1',
    },
    {
      columnName: 'part_name',
      dataType: 'varchar',
      dataLength: 255,
      dataPrecision: null,
      dataScale: null,
      columnKey: '0',
      columnNullable: '1',
      columnPosition: 2,
      dataDefault: null,
      columnComment: '部位名称',
      reqable: null,
      resable: '1',
    },
  ];
  const columns: ProColumns<API.APIZiDuanTableType>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
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
      render: (_) => (_ === '1' ? 'Y' : 'N'),
    },
    {
      title: '是否允许为空',
      key: 'columnNullable',
      dataIndex: 'columnNullable',
      align: 'center',
      readonly: item_readonly,
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
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.columnName);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];
  useEffect(() => {
    let id = localStorage.getItem('api_id');
    // let data;
    if (id && id !== 'new' && id !== '')
      getApiDetails(id).then((res) => {
        // data = res;
        formRef.current?.setFieldsValue({
          shuxing: res,
          zhixing: res.executeConfig,
        });
      });
  }, [localStorage.getItem('api_id'), history.state]);

  return (
    <ProCard
      title={'数据API详情'}
      headerBordered
      extra={
        <Space>
          <Button type="primary" icon={<MyIcon type="icon-jiekourizhi" />}>
            接口文档
          </Button>
          <Button type="primary" icon={<MyIcon type="icon-daimashili" />}>
            接口示例
          </Button>
          <Button type="dashed" icon={<MyIcon type="icon-fanhui" />}>
            返回
          </Button>
        </Space>
      }
    >
      <StepsForm<{
        name: string;
      }>
        formRef={formRef}
        onFinish={async () => {
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
        <StepsForm.StepForm<{
          name: string;
        }>
          readonly={readonlyfrom}
          {...formItemLayout}
          layout={'horizontal'}
          name="shuxing"
          title="属性配置"
          stepProps={
            {
              // description: '这里填入的都是基本信息',
            }
          }
          onFinish={async () => {
            console.log(formRef.current?.getFieldsValue());
            await waitTime(500);
            return true;
          }}
        >
          <ProFormText
            name="apiName"
            label="API名称"
            width={width_form_item}
            placeholder="请输入名称"
            rules={[{ required: request_item }]}
          />
          <ProFormText
            name="apiVersion"
            label="API版本"
            width={width_form_item}
            rules={[{ required: request_item }]}
          />
          <ProFormText
            name="apiUrl"
            label="API路径"
            width={width_form_item}
            rules={[{ required: request_item }]}
          />
          <ProFormSelect
            name="reqMethod"
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
            name="resType"
            label="返回格式"
            valueEnum={{
              JSON: 'JSON',
              OBJECT: 'OBJECT',
            }}
            rules={[{ required: request_item }]}
            width={width_form_item}
          />
          <ProFormTextArea name="deny" label="IP黑名单" width={width_form_item} />
          <ProFormTextArea name="allow" label="IP白名单" width={width_form_item} />
          <ProFormRadio.Group
            name="rateLimit"
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
          <ProFormRadio.Group
            name="status"
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
          <ProFormTextArea name="remark" label="备注" width={width_form_item} />
        </StepsForm.StepForm>
        <StepsForm.StepForm<{
          checkbox: string;
        }>
          readonly={readonlyfrom}
          name="zhixing"
          title="执行配置"
          stepProps={{
            description: '这里填入运维参数',
          }}
          onFinish={async () => {
            console.log(formRef.current?.getFieldsValue());
            await waitTime(500);
            return true;
          }}
          initialValues={{
            // fieldParams: formRef.current?.getFieldsValue().执行配置?.aa,
            fieldParams: ddd,
          }}
        >
          <ProFormSelect
            name="configType"
            label="配置方式"
            width={width_form_item}
            valueEnum={{
              1: '表引导模式',
              2: '脚本模式',
            }}
            rules={[{ required: request_item }]}
            // 根据选项下面展示不同内容
          />
          <ProFormSelect
            name="tableName"
            label="数据源"
            width={width_form_item}
            valueEnum={{
              robot_symptom_part: 'robot数据库',
              mysql_symptom_part: 'mysql数据库',
            }}
            rules={[{ required: request_item }]}
          />
          <ProFormSelect
            name="tableName"
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
            scroll={{ x: 960 }}
            rowKey="columnName"
            headerTitle="字段列表"
            name={'fieldParams'}
            bordered
            columns={columns}
            value={ddd}
            recordCreatorProps={
              readonlyfrom
                ? false
                : {
                    position: 'bottom',
                    // 每次新增的时候需要Key
                    record: () => ({ columnName: (Math.random() * 1000000).toFixed(0) }),
                  }
            }
            // onChange={setDataSource}
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
        </StepsForm.StepForm>
        <StepsForm.StepForm
          readonly={readonlyfrom}
          name="time"
          title="参数配置"
          stepProps={{
            description: '这里填入发布判断',
          }}
        >
          <ProFormCheckbox.Group
            name="checkbox"
            label="部署单元"
            rules={[
              {
                required: true,
              },
            ]}
            options={['部署单元1', '部署单元2', '部署单元3']}
          />
          <ProFormSelect
            label="部署分组策略"
            name="remark"
            rules={[
              {
                required: true,
              },
            ]}
            initialValue="1"
            options={[
              {
                value: '1',
                label: '策略一',
              },
              { value: '2', label: '策略二' },
            ]}
          />
          <ProFormSelect
            label="Pod 调度策略"
            name="remark2"
            initialValue="2"
            options={[
              {
                value: '1',
                label: '策略一',
              },
              { value: '2', label: '策略二' },
            ]}
          />
        </StepsForm.StepForm>
      </StepsForm>
    </ProCard>
  );
};
