import { MyIcon } from "@/services/utils/icon";
import { PlusCircleOutlined } from "@ant-design/icons";
import { CheckCard, PageContainer, ProCard, ProColumns, ProList, ProTable, } from "@ant-design/pro-components"
import { Image, Progress, Tag } from "antd";


const data = [
    {
        "id": "1240185865539600385",
        "status": "1",
        "createTime": null,
        "remark": null,
        "dbType": "1",
        "sourceName": "mysql数据库",
        "dbSchema": {
            "host": "localhost",
            "port": 3306,
            "username": "root",
            "password": "1234@abcd",
            "dbName": "foodmart2",
            "sid": null
        },
        "isSync": "1"
    },
    {
        "id": "1336474987430793217",
        "status": "1",
        "createTime": null,
        "remark": null,
        "dbType": "1",
        "sourceName": "robot数据库",
        "dbSchema": {
            "host": "localhost",
            "port": 3306,
            "username": "root",
            "password": "1234@abcd",
            "dbName": "robot",
            "sid": null
        },
        "isSync": "2"
    },
    {
        "id": "1336474987430793217",
        "status": "1",
        "createTime": null,
        "remark": null,
        "dbType": "1",
        "sourceName": "robot数据库",
        "dbSchema": {
            "host": "localhost",
            "port": 3306,
            "username": "root",
            "password": "1234@abcd",
            "dbName": "robot",
            "sid": null
        },
        "isSync": "2"
    },
    {
        "id": "1336474987430793217",
        "status": "1",
        "createTime": null,
        "remark": null,
        "dbType": "1",
        "sourceName": "robot数据库",
        "dbSchema": {
            "host": "localhost",
            "port": 3306,
            "username": "root",
            "password": "1234@abcd",
            "dbName": "robot",
            "sid": null
        },
        "isSync": "2"
    },
    {
        "id": "1336474987430793217",
        "status": "1",
        "createTime": null,
        "remark": null,
        "dbType": "1",
        "sourceName": "robot数据库",
        "dbSchema": {
            "host": "localhost",
            "port": 3306,
            "username": "root",
            "password": "1234@abcd",
            "dbName": "robot",
            "sid": null
        },
        "isSync": "2"
    },
    {
        "id": "1336474987430793217",
        "status": "1",
        "createTime": null,
        "remark": null,
        "dbType": "1",
        "sourceName": "robot数据库",
        "dbSchema": {
            "host": "localhost",
            "port": 3306,
            "username": "root",
            "password": "1234@abcd",
            "dbName": "robot",
            "sid": null
        },
        "isSync": "2"
    },
    {
        "id": "1336474987430793217",
        "status": "1",
        "createTime": null,
        "remark": null,
        "dbType": "1",
        "sourceName": "robot数据库",
        "dbSchema": {
            "host": "localhost",
            "port": 3306,
            "username": "root",
            "password": "1234@abcd",
            "dbName": "robot",
            "sid": null
        },
        "isSync": "2"
    },
    {
        "id": "1336474987430793217",
        "status": "1",
        "createTime": null,
        "remark": null,
        "dbType": "1",
        "sourceName": "robot数据库",
        "dbSchema": {
            "host": "localhost",
            "port": 3306,
            "username": "root",
            "password": "1234@abcd",
            "dbName": "robot",
            "sid": null
        },
        "isSync": "2"
    },
    {
        "id": "1336474987430793217",
        "status": "1",
        "createTime": null,
        "remark": null,
        "dbType": "1",
        "sourceName": "robot数据库",
        "dbSchema": {
            "host": "localhost",
            "port": 3306,
            "username": "root",
            "password": "1234@abcd",
            "dbName": "robot",
            "sid": null
        },
        "isSync": "2"
    },
    {
        "id": "1336474987430793217",
        "status": "1",
        "createTime": null,
        "remark": null,
        "dbType": "1",
        "sourceName": "robot数据库",
        "dbSchema": {
            "host": "localhost",
            "port": 3306,
            "username": "root",
            "password": "1234@abcd",
            "dbName": "robot",
            "sid": null
        },
        "isSync": "2"
    },
    {
        "id": "1336474987430793217",
        "status": "1",
        "createTime": null,
        "remark": null,
        "dbType": "1",
        "sourceName": "robot数据库",
        "dbSchema": {
            "host": "localhost",
            "port": 3306,
            "username": "root",
            "password": "1234@abcd",
            "dbName": "robot",
            "sid": null
        },
        "isSync": "2"
    },
    {
        "id": "1336474987430793217",
        "status": "1",
        "createTime": null,
        "remark": null,
        "dbType": "1",
        "sourceName": "robot数据库",
        "dbSchema": {
            "host": "localhost",
            "port": 3306,
            "username": "root",
            "password": "1234@abcd",
            "dbName": "robot",
            "sid": null
        },
        "isSync": "2"
    }
].map((item: any) => ({
    title: item?.sourceName,
    subTitle: <Tag color="#5BD8A6">数据源</Tag>,
    actions: [<a key="run">操作1</a>, <a key="delete">操作2</a>],
    avatar: <Image src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" />,
    extra: item?.isSync === "1" ? "" : <MyIcon type="icon-group43" />,
    // description: "卡号是的尽快哈手机看电视",
    content: (
        <div
            style={{
                flex: 1,
            }}
        >
            <div
                style={{
                    width: 200,
                }}
            >
                <div>发布中</div>
                <Progress percent={80} />
            </div>

        </div>
    ),
}))
console.log(data)
const metasColumn = {
    title: {},
    subTitle: {},
    type: {},
    avatar: {},
    content: {},
    description: { dataIndex: 'sourceName' },
    actions: {},
    extra: {},
}
export default () => {

    return (
        <PageContainer>
            <ProList
                pagination={{
                    defaultPageSize: 8,
                    showSizeChanger: false,
                }}
                grid={{ gutter: 16, column: 4 }}
                onItem={(record: any) => {
                    return {
                        onClick: () => {
                            console.log(record);
                        },
                    };
                }}
                rowSelection={{}}
                showActions="hover"
                metas={metasColumn}
                headerTitle="卡片列表展示"
                dataSource={data}
            />
        </PageContainer>
    )
}