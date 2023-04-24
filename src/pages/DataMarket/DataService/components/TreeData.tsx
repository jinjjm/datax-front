import { addTreeTitle, deleteTreeTitle, getApiTrees1, updateTreeTitle } from '@/services/ant-design-pro/datax';
import { MyIcon } from '@/services/utils/icon';
import { ProForm, ProFormInstance, ProFormRadio, ProFormText } from '@ant-design/pro-components';
import { message, Modal, Popconfirm, Space, Tooltip, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ellipsis, handleTreeData } from '../services/Handle';
import '../services/index.css'

const x = 3;
const y = 2;
const z = 1;
const defaultData: DataNode[] = [];

const generateData = (_level: number, _preKey?: React.Key, _tns?: DataNode[]) => {
  const preKey = _preKey || '0';
  const tns = _tns || defaultData;

  const children: React.Key[] = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

const dataList: { key: React.Key; title: string }[] = [];
const generateList = (data: DataNode[]) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key } = node;
    dataList.push({ key, title: key as string });
    if (node.children) {
      generateList(node.children);
    }
  }
};
generateList(defaultData);


const App: React.FC = () => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const modalFormRef = useRef<ProFormInstance<any>>();
  const [treeData, setTreeData] = useState<any>([]);
  const [showOptions, setShowOptions] = useState<{
    show: boolean, // 操作按钮展示
    id: string, // 菜单id
  }>({ show: false, id: "" });
  const [treeParams, setTreeParams] = useState<{
    id: string,//菜单id
    menuName: string,//菜单名字
    parentId: string,//父菜单id
    menuType: Number,//1 -输出菜单 2-输入菜单
  }>({ id: "", menuName: "", parentId: "", menuType: 1 });



  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    // console.log('ExpandedKeys : ', newExpandedKeys);
    setAutoExpandParent(false);
    setShowOptions({ show: false, id: "" })
  };
  const onSelect = (keys: React.Key[], info: any) => {
    // console.log('keys', keys);
    // console.log(info.node);
    // console.log('key', info.node.key);
    // console.log('title', info.node.title);
    // setShowOptions({ show: false, id: "", title: "" })
    // console.log(expandedKeys);
  };
  const onRightClick = (treeNode: { event: any; node: any }) => {
    // console.log('event', treeNode.event);
    // console.log('node', treeNode.node);
    setShowOptions({
      id: treeNode.node.key,
      show: treeNode.node.childrenMenu ? true : false
    })
    setTreeParams({
      id: treeNode.node.key,
      menuName: treeNode.node.menuName,
      parentId: treeNode.node.parentId,
      menuType: 1,
    })
  };

  // const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { value } = e.target;
  //   const newExpandedKeys = dataList
  //     .map((item) => {
  //       if (item.title.indexOf(value) > -1) {
  //         return getParentKey(item.key, defaultData);
  //       }
  //       return null;
  //     })
  //     .filter((item, i, self) => item && self.indexOf(item) === i);
  //   setExpandedKeys(newExpandedKeys as React.Key[]);
  //   setSearchValue(value);
  //   setAutoExpandParent(true);
  // };
  const handleAddSub = () => {
    modalFormRef?.current?.resetFields();
    setAddModal(true);
  };

  const handleEditSub = () => {
    modalFormRef?.current?.resetFields();
    modalFormRef?.current?.setFieldsValue({ ...treeParams });
    setEditModal(true);
  };


  // const treeData = useMemo(() => {
  //   const data = [
  //     {
  //       title: '路网中心',
  //       key: '1',
  //       icon: <MyIcon type="icon-file" />,
  //       children: [
  //         {
  //           title: '13楼',
  //           key: '1-1',
  //           icon: <MyIcon type="icon-file" />,
  //           children: [
  //             {
  //               title: 'API-1',
  //               key: '1-1-1',
  //               icon: <MyIcon type="icon-jiekou" />,
  //               isLeaf: true,
  //             },
  //             {
  //               title: 'API-2',
  //               key: '1-1-2',
  //               icon: <MyIcon type="icon-jiekou" />,
  //               isLeaf: true,
  //             },
  //           ],
  //         },
  //         {
  //           title: '6楼',
  //           key: '1-2',
  //           icon: <MyIcon type="icon-file" />,
  //           children: [
  //             {
  //               title: 'API-3',
  //               key: '1-2-1',
  //               icon: <MyIcon type="icon-jiekou" />,
  //               isLeaf: true,
  //             },
  //           ],
  //         },
  //         {
  //           title: 'api',
  //           key: '1231231232',
  //           isLeaf: true,
  //         },
  //       ],
  //     },
  //     {
  //       title: '其他单位',
  //       key: '2',
  //       icon: <MyIcon type="icon-file" />,
  //       children: [
  //         {
  //           title: 'API-3',
  //           key: '2-1-1',
  //           icon: <MyIcon type="icon-jiekou" />,
  //         },
  //       ],
  //     },
  //   ];

  //   return data;
  // }, [searchValue]);

  useEffect(() => {
    getApiTrees1().then((res) => {
      // console.log(handleTreeData(res))
      setTreeData(handleTreeData(res));
    })
  }, [])

  return (
    <div>
      {/* <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} /> */}
      <Tree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={treeData}
        onRightClick={onRightClick}
        showIcon={true}
        onSelect={onSelect}
        fieldNames={{ title: "menuName", key: "id", children: "childrenMenu" }}
        titleRender={(node) => {
          // console.log(node)
          return (
            <span >
              <Tooltip placement="top" title={node?.menuName}>
                {ellipsis(node?.menuName, 8)}
              </Tooltip>
              {
                showOptions.show && showOptions?.id === node?.id ?
                  <Space size={1}>
                    <div style={{ alignSelf: 'center', marginLeft: 10 }} onClick={handleAddSub}>
                      <Tooltip placement="bottom" title="添加子组织">
                        <MyIcon type="icon-tianjia" />
                      </Tooltip>
                    </div>
                    <div style={{ alignSelf: 'center', marginLeft: 10 }} onClick={handleEditSub}>
                      <Tooltip placement="bottom" title="修改">
                        <MyIcon type="icon-bianji" />
                      </Tooltip>
                    </div>
                    <div style={{ alignSelf: 'center', marginLeft: 10 }}>
                      <Popconfirm title="请再次确认删除" onConfirm={() => deleteTreeTitle(node?.id).then(() => getApiTrees1().then((res) => setTreeData(handleTreeData(res))))}>
                        <Tooltip placement="bottom" title="删除">
                          <MyIcon type="icon-shanchu1" />
                        </Tooltip>
                      </Popconfirm>
                    </div>
                  </Space>
                  : null
              }
            </span>
          )
        }}
      />
      <Modal title="修改API分组名称" open={editModal} footer={[]} onCancel={() => setEditModal(false)} forceRender={true}>
        <ProForm
          formRef={modalFormRef}
          name="edit"
          onFinish={async (values) => {
            console.log(values)
            updateTreeTitle(values).then((res) => {
              res === true ? message.success("修改成功") : message.error("修改失败");
              getApiTrees1().then((res) => setTreeData(handleTreeData(res)));
            });
            setEditModal(false);
          }}
        >
          <ProFormText name="id" hidden />
          <ProFormText name="parentId" hidden />
          <ProFormText name="menuType" hidden />
          <ProFormText
            width="md"
            name="menuName"
            label="名称"
            rules={[{ required: true, message: '这是必填项' }]}
          />
        </ProForm>
      </Modal>
      <Modal title="添加API分组" open={addModal} footer={[]} onCancel={() => setAddModal(false)} >
        <ProForm
          formRef={modalFormRef}
          name="add"
          onFinish={async (values) => {
            addTreeTitle({
              id: "",
              menuName: values?.menuName,
              parentId: values?.分组 === "同级结构" ? treeParams?.parentId : treeParams?.id,
              menuType: treeParams?.menuType,
            }).then((res) => {
              res === true ? message.success("添加成功") : message.error("添加失败");
              getApiTrees1().then((res) => setTreeData(handleTreeData(res)));
            });
            setAddModal(false);
          }}
          layout={'horizontal'}
        >
          <ProFormRadio.Group
            name={"分组"}
            label="位置"
            width="md"
            options={[
              {
                label: '同级结构',
                value: '同级结构',
              },
              {
                label: '子集结构',
                value: '子集结构',
              },
            ]}
            rules={[{ required: true, message: '这是必选项' }]}
          />
          <ProFormText
            width="md"
            name="menuName"
            label="名称"
            rules={[{ required: true, message: '这是必填项' }]}
          />
        </ProForm>
      </Modal>
    </div >
  );
};

export default App;
