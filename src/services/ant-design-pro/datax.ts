import { request } from '@umijs/max';
import { nanoid } from 'nanoid';

/** 分页获取所有API服务列表 /dataApis/page */
/**ProTable的request请求要求的返回格式必须要求
 * 有 data, pageSize, current
 * 或者 data, total
 */
export async function getApiList(
  params: {
    pageSize?: number;
    current?: number;
  },
  options?: { [key: string]: any },
) {
  let response = await request<{
    data: API.ApiList;
  }>('/dataApis/page', {
    method: 'GET',
    params: {
      pageSize: params.pageSize,
      pageNum: params.current,
    },
    ...(options || {}),
  }).then((res: any) => {
    return {
      data: res?.data.data,
      total: res?.data.total,
      success: res?.success,
      pageSize: res?.data.pageSize,
      current: res.pageNum,
    };
  }).catch((error: any) => console.log(error));
  return response;
}

// request={async (params = {}) => {
//     let response = await request('/dataApis/page',
//         {
//             method: 'GET',
//             params: {
//                 pageSize: params.pageSize,
//                 pageNum: params.current,
//             },
//         }).then((res: any) => res?.data?.data);
//     return Promise.resolve(response);
// }}

/** 拷贝API接口 */
export async function copyApiInfo(id: any) {
  return request(`/dataApis/${id}/copy`, {
    method: 'POST',
  }).catch((error) => console.log(error));
}
/** 删除API接口 */
export async function deleteApiInfo(id: any) {
  return request(`/dataApis/${id}`, {
    method: 'DELETE',
  }).catch((error: any) => console.log(error));
}
/** 根据id获取API详细信息 */
export async function getApiDetails(id: any) {
  return request(`/dataApis/${id}`, {
    method: 'GET',
  }).then((res: { data: any; }) => res.data).catch((error: any) => console.log(error));
}
/** 下载API接口文档 */
export async function downloadApiDoc(id: any) {
  return request(`/dataApis/word/${id}`, {
    method: 'POST',
    responseType: 'blob',
  })
    .then((res: Blob | MediaSource) => {
      //注意：如果res是二进制流字符串而不是blob，则需要通过new Blob([res])转化成blob
      let downloadElement = document.createElement('a');
      let href = window.URL.createObjectURL(res); //创建下载的链接
      downloadElement.href = href;
      downloadElement.download = '接口文档.docx'; //下载后文件名
      document.body.appendChild(downloadElement);
      downloadElement.style.display = 'none';
      downloadElement.click(); //点击下载
      document.body.removeChild(downloadElement); //下载完成移除元素
      window.URL.revokeObjectURL(href); //释放掉blob对象
    })
    .catch((error: any) => {
      console.log(error);
    });
}
/** 获取api树输出结构 */
export async function getApiTrees1() {
  return request("/dataApis/trees/1", {
    method: 'GET',
  }).then((res: { data: any; }) => res.data).catch((error: any) => console.log(error));
}
/** 获取api树输入结构 */
export async function getApiTrees2() {
  return request("/dataApis/trees/2", {
    method: 'GET',
  }).then((res: { data: any; }) => res.data).catch((error: any) => console.log(error));
}
/** 修改api树的title */
export async function updateTreeTitle(params: any) {
  return request('/dataApis/updatetree', {
    method: "PUT",
    data: params
  }).then((res) => res.data).catch((error: any) => console.log(error))

}
/** 添加api树的title */
export async function addTreeTitle(params: any) {
  return request('/dataApis/addtree', {
    method: "POST",
    data: params
  }).then((res) => res.data).catch((error: any) => console.log(error))

}
/** 删除api树的结构title */
export async function deleteTreeTitle(id: any) {
  return request(`/dataApis/deletetree/${id}`, {
    method: "DELETE",
  }).then((res) => res.data).catch((error: any) => console.log(error))

}
/** 测试连通性 */
export async function testConnectivityApi(data = {}) {
  let res = await request('/sources/checkConnection', {
    method: "POST",
    data: data,
  }).catch((error: any) => console.log(error))
  return res?.code;
}
/** 元数据同步 */
export async function testSync(id: any) {
  return request(`/sources/sync/${id}`, {
    method: "POST",
  }).catch((error: any) => console.log(error))
}
/** 添加 */
export async function addSources(data = {}) {
  return request('/sources', {
    method: "POST",
    data: data,
  }).catch((error: any) => console.log(error))
}
/** 数据源分页查询 */
export async function getSourcesPages(params: any) {
  return request('/sources/page', {
    method: "GET",
    params: {
      pageSize: params.pageSize,
      pageNum: params.current,
    },
  }).then((res: any) => res.data).catch((error: any) => console.log(error))
}
/** 删除数据源卡片接口 */
export async function deleteDataSource(ids: any) {
  return request(`/sources/batch/${ids}`, {
    method: 'DELETE',
  }).catch((error: any) => console.log(error));
}
/** 更新数据源卡片接口 */
export async function updateDataSource({ id = "", params = {} }) {
  return request(`/sources/${id}`, {
    method: 'PUT',
    data: params,
  }).catch((error: any) => console.log(error));
}
/**
 * 根据数据源获取数据库的表
 * @param id 数据源的id号
 * @returns []
 */
export async function getDatabaseTableName(id: string) {
  return request(`/sources/${id}/tables`, {
    method: "GET",
  }).then((res) => {
    let table = (res.data || []).map((d: { tableName: string; tableComment: any; }) => {
      return { label: d.tableName, value: d.tableName };
    });
    return table;
  }).catch((error: any) => console.log(error));
}
/**
 * 获取数据源
 * @returns 
 */
export async function getDatasourceList() {
  return request("/sources/list", {
    method: "GET",
  }).then((res) => {
    let table = (res.data || []).map((d: any) => {
      return { label: d.sourceName, value: d.id };
    });
    return table;
  }).catch((error: any) => console.log(error));
}
/**
 * 获取数据表的内容
 * @returns 
 */
export async function getTableColumn(params: any) {
  return await request(`/sources/${params?.id}/${params?.tableName}/columns`, {
    method: "GET",
  }).then((res) => {
    console.log(res.data);

    return handleAddColumnId(res.data);
  }).catch((error: any) => console.log(error));
}

const handleAddColumnId = function (tableData: any) {
  let newTableData: any[] = [];
  tableData.map((col: any) => {
    newTableData.push({
      ...col,
      columnName: col.colName,
      col_id: nanoid(),
      reqable: [], // 默认不勾选
      resable: ['1'],// 默认勾选
    })
  });
  console.log(newTableData)
  return newTableData;
}

/** 添加API */
export async function addDataApis(data = {}) {
  return request('/dataApis', {
    method: "POST",
    data: data,
  }).catch((error: any) => console.log(error))
}
/** 修改API */
export async function updateDataApis(data: any) {
  return request(`/dataApis/${data?.id}`, {
    method: "PUT",
    data: data,
  }).catch((error: any) => console.log(error))
}

/** 发布API */
export async function releaseApi(id: any) {
  return request(`/dataApis/${id}/release`, {
    method: 'POST',
  }).catch((error) => console.log(error));
}
/** 通过ID获取带有请求头部的详细信息 */
export async function detailAndHeaderApi(id: any) {
  return request(`/dataApis/detail/${id}`, {
    method: 'GET',
  }).then((res) => res.data).catch((error) => console.log(error));
}
/** 查看api信息 执行操作接口 */
export async function execute({ apiKey, secretKey }: { apiKey: string, secretKey: string }) {
  const headers = {
    "api_key": apiKey,
    "secret_key": secretKey,
  }
  return request(`/service/execute`, {
    method: 'POST',
    headers: headers,
    data: {}
  }).then((res) => res).catch((error) => console.log(error));
}
/** 取消发布 */
export async function cancel(id: string) {
  return request(`/dataApis/${id}/cancel`, {
    method: 'POST',
  }).then((res: object) => res).catch((error) => console.log(error));
}

