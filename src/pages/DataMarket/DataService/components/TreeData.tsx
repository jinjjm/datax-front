import { addTreeTitle, deleteTreeTitle, updateTreeTitle } from '@/services/ant-design-pro/datax';
import { MyIcon } from '@/services/utils/icon';
import { ProForm, ProFormInstance, ProFormRadio, ProFormText } from '@ant-design/pro-components';
import { message, Modal, Popconfirm, Tooltip, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import React, { useMemo, useRef, useState } from 'react';

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
  const [NodeTreeItem, setNodeTreeItem] = useState<{
    pageX?: any;
    pageY?: any;
    id?: any;
    name?: any;
    category?: number;
  }>();
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const modalFormRef = useRef<ProFormInstance<any>>();

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    console.log('ExpandedKeys : ', newExpandedKeys);
    setAutoExpandParent(false);
    setNodeTreeItem({});
  };
  const onSelect = (keys: React.Key[], info: any) => {
    console.log('keys', keys);
    console.log(info.node);
    console.log('key', info.node.key);
    console.log('title', info.node.title);
    setNodeTreeItem({});
    console.log(expandedKeys);
  };
  const onRightClick = (treeNode: { event: any; node: any }) => {
    console.log('event', treeNode.event);
    console.log('node', treeNode.node);
    let x = treeNode.event?.currentTarget?.offsetLeft + treeNode.event?.currentTarget?.clientWidth;
    let y = treeNode.event?.currentTarget?.offsetTop + 17;
    setNodeTreeItem({
      pageX: x,
      pageY: y,
      id: treeNode.node.key,
      name: treeNode.node.title,
      category: treeNode.node.children ? 1 : 0,
    });
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
    message.info('添加');
    setAddModal(true);
  };

  const handleEditSub = () => {
    message.info("编辑")
    setEditModal(true);
  };

  const getNodeTreeMenu = () => {
    const { pageX, pageY } = { ...NodeTreeItem };
    return (
      <div
        style={{
          position: 'absolute',
          maxHeight: 40,
          textAlign: 'center',
          left: `${pageX + 30}px`,
          top: `${pageY}px`,
          display: 'flex',
          flexDirection: 'row',
        }}
      >
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
          <Popconfirm title="请再次确认删除" onConfirm={() => deleteTreeTitle(NodeTreeItem?.id)}>
            <Tooltip placement="bottom" title="删除">
              <MyIcon type="icon-shanchu1" />
            </Tooltip>
          </Popconfirm>
        </div>
      </div>
    );
  };

  const treeData = useMemo(() => {
    const data = [
      {
        title: '路网中心',
        key: '1',
        icon: <MyIcon type="icon-file" />,
        children: [
          {
            title: '13楼',
            key: '1-1',
            icon: <MyIcon type="icon-file" />,
            children: [
              {
                title: 'API-1',
                key: '1-1-1',
                icon: <MyIcon type="icon-jiekou" />,
                isLeaf: true,
              },
              {
                title: 'API-2',
                key: '1-1-2',
                icon: <MyIcon type="icon-jiekou" />,
                isLeaf: true,
              },
            ],
          },
          {
            title: '6楼',
            key: '1-2',
            icon: <MyIcon type="icon-file" />,
            children: [
              {
                title: 'API-3',
                key: '1-2-1',
                icon: <MyIcon type="icon-jiekou" />,
                isLeaf: true,
              },
            ],
          },
        ],
      },
      {
        title: '其他单位',
        key: '2',
        icon: <MyIcon type="icon-file" />,
        children: [
          {
            title: 'API-3',
            key: '2-1-1',
            icon: <MyIcon type="icon-jiekou" />,
          },
        ],
      },
    ];

    return data;
  }, [searchValue]);

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
      />
      {NodeTreeItem?.category === 1 ? getNodeTreeMenu() : ''}
      <Modal title="修改API分组名称" open={editModal} footer={[]} onCancel={() => setEditModal(false)}>
        <ProForm
          formRef={modalFormRef}
          name="edit"
          initialValues={{
            title: NodeTreeItem?.name,
            id: NodeTreeItem?.id,
          }}
          onFinish={async (values) => {
            console.log(values);
            //修改tree-data
            updateTreeTitle(values?.id, values?.title);
            setEditModal(false);
          }}
        >
          <ProFormText width="md" name="id" hidden />
          <ProFormText
            width="md"
            name="title"
            required
            label="名称"
            rules={[{ required: true, message: '这是必填项' }]}
          />
        </ProForm>
      </Modal>
      <Modal title="添加API分组" open={addModal} footer={[]} onCancel={() => setAddModal(false)}>
        <ProForm
          formRef={modalFormRef}
          name="add"
          initialValues={{
            id: NodeTreeItem?.id,
          }}
          onFinish={async (values) => {
            console.log(values);
            addTreeTitle(values?.id, values?.name, values?.fenzu)
            setAddModal(false);
          }}
          layout={'horizontal'}
        >
          <ProFormText width="md" name="id" hidden />
          <ProFormRadio.Group
            name={"fenzu"}
            label="位置"
            width="md"
            options={[
              {
                label: '同级结构',
                value: 'tongji',
              },
              {
                label: '子集结构',
                value: 'ziji',
              },
            ]}
          />
          <ProFormText
            width="md"
            name="name"
            required
            label="名称"
            rules={[{ required: true, message: '这是必填项' }]}
          />
        </ProForm>
      </Modal>
    </div>
  );
};

export default App;
