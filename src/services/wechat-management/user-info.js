import {request, METHOD} from '@/utils/request'
import { transformAbpListQuery } from '@/utils/abp'
export async function getList(params) {
    return request(`/api/wechat-management/mini-programs/user-info`, METHOD.GET, transformAbpListQuery(params))
}


export async function get(id) {
    return request(`/api/wechat-management/mini-programs/user-info/${id}`, METHOD.GET)
}
