import {request, METHOD} from '@/utils/request'
import { transformAbpListQuery } from '@/utils/abp'
export async function getList(params) {
    return request(`/api/wechat-management/mini-programs/mini-program`, METHOD.GET, transformAbpListQuery(params))
}
export async function createOrUpdate(params) {
    if (params.id) {
        return request(`/api/wechat-management/mini-programs/mini-program/${params.id}`, METHOD.PUT, params)
    }
    return request("/api/wechat-management/mini-programs/mini-program", METHOD.POST, params)
}
export async function del(id) {
    return request(`/api/wechat-management/mini-programs/mini-program/${id}`, METHOD.DELETE)
}
export async function get(id) {
    return request(`/api/wechat-management/mini-programs/mini-program/${id}`, METHOD.GET)
}
