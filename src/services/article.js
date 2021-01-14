import {request, METHOD} from '@/utils/request'
import { transformAbpListQuery } from '@/utils/abp'
export async function getList(params) {
    return request("/api/app/article", METHOD.GET, transformAbpListQuery(params))
}
export async function edit(params) {
    if (params.id) {
        return request(`/api/app/article/${params.id}`, METHOD.PUT, params)
    }
    return request("/api/app/article", METHOD.POST, params)
}
export async function del(id) {
    return request(`/api/app/article/${id}`, METHOD.DELETE)
}
export async function dels(ids) {
    let idsStr='';
    ids.map((item,index) => {
        if(index>0){
            idsStr+='&';
        }
        idsStr+=`ids=${item}`;
    });
    return request(`/api/app/article?${idsStr}`, METHOD.DELETE)
}
export async function get(id) {
    return request(`/api/app/article/${id}`, METHOD.GET)
}
export default {
    getList,
    edit,
    del,
    dels,
    get
  }
  