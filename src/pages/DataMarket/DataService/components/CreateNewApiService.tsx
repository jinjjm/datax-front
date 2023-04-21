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
  StepsForm,
} from '@ant-design/pro-components';
import { history as hhhistory } from '@umijs/max';
import { Button, Checkbox, Col, message, Modal, Row, Space, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';

import { downloadApiDoc, getApiDetails } from '@/services/ant-design-pro/datax';
import { MyIcon } from '@/services/utils/icon';
import { PlusCircleOutlined } from '@ant-design/icons';
import { handleAPIDetials } from '../services/Handle';
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
 * 6、步骤二和步骤三的联动性，根据步骤二所选的请求、返回参数来确认步骤三的表格问题
 * 7、最后的表单提交接口未完成
 */
export default () => {
  const formRef = useRef<React.MutableRefObject<ProFormInstance<any> | undefined>[]>([]);
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
  const [modalData, setModalData] = useState<any>();

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
      key: 'col_id',
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
      key: 'sha?'
    },
    {
      title: '参数名称',
      key: 'paramName',
      dataIndex: 'paramName',
      align: 'center',
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
      key: 'sha??'
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
          <a key="editable" onClick={() => { settuominModal(true); setModalData(record); }}>
            脱敏
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
            接口测试
          </Button>
          <Button type="dashed" icon={<MyIcon type="icon-fanhui" />} onClick={() => history.back()}>
            返回
          </Button>
        </Space>
      }
    >
      <StepsForm
        formMapRef={formRef}
        onFinish={async (values) => {
          console.log(values);
          await waitTime(1000);
          message.success('提交成功');
          const { shuxing } = values;
          console.log('传参格式：', {
            ...values,
            shuxing: {
              allow: null,
              deny: null,
              ...shuxing,
            }
          })
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
            console.log(values);
            await waitTime(500);
            return true;
          }}
          initialValues={{
            "shuxing": { "status": "1" },
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
          <ProFormTextArea name={['shuxing', 'remark']} label="备注" width={width_form_item} />
        </StepsForm.StepForm>
        <StepsForm.StepForm
          readonly={readonlyfrom}
          name="zhixing"
          title="执行配置"
          layout={readonlyfrom ? 'horizontal' : 'vertical'}
          onFinish={async (values: any) => {
            console.log(values)
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
              } else {
                return <ProFormTextArea label="填写SQL脚本" name={['zhixing', 'sqlText']} />;
              }
            }}
          </ProFormDependency>
        </StepsForm.StepForm>
        <StepsForm.StepForm readonly={readonlyfrom} name="canshu" title="参数配置">
          <ProCard title="请求参数" headerBordered type="inner">
            <EditableProTable<API.reqParamsColumns>
              // editableFormRef={editableFormRefreq}
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
                    settuominModal(true);
                    setModalData(row);
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
        onCancel={() => settuominModal(false)}
        footer={[]}
      >
        <ProForm
          name="tuomin"
          initialValues={{
            fieldName: modalData?.fieldName,
          }}
          onFinish={async (values) => {
            console.log(values)
            setModalData(false);
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
