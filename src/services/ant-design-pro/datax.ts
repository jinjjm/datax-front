import { request } from '@umijs/max';

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
      data: res.data.data,
      total: res.data.total,
      success: res.success,
      pageSize: res.data.pageSize,
      current: res.current,
    };
  });
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
  });
}
/** 删除API接口 */
export async function deleteApiInfo(id: any) {
  return request(`/dataApis/${id}`, {
    method: 'DELETE',
  });
}
/** 根据id获取API详细信息 */
export async function getApiDetails(id: any) {
  return request(`/dataApis/${id}`, {
    method: 'GET',
  }).then((res) => res.data);
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
    .catch((error) => {
      console.log(error);
    });
}
