import { request } from '@umijs/max';

/** 分页获取所有服务信息列表*/
export async function getServicesList(
  params: {
    pageSize?: number;
    current?: number;
    keyword?: string; //关键字查询
  },
  options?: { [key: string]: any },
) {
  let response = await request<{
    data: API.ApiList;
  }>('/services/page', {
    method: 'GET',
    params: {
      pageSize: params.pageSize,
      pageNum: params.current,
    },
    ...(options || {}),
  })
    .then((res: any) => {
      console.log(res);
      return {
        data: res?.data.data,
        total: res?.data.total,
        success: res?.success,
        pageSize: res?.data.pageSize,
        current: res?.pageNum,
      };
    })
    .catch((error: any) => console.log(error));
  return response;
}

/** 删除服务信息接口 */
export async function deleteServiceInfo(id: any) {
  return request(`/services/${id}`, {
    method: 'DELETE',
  }).catch((error: any) => console.log(error));
}

/** 根据id获取服务详细信息 */
export async function getServiceDetails(id: any) {
  return request(`/services/detail/${id}`, {
    method: 'GET',
  })
    .then((res) => res)
    .catch((error: any) => console.log(error));
}

/** 添加服务信息 */
export async function addService(data = {}) {
  return request('/services', {
    method: 'POST',
    data: data,
  }).catch((error: any) => console.log(error));
}
/** 更新服务信息 */
export async function updateService(data = {}) {
  return request(`/services/${data?.id}`, {
    method: 'PUT',
    data: data,
  }).catch((error: any) => console.log(error));
}

/** 更新服务信息 */
export async function testUrl(data = {}) {
  return request('/service/http/testUrl', {
    method: 'POST',
    data: data,
  }).catch((error: any) => console.log(error));
}
