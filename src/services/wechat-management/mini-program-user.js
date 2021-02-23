import {request, METHOD} from '@/utils/request'
import { transformAbpListQuery } from '@/utils/abp'
export async function getList(params) {
    return request(`/api/wechat-management/mini-programs/mini-program-user`, METHOD.GET, transformAbpListQuery(params))
}


export async function get(id) {
    return request(`/api/wechat-management/mini-programs/mini-program-user/${id}`, METHOD.GET)
}
