import { request } from '@umijs/max';

/** 分页获取所有API服务列表 /dataApis/page */
/**ProTable的request请求要求的返回格式必须要求
 * 有 data, pageSize, current
 * 或者 data, total
 */
export async function getApiList(
    params: {
        pageSize?: number,
        current?: number,
    }, options?: { [key: string]: any }) {
    var response = await request<{
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
        }
    });
    return response;
}

            // request={async (params = {}) => {
            //     var response = await request('/dataApis/page',
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
export async function copyApiInfo(id:any){
    return request(`/dataApis/${id}/copy`, {
        method: 'POST',
      });
}
/** 删除API接口 */
export async function deleteApiInfo(id:any){
    return request(`/dataApis/${id}`, {
        method: 'DELETE',
      });
}